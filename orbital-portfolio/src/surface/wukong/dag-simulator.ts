import type { DagBoardConfig } from "../types.js";
import { createKvStore, computeNodeValue } from "./dag-ops.js";
import type { KvStore } from "./dag-ops.js";
import { STORAGE_WRITE_DURATION } from "./timing.js";

// ---------------------------------------------------------------------------
// Public types — the simulator's observable state
// ---------------------------------------------------------------------------

export type ExecutorPhase =
  | "idle"
  | "executing"
  | "writing-output"
  | "checking-deps"
  | "invoking"
  | "terminated";

export interface Executor {
  readonly id: string;
  readonly schedule: readonly string[];
  cursor: number;
  phase: ExecutorPhase;
  phaseTimer: number;
  currentTask: string | null;
  invokedBy: string | null;
}

export interface DagNodeState {
  readonly id: string;
  readonly label: string;
  status: "pending" | "ready" | "executing" | "completed";
  assignedExecutor: string | null;
  depCounter: number;
  depsTotal: number;
}

export interface SimulatorSnapshot {
  readonly nodes: ReadonlyMap<string, DagNodeState>;
  readonly executors: readonly Executor[];
  readonly activeEdges: ReadonlySet<string>;
  readonly completedFraction: number;
  readonly phase: SimPhase;
  readonly events: readonly SimEvent[];
  readonly kvStore: KvStore;
}

export type SimPhase =
  | "partitioning"
  | "invoking-leaves"
  | "executing"
  | "completed"
  | "resetting";

export type SimEventKind = "write-kv" | "increment-dep" | "check-dep";

export interface SimEvent {
  kind: SimEventKind;
  executorId: string;
  taskId: string;
  targetTaskId?: string;
}

// ---------------------------------------------------------------------------
// Timing constants (seconds)
// ---------------------------------------------------------------------------

const PARTITION_DURATION = 3.5;
const INVOKE_DURATION = 3.5;
const TASK_EXECUTE_DURATION_MIN = 6.0;
const TASK_EXECUTE_DURATION_RANGE = 5.0;
const WRITE_OUTPUT_DURATION = 3.0;
const DEP_CHECK_DURATION = 2;
const INVOKE_CHILD_DURATION = 2.0;
const RESET_PAUSE = 3.0;
const TASK_DURATION_JITTER = 0.01;

// ---------------------------------------------------------------------------
// Graph analysis helpers
// ---------------------------------------------------------------------------

interface DagGraph {
  adj: Map<string, string[]>;
  reverseAdj: Map<string, string[]>;
  inDegree: Map<string, number>;
  outDegree: Map<string, number>;
}

function buildGraph(config: DagBoardConfig): DagGraph {
  const adj = new Map<string, string[]>();
  const reverseAdj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();

  for (const n of config.nodes) {
    adj.set(n.id, []);
    reverseAdj.set(n.id, []);
    inDegree.set(n.id, 0);
    outDegree.set(n.id, 0);
  }

  for (const e of config.edges) {
    adj.get(e.from)!.push(e.to);
    reverseAdj.get(e.to)!.push(e.from);
    inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1);
    outDegree.set(e.from, (outDegree.get(e.from) ?? 0) + 1);
  }

  return { adj, reverseAdj, inDegree, outDegree };
}

function findLeafNodes(graph: DagGraph): string[] {
  const leaves: string[] = [];
  for (const [id, deg] of graph.inDegree) {
    if (deg === 0) leaves.push(id);
  }
  return leaves;
}

function computeStaticSchedule(leafId: string, graph: DagGraph): string[] {
  const schedule: string[] = [];
  const visited = new Set<string>();

  function dfs(nodeId: string): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    schedule.push(nodeId);
    const children = graph.adj.get(nodeId) ?? [];
    if (children.length > 0) {
      dfs(children[0]);
    }
  }

  dfs(leafId);
  return schedule;
}

// ---------------------------------------------------------------------------
// Deferred storage writes
// ---------------------------------------------------------------------------

