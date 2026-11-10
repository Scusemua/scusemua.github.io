import * as THREE from "three";
import { toon, edgeMaterial } from "../../world/rendering.js";
import { $ } from "../../state.js";
import type { Architecture } from "../types.js";
import type { SurfaceHooks, SurfaceContext } from "../hooks.js";
import { DagSimulator } from "./dag-simulator.js";
import type { Executor, SimulatorSnapshot, SimEvent } from "./dag-simulator.js";
import { buildDagBoard, renderDagCanvas } from "./dag-renderer.js";
import type { DagBoard } from "./dag-renderer.js";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

interface InvocationPulse {
  curve: THREE.CubicBezierCurve3;
  mesh: THREE.Mesh;
  t: number;
  speed: number;
}

interface LambdaLifecycle {
  compId: string;
  group: THREE.Group;
  phase:
    | "spawning"
    | "waiting-for-pulse"
    | "idle"
    | "executing"
    | "invoking"
    | "despawning";
  phaseTimer: number;
  taskIndicator: THREE.Mesh | null;
  taskNodeId: string | null;
  taskLabelEl: HTMLElement | null;
  executionDuration: number;
  idleDuration: number;
  spawnScale: number;
  spawnPulse: InvocationPulse | null;
}

interface TaskCube {
  mesh: THREE.Mesh;
  t: number;
  speed: number;
}

interface TaskFunnel {
  target: THREE.Vector3;
  cubes: TaskCube[];
  interval: number;
  timer: number;
  material: THREE.ShaderMaterial;
  edgeMat: THREE.LineBasicMaterial;
}

