import * as THREE from "three";
import { toon, edgeMaterial } from "../../world/rendering.js";
import { $ } from "../../state.js";
import type { Architecture } from "../types.js";
import type { SurfaceContext } from "../hooks.js";
import type { Executor, SimulatorSnapshot } from "./dag-simulator.js";
import type { DagBoard } from "./dag-renderer.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InvocationPulse {
  curve: THREE.CubicBezierCurve3;
  mesh: THREE.Mesh;
  t: number;
  speed: number;
}

export interface LambdaLifecycle {
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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LAMBDA_SCALE = 0.18;
const SPAWN_DURATION = 0.5;
const DESPAWN_DURATION = 0.4;
const INVOKING_DURATION = 0.4;

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

export function clearTaskVisuals(
  lc: LambdaLifecycle,
  scene: THREE.Scene,
): void {
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

export function resetLambdaColor(
  lc: LambdaLifecycle,
  arch: Architecture,
): void {
  const comp = arch.components.find((c) => c.id === lc.compId);
  const mat = (lc.group.children[0] as THREE.Mesh)
    .material as THREE.ShaderMaterial;
  if (comp && mat.uniforms?.uColor) {
    mat.uniforms.uColor.value.set(comp.color);
  }
}

// ---------------------------------------------------------------------------
// Pulse spawning
// ---------------------------------------------------------------------------

export function spawnInvocationPulse(
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

export function spawnStoragePulse(
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

  return { curve, mesh, t: 0, speed: 1.2 };
}

export function updatePulses(
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
// Sim event consumption → storage pulses
// ---------------------------------------------------------------------------

const STORAGE_PULSE_COLOR_KV = "#c8956a";
const STORAGE_PULSE_COLOR_META = "#82bd6f";

export function consumeSimEvents(
  ctx: SurfaceContext,
  lambdas: LambdaLifecycle[],
  executorToLambda: Map<string, number>,
  storagePulses: InvocationPulse[],
  events: readonly import("./dag-simulator.js").SimEvent[],
): void {
  const metadataGroup = ctx.components.get("metadata");
  const kvStoreGroup = ctx.components.get("kv-store");

  for (const event of events) {
    const lambdaIdx = executorToLambda.get(event.executorId);
    if (lambdaIdx === undefined) continue;
    const lc = lambdas[lambdaIdx];
    if (!lc) continue;
    const sourcePos = lc.group.position;

    switch (event.kind) {
      case "write-kv": {
        if (kvStoreGroup) {
          storagePulses.push(
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
          storagePulses.push(
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
// Build lambdas
// ---------------------------------------------------------------------------

export function buildLambdaLifecycles(
  ctx: SurfaceContext,
  hasDag: boolean,
): LambdaLifecycle[] {
  const lifecycles: LambdaLifecycle[] = [];
  for (const comp of ctx.architecture.components) {
    if (comp.shape !== "lambda") continue;
    const group = ctx.components.get(comp.id);
    if (!group) continue;
    if (hasDag) group.scale.setScalar(0);
    lifecycles.push({
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
  return lifecycles;
}

// ---------------------------------------------------------------------------
// Simulator-driven Lambda sync
// ---------------------------------------------------------------------------

function findInvocationSource(
  executor: Executor,
  ctx: SurfaceContext,
  lambdas: LambdaLifecycle[],
  executorToLambda: Map<string, number>,
): THREE.Vector3 | null {
  if (!executor.invokedBy) {
    const invokerGroup = ctx.components.get("invokers");
    if (invokerGroup) return invokerGroup.position;
    return null;
  }
  const parentLambdaIdx = executorToLambda.get(executor.invokedBy);
  if (parentLambdaIdx !== undefined) {
    const parentLc = lambdas[parentLambdaIdx];
    if (parentLc) return parentLc.group.position;
  }
  return null;
}

function pickInvocationTarget(
  lc: LambdaLifecycle,
  lambdas: LambdaLifecycle[],
): LambdaLifecycle | null {
  const others = lambdas.filter((l) => l.compId !== lc.compId);
  if (others.length === 0) return null;
  return others[Math.floor(Math.random() * others.length)];
}

export function syncLambdasToSimulator(
  ctx: SurfaceContext,
  lambdas: LambdaLifecycle[],
  invocationPulses: InvocationPulse[],
  executorToLambda: Map<string, number>,
  dagBoard: DagBoard | null,
  snapshot: SimulatorSnapshot,
  delta: number,
): void {
  const activeExecutors = snapshot.executors.filter(
    (e) => e.phase !== "terminated",
  );

  if (snapshot.phase === "partitioning" || snapshot.phase === "resetting") {
    executorToLambda.clear();
  }

  const activeIds = new Set(activeExecutors.map((e) => e.id));

  for (const [eid, li] of executorToLambda) {
    if (!activeIds.has(eid)) {
      executorToLambda.delete(eid);
      const lc = lambdas[li];
      if (lc && lc.group.scale.x > 0) {
        clearTaskVisuals(lc, ctx.scene);
        resetLambdaColor(lc, ctx.architecture);
        lc.phase = "despawning";
        lc.phaseTimer = 0;
      }
    }
  }

  const usedSlots = new Set(executorToLambda.values());
  for (const executor of activeExecutors) {
    if (executorToLambda.has(executor.id)) continue;
    for (let i = 0; i < lambdas.length; i++) {
      if (!usedSlots.has(i)) {
        executorToLambda.set(executor.id, i);
        usedSlots.add(i);
        const lc = lambdas[i];

        const sourcePos = findInvocationSource(
          executor,
          ctx,
          lambdas,
          executorToLambda,
        );
        if (sourcePos) {
          const pulse = spawnInvocationPulse(
            sourcePos,
            lc.group.position,
            ctx.scene,
          );
          invocationPulses.push(pulse);
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
    for (const [eid, li] of executorToLambda) {
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
          const node = dagBoard?.config.nodes.find(
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
            const target = pickInvocationTarget(lc, lambdas);
            if (target) {
              invocationPulses.push(
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

export function updateLambdaLifecyclesStandalone(
  ctx: SurfaceContext,
  lambdas: LambdaLifecycle[],
  invocationPulses: InvocationPulse[],
  delta: number,
): void {
  for (const lc of lambdas) {
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
          const target = pickInvocationTarget(lc, lambdas);
          if (target) {
            invocationPulses.push(
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
// Label augmentation — executor IDs on Lambda labels
// ---------------------------------------------------------------------------

export function updateLambdaLabels(
  ctx: SurfaceContext,
  lambdas: LambdaLifecycle[],
  executorToLambda: Map<string, number>,
  snapshot: SimulatorSnapshot,
): void {
  const lambdaExecutorIds = new Map<string, string>();
  for (const [eid, li] of executorToLambda) {
    const lc = lambdas[li];
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