interface PendingWrite {
  kind: "kv" | "dep";
  taskId: string;
  targetTaskId?: string;
  timer: number;
}

// ---------------------------------------------------------------------------
// Simulator
// ---------------------------------------------------------------------------

export class DagSimulator {
  private readonly config: DagBoardConfig;
  private readonly graph: DagGraph;
  private readonly nodeStates: Map<string, DagNodeState>;
  private readonly executorList: Executor[];
  private readonly activeEdgeSet: Set<string>;
  private readonly eventQueue: SimEvent[];
  private readonly kv = createKvStore();
  private readonly pendingWrites: PendingWrite[] = [];

  private simPhase: SimPhase = "partitioning";
  private phaseTimer = 0;
  private executorIdCounter = 0;
  private totalNodes: number;

  constructor(config: DagBoardConfig) {
    this.config = config;
    this.graph = buildGraph(config);
    this.nodeStates = new Map();
    this.executorList = [];
    this.activeEdgeSet = new Set();
    this.eventQueue = [];
    this.totalNodes = config.nodes.length;

    this.reset();
  }

  get snapshot(): SimulatorSnapshot {
    const completed = [...this.nodeStates.values()].filter(
      (n) => n.status === "completed",
    ).length;
    return {
      nodes: this.nodeStates,
      executors: this.executorList,
      activeEdges: this.activeEdgeSet,
      completedFraction: completed / this.totalNodes,
      phase: this.simPhase,
      events: this.eventQueue,
      kvStore: this.kv,
    };
  }

  reset(): void {
    this.nodeStates.clear();
    for (const n of this.config.nodes) {
      const depsTotal = this.graph.inDegree.get(n.id) ?? 0;
      this.nodeStates.set(n.id, {
        id: n.id,
        label: n.label,
        status: depsTotal === 0 ? "ready" : "pending",
        assignedExecutor: null,
        depCounter: 0,
        depsTotal,
      });
    }

    this.executorList.length = 0;
    this.activeEdgeSet.clear();
    this.eventQueue.length = 0;
    this.pendingWrites.length = 0;
    this.kv.clear();
    this.executorIdCounter = 0;
    this.simPhase = "partitioning";
    this.phaseTimer = 0;
  }

  update(delta: number): void {
    this.eventQueue.length = 0;
    this.drainPendingWrites(delta);
    this.phaseTimer += delta;

    switch (this.simPhase) {
      case "partitioning":
        this.updatePartitioning();
        break;
      case "invoking-leaves":
        this.updateInvokingLeaves();
        break;
      case "executing":
        this.updateExecuting(delta);
        break;
      case "completed":
        this.updateCompleted();
        break;
      case "resetting":
        this.updateResetting();
        break;
    }
  }

  // --- Deferred storage writes ---

  private drainPendingWrites(delta: number): void {
    for (let i = this.pendingWrites.length - 1; i >= 0; i--) {
      const pw = this.pendingWrites[i];
      pw.timer -= delta;
      if (pw.timer > 0) continue;
      this.pendingWrites.splice(i, 1);

      if (pw.kind === "kv") {
        const value = computeNodeValue(pw.taskId, this.config, this.kv);
        this.kv.set(pw.taskId, value);
      } else {
        const child = this.nodeStates.get(pw.taskId);
        if (!child) continue;
        child.depCounter++;
        if (child.depCounter >= child.depsTotal && child.status === "pending") {
          child.status = "ready";
          this.spawnExecutorIfNeeded(pw.taskId);
        }
      }
    }
  }

  private spawnExecutorIfNeeded(nodeId: string): void {
    for (const executor of this.executorList) {
      if (executor.phase === "terminated") continue;
      if (executor.schedule.includes(nodeId)) return;
    }
    const schedule = computeStaticSchedule(nodeId, this.graph);
    this.spawnExecutor(schedule, null);
  }

  // --- Phase: Partitioning ---