interface WukongState {
  dagBoard: DagBoard | null;
  dagSimulator: DagSimulator | null;
  lambdaLifecycles: LambdaLifecycle[];
  invocationPulses: InvocationPulse[];
  storagePulses: InvocationPulse[];
  taskFunnels: TaskFunnel[];
  executorToLambda: Map<string, number>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LAMBDA_SCALE = 0.18;
const SPAWN_DURATION = 0.5;
const DESPAWN_DURATION = 0.4;
const INVOKING_DURATION = 0.4;
const STORAGE_PULSE_COLOR_KV = "#c8956a";
const STORAGE_PULSE_COLOR_META = "#82bd6f";
const STORAGE_PULSE_SPEED = 1.2;

const _v3 = new THREE.Vector3();

// ---------------------------------------------------------------------------
// Task indicator helpers
// ---------------------------------------------------------------------------

function createTaskIndicator(
  position: THREE.Vector3,
  scene: THREE.Scene,
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const mat = toon("#60d8ff");
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(position);
  mesh.position.y += 3.5;
  const edges = new THREE.EdgesGeometry(geo, 30);
  const edgeLine = new THREE.LineSegments(edges, edgeMaterial);
  mesh.add(edgeLine);
  scene.add(mesh);
  return mesh;
}

function clearTaskVisuals(lc: LambdaLifecycle, scene: THREE.Scene): void {
  if (lc.taskIndicator) {
    scene.remove(lc.taskIndicator);
    lc.taskIndicator = null;
  }
  if (lc.taskLabelEl) {
    lc.taskLabelEl.remove();
    lc.taskLabelEl = null;
  }
  lc.taskNodeId = null;
}

function updateTaskIndicatorVisuals(
  lc: LambdaLifecycle,
  elapsed: number,
  camera: THREE.PerspectiveCamera,
): void {
  if (!lc.taskIndicator) return;
  lc.taskIndicator.rotation.y += 0.016 * 4;
  lc.taskIndicator.rotation.x += 0.016 * 2;
  lc.taskIndicator.position.y =
    lc.group.position.y + 3.5 + 0.15 * Math.sin(elapsed * 4);
  const brightness = 0.8 + 0.2 * Math.sin(elapsed * 6);
  lc.taskIndicator.scale.setScalar(brightness);

  if (lc.taskLabelEl) {
    _v3.copy(lc.group.position);
    _v3.y += 4.5;
    _v3.project(camera);
    const lx = (_v3.x * 0.5 + 0.5) * innerWidth;
    const ly = (-_v3.y * 0.5 + 0.5) * innerHeight;
    lc.taskLabelEl.style.transform = `translate3d(${lx}px,${ly}px,0) translateX(-50%)`;
    lc.taskLabelEl.style.visibility =
      _v3.z > -1 && _v3.z < 1 ? "visible" : "hidden";
  }
}

function updateExecutingColor(lc: LambdaLifecycle, elapsed: number): void {
  const mat = (lc.group.children[0] as THREE.Mesh)
    .material as THREE.ShaderMaterial;
  if (mat.uniforms?.uColor) {
    const base = new THREE.Color("#60d8ff");
    base.lerp(new THREE.Color("#f0c050"), 0.3 + 0.3 * Math.sin(elapsed * 5));
    mat.uniforms.uColor.value.copy(base);
  }
}

function resetLambdaColor(lc: LambdaLifecycle, arch: Architecture): void {
  const comp = arch.components.find((c) => c.id === lc.compId);
  const mat = (lc.group.children[0] as THREE.Mesh)
    .material as THREE.ShaderMaterial;
  if (comp && mat.uniforms?.uColor) {
    mat.uniforms.uColor.value.set(comp.color);
  }
}

// ---------------------------------------------------------------------------
// Pulse helpers
// ---------------------------------------------------------------------------

function spawnInvocationPulse(
  from: THREE.Vector3,
  to: THREE.Vector3,
  scene: THREE.Scene,
): InvocationPulse {
  const mid = from.clone().lerp(to, 0.5);
  mid.y += 2.5;
  const cp1 = from.clone().lerp(mid, 0.5);
  cp1.y += 1.5;
  const cp2 = mid.clone().lerp(to, 0.5);
  cp2.y += 1.5;
  const curve = new THREE.CubicBezierCurve3(from.clone(), cp1, cp2, to.clone());

  const geo = new THREE.SphereGeometry(0.2, 8, 6);
  const mat = toon("#ff9040");
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(from);
  scene.add(mesh);

  return { curve, mesh, t: 0, speed: 0.8 };
}

function spawnStoragePulse(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color: string,
  scene: THREE.Scene,
): InvocationPulse {
  const mid = from.clone().lerp(to, 0.5);
  mid.y += 1.8;
  const cp1 = from.clone().lerp(mid, 0.5);
  cp1.y += 1.0;
  const cp2 = mid.clone().lerp(to, 0.5);
  cp2.y += 1.0;
  const curve = new THREE.CubicBezierCurve3(from.clone(), cp1, cp2, to.clone());

  const geo = new THREE.SphereGeometry(0.15, 8, 6);
  const mat = toon(color);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(from);
  scene.add(mesh);

  return { curve, mesh, t: 0, speed: STORAGE_PULSE_SPEED };
}

function updatePulses(
  pulses: InvocationPulse[],
  scene: THREE.Scene,
  delta: number,
): void {
  for (let i = pulses.length - 1; i >= 0; i--) {
    const pulse = pulses[i];
    pulse.t += delta * pulse.speed;
    if (pulse.t >= 1) {
      scene.remove(pulse.mesh);
      pulses.splice(i, 1);
    } else {
      const pt = pulse.curve.getPoint(pulse.t);
      pulse.mesh.position.copy(pt);
      const glow = 1 + 0.3 * Math.sin(pulse.t * Math.PI);
      pulse.mesh.scale.setScalar(glow);
    }
  }
}

// ---------------------------------------------------------------------------
// Simulator-driven Lambda sync
// ---------------------------------------------------------------------------

function findInvocationSource(
  executor: Executor,
  ctx: SurfaceContext,
  ws: WukongState,
): THREE.Vector3 | null {
  if (!executor.invokedBy) {
    const invokerGroup = ctx.components.get("invokers");
    if (invokerGroup) return invokerGroup.position;
    return null;
  }
  const parentLambdaIdx = ws.executorToLambda.get(executor.invokedBy);
  if (parentLambdaIdx !== undefined) {
    const parentLc = ws.lambdaLifecycles[parentLambdaIdx];
    if (parentLc) return parentLc.group.position;
  }
  return null;
}

function pickInvocationTarget(
  lc: LambdaLifecycle,
  ws: WukongState,
): LambdaLifecycle | null {
  const others = ws.lambdaLifecycles.filter((l) => l.compId !== lc.compId);
  if (others.length === 0) return null;
  return others[Math.floor(Math.random() * others.length)];
}

function syncLambdasToSimulator(
  ctx: SurfaceContext,
  ws: WukongState,
  snapshot: SimulatorSnapshot,
  delta: number,
): void {
  const activeExecutors = snapshot.executors.filter(
    (e) => e.phase !== "terminated",
  );
  const lambdas = ws.lambdaLifecycles;

  if (snapshot.phase === "partitioning" || snapshot.phase === "resetting") {
    ws.executorToLambda.clear();
  }

  const activeIds = new Set(activeExecutors.map((e) => e.id));

  for (const [eid, li] of ws.executorToLambda) {
    if (!activeIds.has(eid)) {
      ws.executorToLambda.delete(eid);
      const lc = lambdas[li];
      if (lc && lc.group.scale.x > 0) {
        clearTaskVisuals(lc, ctx.scene);
        resetLambdaColor(lc, ctx.architecture);
        lc.phase = "despawning";
        lc.phaseTimer = 0;
      }
    }
  }

  const usedSlots = new Set(ws.executorToLambda.values());
  for (const executor of activeExecutors) {
    if (ws.executorToLambda.has(executor.id)) continue;
    for (let i = 0; i < lambdas.length; i++) {
      if (!usedSlots.has(i)) {
        ws.executorToLambda.set(executor.id, i);
        usedSlots.add(i);
        const lc = lambdas[i];

        const sourcePos = findInvocationSource(executor, ctx, ws);
        if (sourcePos) {
          const pulse = spawnInvocationPulse(
            sourcePos,
            lc.group.position,
            ctx.scene,
          );
          ws.invocationPulses.push(pulse);
          lc.spawnPulse = pulse;
          lc.phase = "waiting-for-pulse";
        } else if (lc.group.scale.x === 0) {
          lc.phase = "spawning";
          lc.phaseTimer = 0;
          lc.spawnScale = 0;
        }
        break;
      }
    }
  }

  for (let i = 0; i < lambdas.length; i++) {
    const lc = lambdas[i];
    lc.phaseTimer += delta;

    let executor: Executor | undefined;
    for (const [eid, li] of ws.executorToLambda) {
      if (li === i) {
        executor = activeExecutors.find((e) => e.id === eid);
        break;
      }
    }

    if (!executor) {
      if (lc.phase === "despawning") {
        const shrink = 1 - Math.min(lc.phaseTimer / DESPAWN_DURATION, 1);
        lc.group.scale.setScalar(shrink * LAMBDA_SCALE);
        if (shrink <= 0) lc.group.scale.setScalar(0);
      }
      if (lc.phase === "waiting-for-pulse" && lc.spawnPulse) {
        if (lc.spawnPulse.t >= 1) {
          lc.spawnPulse = null;
          lc.phase = "spawning";
          lc.phaseTimer = 0;
          lc.spawnScale = 0;
        }
      }
      continue;
    }

    switch (lc.phase) {
      case "waiting-for-pulse": {
        if (!lc.spawnPulse || lc.spawnPulse.t >= 1) {
          lc.spawnPulse = null;
          lc.phase = "spawning";
          lc.phaseTimer = 0;
          lc.spawnScale = 0;
        }
        break;
      }
      case "spawning": {
        lc.spawnScale = Math.min(lc.phaseTimer / SPAWN_DURATION, 1);
        const ease = lc.spawnScale * (2 - lc.spawnScale);
        lc.group.scale.setScalar(ease * LAMBDA_SCALE);
        if (lc.spawnScale >= 1) {
          lc.phase = "idle";
          lc.phaseTimer = 0;
          const comp = ctx.architecture.components.find(
            (c) => c.id === lc.compId,
          );
          if (comp) lc.group.scale.set(...comp.scale);
        }
        break;
      }
      case "idle":
      case "despawning": {
        if (lc.group.scale.x === 0) {
          lc.phase = "spawning";
          lc.phaseTimer = 0;
          lc.spawnScale = 0;
          break;
        }
        if (executor.phase === "executing" && executor.currentTask) {
          lc.phase = "executing";
          lc.phaseTimer = 0;
          lc.taskNodeId = executor.currentTask;
          lc.taskIndicator = createTaskIndicator(lc.group.position, ctx.scene);
          const node = ws.dagBoard?.config.nodes.find(
            (n) => n.id === executor.currentTask,
          );
          if (node) {
            const el = document.createElement("div");
            el.className = "surface-task-label";
            el.textContent = `⚡ ${node.label}()`;
            $("surface-labels").appendChild(el);
            lc.taskLabelEl = el;
          }
        }
        break;
      }
      case "executing": {
        updateTaskIndicatorVisuals(lc, ctx.elapsed, ctx.camera);
        updateExecutingColor(lc, ctx.elapsed);

        if (executor.phase !== "executing") {
          clearTaskVisuals(lc, ctx.scene);
          resetLambdaColor(lc, ctx.architecture);

          if (executor.phase === "invoking") {
            lc.phase = "invoking";
            lc.phaseTimer = 0;
            const target = pickInvocationTarget(lc, ws);
            if (target) {
              ws.invocationPulses.push(
                spawnInvocationPulse(
                  lc.group.position,
                  target.group.position,
                  ctx.scene,
                ),
              );
            }
          } else {
            lc.phase = "idle";
            lc.phaseTimer = 0;
          }
        }
        break;
      }
      case "invoking": {
        if (lc.phaseTimer >= INVOKING_DURATION) {
          lc.phase = "idle";
          lc.phaseTimer = 0;
        }
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Standalone Lambda lifecycle (no DAG simulator)
// ---------------------------------------------------------------------------

function updateLambdaLifecyclesStandalone(
  ctx: SurfaceContext,
  ws: WukongState,
  delta: number,
): void {
  for (const lc of ws.lambdaLifecycles) {
    lc.phaseTimer += delta;
    switch (lc.phase) {
      case "spawning": {
        lc.spawnScale = Math.min(lc.phaseTimer / SPAWN_DURATION, 1);
        const ease = lc.spawnScale * (2 - lc.spawnScale);
        lc.group.scale.setScalar(ease * LAMBDA_SCALE);
        if (lc.spawnScale >= 1) {
          lc.phase = "idle";
          lc.phaseTimer = 0;
          const comp = ctx.architecture.components.find(
            (c) => c.id === lc.compId,
          );
          if (comp) lc.group.scale.set(...comp.scale);
        }
        break;
      }
      case "idle": {
        if (lc.phaseTimer >= lc.idleDuration) {
          lc.phase = "executing";
          lc.phaseTimer = 0;
          lc.executionDuration = 1.5 + Math.random() * 2;
          lc.taskIndicator = createTaskIndicator(lc.group.position, ctx.scene);
        }
        break;
      }
      case "executing": {
        updateTaskIndicatorVisuals(lc, ctx.elapsed, ctx.camera);
        updateExecutingColor(lc, ctx.elapsed);
        if (lc.phaseTimer >= lc.executionDuration) {
          clearTaskVisuals(lc, ctx.scene);
          resetLambdaColor(lc, ctx.architecture);
          lc.phase = "invoking";
          lc.phaseTimer = 0;
          const target = pickInvocationTarget(lc, ws);
          if (target) {
            ws.invocationPulses.push(
              spawnInvocationPulse(
                lc.group.position,
                target.group.position,
                ctx.scene,
              ),
            );
          }
        }
        break;
      }
      case "invoking": {
        if (lc.phaseTimer >= INVOKING_DURATION) {
          lc.phase = "despawning";
          lc.phaseTimer = 0;
        }
        break;
      }
      case "despawning": {
        const shrink = 1 - Math.min(lc.phaseTimer / DESPAWN_DURATION, 1);
        lc.group.scale.setScalar(shrink * LAMBDA_SCALE);
        if (shrink <= 0) {
          lc.phase = "spawning";
          lc.phaseTimer = 0;
          lc.spawnScale = 0;
          lc.idleDuration = 1 + Math.random() * 1.5;
          const comp = ctx.architecture.components.find(
            (c) => c.id === lc.compId,
          );
          if (comp) {
            const dx = (Math.random() - 0.5) * 3;
            const dz = (Math.random() - 0.5) * 3;
            lc.group.position.set(
              comp.position[0] + dx,
              comp.position[1],
              comp.position[2] + dz,
            );
          }
        }
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Sim event consumption → storage pulses
// ---------------------------------------------------------------------------

function consumeSimEvents(
  ctx: SurfaceContext,
  ws: WukongState,
  events: readonly SimEvent[],
): void {
  const metadataGroup = ctx.components.get("metadata");
  const kvStoreGroup = ctx.components.get("kv-store");

  for (const event of events) {
    const lambdaIdx = ws.executorToLambda.get(event.executorId);
    if (lambdaIdx === undefined) continue;
    const lc = ws.lambdaLifecycles[lambdaIdx];
    if (!lc) continue;
    const sourcePos = lc.group.position;

    switch (event.kind) {
      case "write-kv": {
        if (kvStoreGroup) {
          ws.storagePulses.push(
            spawnStoragePulse(
              sourcePos,
              kvStoreGroup.position,
              STORAGE_PULSE_COLOR_KV,
              ctx.scene,
            ),
          );
        }
        break;
      }
      case "increment-dep":
      case "check-dep": {
        if (metadataGroup) {
          ws.storagePulses.push(
            spawnStoragePulse(
              sourcePos,
              metadataGroup.position,
              STORAGE_PULSE_COLOR_META,
              ctx.scene,
            ),
          );
        }
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Label augmentation — executor IDs on Lambda labels
// ---------------------------------------------------------------------------

function updateLambdaLabels(ctx: SurfaceContext, ws: WukongState): void {
  if (!ws.dagSimulator) return;
  const snapshot = ws.dagSimulator.snapshot;
  const lambdaExecutorIds = new Map<string, string>();
  for (const [eid, li] of ws.executorToLambda) {
    const lc = ws.lambdaLifecycles[li];
    const executor = snapshot.executors.find((e) => e.id === eid);
    if (lc && executor && executor.phase !== "terminated") {
      lambdaExecutorIds.set(lc.compId, eid);
    }
  }

  for (const comp of ctx.architecture.components) {
    if (comp.shape !== "lambda") continue;
    const label = ctx.labels.get(comp.id);
    if (!label) continue;
    const eid = lambdaExecutorIds.get(comp.id);
    label.innerHTML = eid
      ? `<strong>λ ${eid}</strong>`
      : `<strong>${comp.label}</strong>`;
  }
}

// ---------------------------------------------------------------------------
// Exported hooks
// ---------------------------------------------------------------------------

export function createWukongHooks(): SurfaceHooks {
  let ws: WukongState | null = null;

  return {
    onBuild(ctx: SurfaceContext): void {
      const arch = ctx.architecture;
      const hasDag = !!arch.dagBoard;

      // Task funnels for factory components
      const taskFunnels: TaskFunnel[] = [];
      for (const comp of arch.components) {
        if (comp.shape !== "factory") continue;
        const pos = new THREE.Vector3(...comp.position);
        const funnelMat = toon("#f5d060");
        const funnelEdgeMat = new THREE.LineBasicMaterial({ color: "#10131d" });
        taskFunnels.push({
          target: pos.clone().add(new THREE.Vector3(0, 3.6, 0)),
          cubes: [],
          interval: 0.8,
          timer: 0,
          material: funnelMat,
          edgeMat: funnelEdgeMat,
        });
      }

      // Lambda lifecycles
      const lambdaLifecycles: LambdaLifecycle[] = [];
      for (const comp of arch.components) {
        if (comp.shape !== "lambda") continue;
        const group = ctx.components.get(comp.id);
        if (!group) continue;
        if (hasDag) group.scale.setScalar(0);
        lambdaLifecycles.push({
          compId: comp.id,
          group,
          phase: hasDag ? "idle" : "spawning",
          phaseTimer: 0,
          taskIndicator: null,
          taskNodeId: null,
          taskLabelEl: null,
          executionDuration: 2 + Math.random() * 2,
          idleDuration: 1.5 + Math.random() * 1.5,
          spawnScale: 0,
          spawnPulse: null,
        });
      }

      // DAG board + simulator
      let dagBoard: DagBoard | null = null;
      let dagSimulator: DagSimulator | null = null;
      if (arch.dagBoard) {
        dagBoard = buildDagBoard(arch.dagBoard, ctx.scene);
        dagSimulator = new DagSimulator(arch.dagBoard);
        renderDagCanvas(dagBoard, dagSimulator.snapshot);
      }

      ws = {
        dagBoard,
        dagSimulator,
        lambdaLifecycles,
        invocationPulses: [],
        storagePulses: [],
        taskFunnels,
        executorToLambda: new Map(),
      };
    },

    onUpdate(ctx: SurfaceContext, delta: number): void {
      if (!ws) return;

      // Task funnels
      const cubeGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      const cubeEdges = new THREE.EdgesGeometry(cubeGeo, 30);
      for (const funnel of ws.taskFunnels) {
        funnel.timer += delta;
        if (funnel.timer >= funnel.interval) {
          funnel.timer -= funnel.interval;
          const cube = new THREE.Mesh(cubeGeo, funnel.material);
          const spawnX = funnel.target.x + (Math.random() - 0.5) * 1.6;
          const spawnZ = funnel.target.z + (Math.random() - 0.5) * 1.6;
          cube.position.set(spawnX, funnel.target.y + 4, spawnZ);
          cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            0,
          );
          const edgeLine = new THREE.LineSegments(cubeEdges, funnel.edgeMat);
          cube.add(edgeLine);
          ctx.scene.add(cube);
          funnel.cubes.push({
            mesh: cube,
            t: 0,
            speed: 1.5 + Math.random() * 0.5,
          });
        }
        for (let i = funnel.cubes.length - 1; i >= 0; i--) {
          const tc = funnel.cubes[i];
          tc.t += delta * tc.speed;
          tc.mesh.position.y = funnel.target.y + 4 - tc.t * 4;
          tc.mesh.rotation.x += delta * 2;
          tc.mesh.rotation.z += delta * 1.5;
          const scale = tc.t > 0.85 ? Math.max(0, 1 - (tc.t - 0.85) / 0.15) : 1;
          tc.mesh.scale.setScalar(scale);
          if (tc.t >= 1) {
            ctx.scene.remove(tc.mesh);
            funnel.cubes.splice(i, 1);
          }
        }
      }

      // DAG simulator + Lambda sync
      if (ws.dagSimulator && ws.dagBoard) {
        ws.dagSimulator.update(delta);
        const snapshot = ws.dagSimulator.snapshot;
        syncLambdasToSimulator(ctx, ws, snapshot, delta);
        consumeSimEvents(ctx, ws, snapshot.events);
        updatePulses(ws.invocationPulses, ctx.scene, delta);
        updatePulses(ws.storagePulses, ctx.scene, delta);
        renderDagCanvas(ws.dagBoard, snapshot);
      } else {
        updateLambdaLifecyclesStandalone(ctx, ws, delta);
        updatePulses(ws.invocationPulses, ctx.scene, delta);
      }
    },

    onUpdateLabels(ctx: SurfaceContext): void {
      if (!ws) return;
      updateLambdaLabels(ctx, ws);
    },

    onDispose(ctx: SurfaceContext): void {
      if (!ws) return;
      for (const lc of ws.lambdaLifecycles) {
        if (lc.taskIndicator) ctx.scene.remove(lc.taskIndicator);
        if (lc.taskLabelEl) lc.taskLabelEl.remove();
      }
      for (const pulse of ws.invocationPulses) ctx.scene.remove(pulse.mesh);
      for (const pulse of ws.storagePulses) ctx.scene.remove(pulse.mesh);
      ws = null;
    },
  };
}