  private updatePartitioning(): void {
    if (this.phaseTimer >= PARTITION_DURATION) {
      this.simPhase = "invoking-leaves";
      this.phaseTimer = 0;
    }
  }

  // --- Phase: Invoking leaf executors ---

  private updateInvokingLeaves(): void {
    if (this.phaseTimer >= INVOKE_DURATION) {
      const leaves = findLeafNodes(this.graph);
      for (const leafId of leaves) {
        const schedule = computeStaticSchedule(leafId, this.graph);
        this.spawnExecutor(schedule, null);
      }
      this.simPhase = "executing";
      this.phaseTimer = 0;
    }
  }

  // --- Phase: Active execution ---

  private updateExecuting(delta: number): void {
    if (this.allNodesCompleted()) {
      this.simPhase = "completed";
      this.phaseTimer = 0;
      return;
    }

    for (const executor of this.executorList) {
      if (executor.phase === "terminated") continue;
      executor.phaseTimer += delta;
      this.stepExecutor(executor);
    }
  }

  private stepExecutor(executor: Executor): void {
    switch (executor.phase) {
      case "idle":
        this.executorAdvanceToNextTask(executor);
        break;

      case "executing":
        this.executorUpdateExecuting(executor);
        break;

      case "writing-output":
        this.executorUpdateWritingOutput(executor);
        break;

      case "checking-deps":
        this.executorUpdateCheckingDeps(executor);
        break;

      case "invoking":
        this.executorUpdateInvoking(executor);
        break;
    }
  }

  private executorAdvanceToNextTask(executor: Executor): void {
    if (executor.cursor >= executor.schedule.length) {
      executor.phase = "terminated";
      return;
    }

    const taskId = executor.schedule[executor.cursor];
    const node = this.nodeStates.get(taskId);
    if (!node) {
      executor.cursor++;
      return;
    }

    if (node.status === "completed" || node.status === "executing") {
      executor.cursor++;
      return;
    }

    if (node.status === "pending") {
      executor.phase = "terminated";
      return;
    }

    node.status = "executing";
    node.assignedExecutor = executor.id;
    executor.currentTask = taskId;
    executor.phase = "executing";
    executor.phaseTimer = 0;
  }

  private executorUpdateExecuting(executor: Executor): void {
    const duration =
      TASK_EXECUTE_DURATION_MIN +
      Math.random() * TASK_EXECUTE_DURATION_RANGE * TASK_DURATION_JITTER;

    if (executor.phaseTimer >= duration) {
      executor.phase = "writing-output";
      executor.phaseTimer = 0;
      if (executor.currentTask) {
        this.eventQueue.push({
          kind: "write-kv",
          executorId: executor.id,
          taskId: executor.currentTask,
        });
        this.pendingWrites.push({
          kind: "kv",
          taskId: executor.currentTask,
          timer: STORAGE_WRITE_DURATION,
        });
      }
    }
  }

  private executorUpdateWritingOutput(executor: Executor): void {
    if (executor.phaseTimer < WRITE_OUTPUT_DURATION) return;

    const taskId = executor.currentTask!;
    const node = this.nodeStates.get(taskId)!;
    node.status = "completed";
    node.assignedExecutor = null;

    const children = this.graph.adj.get(taskId) ?? [];
    this.satisfyDependencies(executor.id, taskId, children);

    if (children.length === 0) {
      executor.cursor++;
      executor.currentTask = null;
      executor.phase = "idle";
      executor.phaseTimer = 0;
      return;
    }

    if (children.length === 1) {
      this.handleBecomesEdge(executor, taskId, children[0]);
      return;
    }

    this.handleFanOut(executor, taskId, children);
  }

  private handleBecomesEdge(
    executor: Executor,
    fromId: string,
    toId: string,
  ): void {
    this.activeEdgeSet.add(`${fromId}->${toId}`);
    const toNode = this.nodeStates.get(toId)!;

    if (toNode.status === "ready" || toNode.status === "pending") {
      if (toNode.depCounter >= toNode.depsTotal) {
        executor.currentTask = null;
        const idx = executor.schedule.indexOf(toId);
        executor.cursor = idx >= 0 ? idx : executor.schedule.length;
        executor.phase = "idle";
        executor.phaseTimer = 0;
      } else {
        executor.phase = "checking-deps";
        executor.phaseTimer = 0;
        this.eventQueue.push({
          kind: "check-dep",
          executorId: executor.id,
          taskId: fromId,
          targetTaskId: toId,
        });
      }
    } else {
      executor.cursor++;
      executor.currentTask = null;
      executor.phase = "idle";
      executor.phaseTimer = 0;
    }
  }

  private handleFanOut(
    executor: Executor,
    fromId: string,
    children: string[],
  ): void {
    const becomesChild = children[0];
    this.activeEdgeSet.add(`${fromId}->${becomesChild}`);

    for (let i = 1; i < children.length; i++) {
      const childId = children[i];
      this.activeEdgeSet.add(`${fromId}->${childId}`);
      const childNode = this.nodeStates.get(childId)!;
      if (
        childNode.depCounter >= childNode.depsTotal &&
        childNode.status !== "completed" &&
        childNode.status !== "executing"
      ) {
        const schedule = computeStaticSchedule(childId, this.graph);
        this.spawnExecutor(schedule, executor.id);
      }
    }

    executor.phase = "invoking";
    executor.phaseTimer = 0;
    executor.currentTask = null;

    const becomesIdx = executor.schedule.indexOf(becomesChild);
    executor.cursor = becomesIdx >= 0 ? becomesIdx : executor.schedule.length;
  }

  private executorUpdateCheckingDeps(executor: Executor): void {
    if (executor.phaseTimer < DEP_CHECK_DURATION) return;

    const nextIdx = executor.cursor;
    if (nextIdx >= executor.schedule.length) {
      executor.phase = "terminated";
      return;
    }

    const taskId = executor.schedule[nextIdx];
    const node = this.nodeStates.get(taskId);

    if (!node || node.status === "completed" || node.status === "executing") {
      executor.cursor++;
      executor.phase = "idle";
      executor.phaseTimer = 0;
      return;
    }

    if (node.depCounter >= node.depsTotal) {
      node.status = "ready";
      executor.phase = "idle";
      executor.phaseTimer = 0;
    } else {
      executor.phase = "terminated";
    }
  }

  private executorUpdateInvoking(executor: Executor): void {
    if (executor.phaseTimer >= INVOKE_CHILD_DURATION) {
      executor.phase = "idle";
      executor.phaseTimer = 0;
    }
  }

  // --- Dependency management ---

  private satisfyDependencies(
    executorId: string,
    completedId: string,
    children: string[],
  ): void {
    for (const childId of children) {
      const child = this.nodeStates.get(childId);
      if (!child) continue;
      this.eventQueue.push({
        kind: "increment-dep",
        executorId,
        taskId: completedId,
        targetTaskId: childId,
      });
      this.pendingWrites.push({
        kind: "dep",
        taskId: childId,
        timer: STORAGE_WRITE_DURATION,
      });
    }
  }

  // --- Executor management ---

  private spawnExecutor(
    schedule: string[],
    invokedBy: string | null,
  ): Executor {
    const id = `E${this.executorIdCounter++}`;
    const executor: Executor = {
      id,
      schedule,
      cursor: 0,
      phase: "idle",
      phaseTimer: 0,
      currentTask: null,
      invokedBy,
    };
    this.executorList.push(executor);
    return executor;
  }

  // --- Completion checks ---

  private allNodesCompleted(): boolean {
    for (const node of this.nodeStates.values()) {
      if (node.status !== "completed") return false;
    }
    return true;
  }

  private updateCompleted(): void {
    if (this.phaseTimer >= RESET_PAUSE) {
      this.simPhase = "resetting";
      this.phaseTimer = 0;
    }
  }

  private updateResetting(): void {
    if (this.phaseTimer >= 1.0) {
      this.reset();
    }
  }
}
