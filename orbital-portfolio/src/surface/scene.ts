import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { architectureById } from "../data/architectures/index.js";
import { app, $ } from "../state.js";
import {
  toon,
  outlineMaterial,
  outline,
  edgeMaterial,
  createLambdaGeometry,
} from "../world/rendering.js";
import type {
  Architecture,
  ArchComponent,
  ArchConnection,
  ArchAnnotation,
} from "./types.js";
import { DagSimulator } from "./dag-simulator.js";
import type { Executor, SimulatorSnapshot } from "./dag-simulator.js";
import { buildDagBoard, renderDagCanvas } from "./dag-renderer.js";
import type { DagBoard } from "./dag-renderer.js";

// ---------------------------------------------------------------------------
// Dependency injection — populated by initSurface()
// ---------------------------------------------------------------------------

let renderer: THREE.WebGLRenderer;
let invalidate: () => void;
let scheduleFrame: () => void;

export function initSurface(deps: {
  renderer: THREE.WebGLRenderer;
  invalidate: () => void;
  scheduleFrame: () => void;
}): void {
  renderer = deps.renderer;
  invalidate = deps.invalidate;
  scheduleFrame = deps.scheduleFrame;
}

// ---------------------------------------------------------------------------
// Surface state
// ---------------------------------------------------------------------------

interface ParticleSystem {
  mesh: THREE.InstancedMesh;
  curve: THREE.CubicBezierCurve3;
  offsets: Float32Array;
  speed: number;
  count: number;
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

interface InvocationPulse {
  curve: THREE.CubicBezierCurve3;
  mesh: THREE.Mesh;
  t: number;
  speed: number;
}


interface SurfaceState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  architecture: Architecture;
  components: Map<string, THREE.Group>;
  annotations: Map<string, THREE.Mesh>;
  annotationList: string[];
  particleSystems: ParticleSystem[];
  taskFunnels: TaskFunnel[];
  lambdaLifecycles: LambdaLifecycle[];
  invocationPulses: InvocationPulse[];
  dagBoard: DagBoard | null;
  dagSimulator: DagSimulator | null;
  pickable: THREE.Object3D[];
  elapsed: number;
  lastFrame: number;
  activeAnnotation: string | null;
  labels: Map<string, HTMLElement>;
  tween: {
    started: number;
    from: THREE.Vector3;
    fromTarget: THREE.Vector3;
    to: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null;
}

let state: SurfaceState | null = null;

// Reusable objects for per-frame work
const _mat4 = new THREE.Matrix4();
const _v3 = new THREE.Vector3();
const _projection = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2();

// ---------------------------------------------------------------------------
// Geometry builders
// ---------------------------------------------------------------------------

function addToonPart(
  geometry: THREE.BufferGeometry,
  color: string,
  parent: THREE.Group,
  pos?: [number, number, number],
): void {
  const mat = toon(color);
  const mesh = new THREE.Mesh(geometry, mat);
  if (pos) mesh.position.set(...pos);
  parent.add(mesh);
  outline(geometry, parent);
  const edges = new THREE.EdgesGeometry(geometry, 30);
  const line = new THREE.LineSegments(edges, edgeMaterial);
  if (pos) line.position.set(...pos);
  parent.add(line);
}

function buildFactory(comp: ArchComponent): THREE.Group {
  const group = new THREE.Group();
  group.position.set(...comp.position);
  group.userData = { componentId: comp.id };
  const c = comp.color;

  // Main body — wide rectangular building
  addToonPart(new THREE.BoxGeometry(4, 2.4, 3), c, group, [0, 1.2, 0]);

  // Hopper/funnel on top — tapered cylinder
  const hopperGeo = new THREE.CylinderGeometry(0.6, 1.4, 1.2, 8);
  addToonPart(hopperGeo, "#d09030", group, [0, 3.0, 0]);

  // Chimney on the side
  addToonPart(
    new THREE.CylinderGeometry(0.3, 0.3, 2.0, 8),
    "#c07828",
    group,
    [1.5, 3.4, -0.8],
  );

  // Small loading dock on the front
  addToonPart(
    new THREE.BoxGeometry(1.2, 0.8, 0.6),
    "#c88530",
    group,
    [0, 0.4, 1.8],
  );

  return group;
}

function buildComponentMesh(comp: ArchComponent): THREE.Group {
  if (comp.shape === "factory") return buildFactory(comp);

  const group = new THREE.Group();
  group.position.set(...comp.position);
  if (comp.rotation) group.rotation.set(...comp.rotation);
  group.scale.set(...comp.scale);
  group.userData = { componentId: comp.id };

  let geometry: THREE.BufferGeometry;
  switch (comp.shape) {
    case "box":
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(1, 1, 1, 16);
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(1, 24, 16);
      break;
    case "lambda":
      geometry = createLambdaGeometry();
      break;
    case "hexprism":
      geometry = new THREE.CylinderGeometry(1, 1, 1, 6);
      break;
  }

  const material = toon(comp.color);
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  outline(geometry, group, comp.shape === "lambda" ? 1 : undefined);

  const edges = new THREE.EdgesGeometry(geometry, 30);
  const edgeLine = new THREE.LineSegments(edges, edgeMaterial);
  group.add(edgeLine);

  return group;
}

function buildGround(color: string): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(80, 80);
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.strokeStyle = "rgba(200,220,255,0.15)";
  ctx.lineWidth = 1;
  const step = 1024 / 32;
  for (let i = 0; i <= 1024; i += step) {
    ctx.beginPath();
    ctx.moveTo(i + 0.5, 0);
    ctx.lineTo(i + 0.5, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i + 0.5);
    ctx.lineTo(1024, i + 0.5);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  const material = toon(color, texture);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function buildAnnotationOrb(ann: ArchAnnotation): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.3, 16, 12);
  const material = toon(ann.color ?? "#f0c050");
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...ann.position);
  mesh.userData = { annotationId: ann.id };
  outline(geometry, mesh as unknown as THREE.Group, 1);
  return mesh;
}

function buildConnectionCurve(
  conn: ArchConnection,
  components: Map<string, THREE.Group>,
): { line: THREE.Line; curve: THREE.CubicBezierCurve3 } | null {
  const fromGroup = components.get(conn.from);
  const toGroup = components.get(conn.to);
  if (!fromGroup || !toGroup) return null;

  const from = fromGroup.position.clone();
  const to = toGroup.position.clone();
  const mid = from.clone().lerp(to, 0.5);
  const height = conn.curveHeight ?? 2;
  mid.y += height;

  const cp1 = from.clone().lerp(mid, 0.5);
  cp1.y += height * 0.5;
  const cp2 = mid.clone().lerp(to, 0.5);
  cp2.y += height * 0.5;

  const curve = new THREE.CubicBezierCurve3(from, cp1, cp2, to);
  const points = curve.getPoints(32);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: conn.color,
    transparent: true,
    opacity: 0.25,
  });
  const line = new THREE.Line(geometry, material);
  return { line, curve };
}

function buildParticleSystem(
  conn: ArchConnection,
  curve: THREE.CubicBezierCurve3,
): ParticleSystem {
  const count = conn.particleCount;
  const geometry = new THREE.SphereGeometry(0.12, 6, 4);
  const material = toon(conn.color);
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const offsets = new Float32Array(count);
  for (let i = 0; i < count; i++) offsets[i] = i / count;

  for (let i = 0; i < count; i++) {
    const point = curve.getPoint(offsets[i]);
    _mat4.makeTranslation(point.x, point.y, point.z);
    mesh.setMatrixAt(i, _mat4);
  }
  mesh.instanceMatrix.needsUpdate = true;

  return { mesh, curve, offsets, speed: conn.speed, count };
}


// ---------------------------------------------------------------------------
// Lambda lifecycle helpers
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

// ---------------------------------------------------------------------------
// Simulator-driven Lambda sync — maps executor state to 3D Lambda visuals
// ---------------------------------------------------------------------------

const LAMBDA_SCALE = 0.18;
const SPAWN_DURATION = 0.5;
const DESPAWN_DURATION = 0.4;
const INVOKING_DURATION = 0.4;

// Maps executor IDs to Lambda indices for stable visual assignment
let executorToLambda = new Map<string, number>();

function syncLambdasToSimulator(
  s: SurfaceState,
  snapshot: SimulatorSnapshot,
  delta: number,
): void {
  const activeExecutors = snapshot.executors.filter(
    (e) => e.phase !== "terminated",
  );
  const lambdas = s.lambdaLifecycles;

  // Reset mapping when sim cycles back to pre-execution phases
  if (snapshot.phase === "partitioning" || snapshot.phase === "resetting") {
    executorToLambda.clear();
  }

  // Build set of executor IDs that are still active
  const activeIds = new Set(activeExecutors.map((e) => e.id));

  // Remove stale mappings for terminated executors
  for (const [eid, li] of executorToLambda) {
    if (!activeIds.has(eid)) {
      executorToLambda.delete(eid);
      const lc = lambdas[li];
      if (lc && lc.group.scale.x > 0) {
        clearTaskVisuals(lc, s);
        resetLambdaColor(lc, s);
        lc.phase = "despawning";
        lc.phaseTimer = 0;
      }
    }
  }

  // Assign unassigned active executors to free Lambda slots
  const usedSlots = new Set(executorToLambda.values());
  for (const executor of activeExecutors) {
    if (executorToLambda.has(executor.id)) continue;
    for (let i = 0; i < lambdas.length; i++) {
      if (!usedSlots.has(i)) {
        executorToLambda.set(executor.id, i);
        usedSlots.add(i);
        const lc = lambdas[i];

        // Fire invocation pulse; Lambda waits for it to arrive before spawning
        const sourcePos = findInvocationSource(executor, s);
        if (sourcePos) {
          const pulse = spawnInvocationPulse(
            sourcePos,
            lc.group.position,
            s.scene,
          );
          s.invocationPulses.push(pulse);
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

  // Update each Lambda based on its assigned executor
  for (let i = 0; i < lambdas.length; i++) {
    const lc = lambdas[i];
    lc.phaseTimer += delta;

    // Find assigned executor for this Lambda slot
    let executor: Executor | undefined;
    for (const [eid, li] of executorToLambda) {
      if (li === i) {
        executor = activeExecutors.find((e) => e.id === eid);
        break;
      }
    }

    if (!executor) {
      // No executor assigned — finish despawn, then stay hidden
      if (lc.phase === "despawning") {
        const shrink = 1 - Math.min(lc.phaseTimer / DESPAWN_DURATION, 1);
        lc.group.scale.setScalar(shrink * LAMBDA_SCALE);
        if (shrink <= 0) lc.group.scale.setScalar(0);
      }
      // Keep waiting-for-pulse alive even without executor (pulse in flight)
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
          const comp = s.architecture.components.find(
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
          lc.taskIndicator = createTaskIndicator(lc.group.position, s.scene);
          const node = s.dagBoard?.config.nodes.find(
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
        updateTaskIndicatorVisuals(lc, s);
        updateExecutingColor(lc, s);

        if (executor.phase !== "executing") {
          clearTaskVisuals(lc, s);
          resetLambdaColor(lc, s);

          if (executor.phase === "invoking") {
            lc.phase = "invoking";
            lc.phaseTimer = 0;
            const target = pickInvocationTarget(lc, s);
            if (target) {
              s.invocationPulses.push(
                spawnInvocationPulse(
                  lc.group.position,
                  target.group.position,
                  s.scene,
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

function clearTaskVisuals(lc: LambdaLifecycle, s: SurfaceState): void {
  if (lc.taskIndicator) {
    s.scene.remove(lc.taskIndicator);
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
  s: SurfaceState,
): void {
  if (!lc.taskIndicator) return;
  const elapsed = s.elapsed;
  lc.taskIndicator.rotation.y += 0.016 * 4;
  lc.taskIndicator.rotation.x += 0.016 * 2;
  lc.taskIndicator.position.y =
    lc.group.position.y + 3.5 + 0.15 * Math.sin(elapsed * 4);
  const brightness = 0.8 + 0.2 * Math.sin(elapsed * 6);
  lc.taskIndicator.scale.setScalar(brightness);

  if (lc.taskLabelEl) {
    _v3.copy(lc.group.position);
    _v3.y += 4.5;
    _v3.project(s.camera);
    const lx = (_v3.x * 0.5 + 0.5) * innerWidth;
    const ly = (-_v3.y * 0.5 + 0.5) * innerHeight;
    lc.taskLabelEl.style.transform = `translate3d(${lx}px,${ly}px,0) translateX(-50%)`;
    lc.taskLabelEl.style.visibility =
      _v3.z > -1 && _v3.z < 1 ? "visible" : "hidden";
  }
}

function updateExecutingColor(lc: LambdaLifecycle, s: SurfaceState): void {
  const mat = (lc.group.children[0] as THREE.Mesh)
    .material as THREE.ShaderMaterial;
  if (mat.uniforms?.uColor) {
    const base = new THREE.Color("#60d8ff");
    base.lerp(
      new THREE.Color("#f0c050"),
      0.3 + 0.3 * Math.sin(s.elapsed * 5),
    );
    mat.uniforms.uColor.value.copy(base);
  }
}

function resetLambdaColor(lc: LambdaLifecycle, s: SurfaceState): void {
  const comp = s.architecture.components.find((c) => c.id === lc.compId);
  const mat = (lc.group.children[0] as THREE.Mesh)
    .material as THREE.ShaderMaterial;
  if (comp && mat.uniforms?.uColor) {
    mat.uniforms.uColor.value.set(comp.color);
  }
}

function findInvocationSource(
  executor: Executor,
  s: SurfaceState,
): THREE.Vector3 | null {
  if (!executor.invokedBy) {
    // Leaf executor — invoked by the factory/invokers component
    const invokerGroup = s.components.get("invokers");
    if (invokerGroup) return invokerGroup.position;
    return null;
  }
  // Fan-out — invoked by another executor's Lambda
  const parentLambdaIdx = executorToLambda.get(executor.invokedBy);
  if (parentLambdaIdx !== undefined) {
    const parentLc = s.lambdaLifecycles[parentLambdaIdx];
    if (parentLc) return parentLc.group.position;
  }
  return null;
}

function pickInvocationTarget(
  lc: LambdaLifecycle,
  s: SurfaceState,
): LambdaLifecycle | null {
  const others = s.lambdaLifecycles.filter((l) => l.compId !== lc.compId);
  if (others.length === 0) return null;
  return others[Math.floor(Math.random() * others.length)];
}

function updateInvocationPulses(s: SurfaceState, delta: number): void {
  for (let i = s.invocationPulses.length - 1; i >= 0; i--) {
    const pulse = s.invocationPulses[i];
    pulse.t += delta * pulse.speed;
    if (pulse.t >= 1) {
      s.scene.remove(pulse.mesh);
      s.invocationPulses.splice(i, 1);
    } else {
      const pt = pulse.curve.getPoint(pulse.t);
      pulse.mesh.position.copy(pt);
      const glow = 1 + 0.3 * Math.sin(pulse.t * Math.PI);
      pulse.mesh.scale.setScalar(glow);
    }
  }
}

function updateLambdaLifecyclesStandalone(
  s: SurfaceState,
  delta: number,
): void {
  for (const lc of s.lambdaLifecycles) {
    lc.phaseTimer += delta;
    switch (lc.phase) {
      case "spawning": {
        lc.spawnScale = Math.min(lc.phaseTimer / SPAWN_DURATION, 1);
        const ease = lc.spawnScale * (2 - lc.spawnScale);
        lc.group.scale.setScalar(ease * LAMBDA_SCALE);
        if (lc.spawnScale >= 1) {
          lc.phase = "idle";
          lc.phaseTimer = 0;
          const comp = s.architecture.components.find(
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
          lc.taskIndicator = createTaskIndicator(lc.group.position, s.scene);
        }
        break;
      }
      case "executing": {
        updateTaskIndicatorVisuals(lc, s);
        updateExecutingColor(lc, s);
        if (lc.phaseTimer >= lc.executionDuration) {
          clearTaskVisuals(lc, s);
          resetLambdaColor(lc, s);
          lc.phase = "invoking";
          lc.phaseTimer = 0;
          const target = pickInvocationTarget(lc, s);
          if (target) {
            s.invocationPulses.push(
              spawnInvocationPulse(
                lc.group.position,
                target.group.position,
                s.scene,
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
          const comp = s.architecture.components.find(
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
// Scene construction / destruction
// ---------------------------------------------------------------------------

function buildScene(arch: Architecture): SurfaceState {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(arch.skyColor);

  const camera = new THREE.PerspectiveCamera(
    38,
    innerWidth / innerHeight,
    0.1,
    200,
  );
  camera.position.set(0, 25, 0);
  camera.lookAt(0, 0, 0);

  const canvas = renderer.domElement;
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.13;
  controls.enablePan = arch.cameraConstraints.enablePan;
  controls.panSpeed = 0.6;
  controls.rotateSpeed = 0.4;
  controls.zoomSpeed = 0.6;
  controls.minDistance = arch.cameraConstraints.minDistance;
  controls.maxDistance = arch.cameraConstraints.maxDistance;
  controls.minPolarAngle = arch.cameraConstraints.minPolarAngle;
  controls.maxPolarAngle = arch.cameraConstraints.maxPolarAngle;
  controls.target.set(...arch.cameraTarget);
  controls.addEventListener("change", () => {
    invalidate();
  });
  controls.addEventListener("start", () => {
    invalidate();
  });
  controls.addEventListener("end", () => {
    invalidate();
  });

  const ground = buildGround(arch.groundColor);
  scene.add(ground);

  const components = new Map<string, THREE.Group>();
  for (const comp of arch.components) {
    const mesh = buildComponentMesh(comp);
    scene.add(mesh);
    components.set(comp.id, mesh);
  }

  const pickable: THREE.Object3D[] = [];
  const annotations = new Map<string, THREE.Mesh>();
  const annotationList: string[] = [];
  for (const ann of arch.annotations) {
    const orb = buildAnnotationOrb(ann);
    scene.add(orb);
    annotations.set(ann.id, orb);
    pickable.push(orb);
    annotationList.push(ann.id);
  }

  const particleSystems: ParticleSystem[] = [];
  for (const conn of arch.connections) {
    const result = buildConnectionCurve(conn, components);
    if (!result) continue;
    scene.add(result.line);
    const ps = buildParticleSystem(conn, result.curve);
    scene.add(ps.mesh);
    particleSystems.push(ps);
  }

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

  // Lambda lifecycle — for each lambda component, create a lifecycle tracker
  const hasDag = !!arch.dagBoard;
  const lambdaLifecycles: LambdaLifecycle[] = [];
  for (const comp of arch.components) {
    if (comp.shape !== "lambda") continue;
    const group = components.get(comp.id);
    if (!group) continue;
    if (hasDag) {
      group.scale.setScalar(0);
    }
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
    dagBoard = buildDagBoard(arch.dagBoard, scene);
    dagSimulator = new DagSimulator(arch.dagBoard);
    renderDagCanvas(dagBoard, dagSimulator.snapshot);
  }

  const labels = new Map<string, HTMLElement>();
  const labelsContainer = $("surface-labels");
  for (const comp of arch.components) {
    const el = document.createElement("div");
    el.className = "surface-label";
    el.innerHTML = `<strong>${comp.label}</strong>`;
    labelsContainer.appendChild(el);
    labels.set(comp.id, el);
  }

  return {
    scene,
    camera,
    controls,
    architecture: arch,
    components,
    annotations,
    annotationList,
    particleSystems,
    taskFunnels,
    lambdaLifecycles,
    invocationPulses: [],
    dagBoard,
    dagSimulator,
    pickable,
    elapsed: 0,
    lastFrame: 0,
    activeAnnotation: null,
    labels,
    tween: {
      started: performance.now(),
      from: camera.position.clone(),
      fromTarget: controls.target.clone(),
      to: new THREE.Vector3(...arch.cameraStart),
      toTarget: new THREE.Vector3(...arch.cameraTarget),
    },
  };
}

function disposeState(s: SurfaceState): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  s.scene.traverse((object: THREE.Object3D) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    const mats = mesh.material;
    if (!mats) return;
    for (const material of (Array.isArray(mats)
      ? mats
      : [mats]) as THREE.Material[]) {
      if (!material) continue;
      if (
        material === (outlineMaterial as THREE.Material) ||
        material === (edgeMaterial as THREE.Material)
      )
        continue;
      materials.add(material);
      for (const value of Object.values(material)) {
        if (
          value &&
          typeof value === "object" &&
          (value as THREE.Texture).isTexture
        )
          textures.add(value as THREE.Texture);
      }
      const shader = material as THREE.ShaderMaterial;
      if (shader.uniforms) {
        for (const uniform of Object.values(shader.uniforms) as {
          value: unknown;
        }[]) {
          if (
            uniform.value &&
            typeof uniform.value === "object" &&
            (uniform.value as THREE.Texture).isTexture
          )
            textures.add(uniform.value as THREE.Texture);
        }
      }
    }
  });

  textures.forEach((t) => t.dispose());
  materials.forEach((m) => m.dispose());
  geometries.forEach((g) => g.dispose());

  s.controls.dispose();

  for (const lc of s.lambdaLifecycles) {
    if (lc.taskIndicator) s.scene.remove(lc.taskIndicator);
    if (lc.taskLabelEl) lc.taskLabelEl.remove();
  }
  for (const pulse of s.invocationPulses) {
    s.scene.remove(pulse.mesh);
  }

  for (const el of s.labels.values()) el.remove();
  $("surface-labels").innerHTML = "";
}

// ---------------------------------------------------------------------------
// Enter / exit
// ---------------------------------------------------------------------------

export function enterSurface(id: string): void {
  const arch = architectureById.get(id);
  if (!arch || state) return;

  app.tween = null;
  app.controls.disconnect();

  const overlay = $("surface-transition");

  if (!app.motion) {
    doEnter(arch, id);
    return;
  }

  overlay.classList.add("active");
  let fired = false;
  const proceed = () => {
    if (fired) return;
    fired = true;
    overlay.removeEventListener("transitionend", proceed);
    doEnter(arch, id);
    requestAnimationFrame(() => {
      overlay.classList.remove("active");
    });
  };
  overlay.addEventListener("transitionend", proceed);
  setTimeout(proceed, 400);
}

function doEnter(arch: Architecture, id: string): void {
  document.body.classList.add("surface-mode");
  ($("surface-back") as HTMLElement).hidden = false;
  ($("surface-hud") as HTMLElement).hidden = false;
  $("surface-hud").textContent = arch.name.toUpperCase() + " — ARCHITECTURE";

  state = buildScene(arch);
  app.sceneMode = "surface";
  app.surfaceTarget = id;
  invalidate();
}

export function exitSurface(): void {
  if (!state) return;
  const overlay = $("surface-transition");

  if (!app.motion) {
    doExit();
    return;
  }

  overlay.classList.add("active");
  let fired = false;
  const proceed = () => {
    if (fired) return;
    fired = true;
    overlay.removeEventListener("transitionend", proceed);
    doExit();
    requestAnimationFrame(() => {
      overlay.classList.remove("active");
    });
  };
  overlay.addEventListener("transitionend", proceed);
  setTimeout(proceed, 400);
}

function doExit(): void {
  if (state) {
    disposeState(state);
    state = null;
  }

  document.body.classList.remove("surface-mode");
  ($("surface-back") as HTMLElement).hidden = true;
  ($("surface-hud") as HTMLElement).hidden = true;
  ($("annotation-panel") as HTMLElement).hidden = true;

  app.controls.connect();
  app.sceneMode = "orbit";
  app.surfaceTarget = null;
  app.cameraDirty = true;
  invalidate();
}

export function disposeSurface(): void {
  if (state) {
    disposeState(state);
    state = null;
  }
  app.sceneMode = "orbit";
  app.surfaceTarget = null;
}

// ---------------------------------------------------------------------------
// Per-frame update
// ---------------------------------------------------------------------------

export function updateSurfaceFrame(now: number): void {
  if (!state) return;

  const delta = state.lastFrame
    ? Math.min((now - state.lastFrame) / 1000, 0.1)
    : 0.016;
  state.lastFrame = now;
  state.elapsed += delta;

  // Camera entrance tween
  if (state.tween) {
    const duration = 600;
    const progress = Math.min((now - state.tween.started) / duration, 1);
    const ease = progress * progress * (3 - 2 * progress);
    state.camera.position.lerpVectors(state.tween.from, state.tween.to, ease);
    state.controls.target.lerpVectors(
      state.tween.fromTarget,
      state.tween.toTarget,
      ease,
    );
    if (progress >= 1) state.tween = null;
  }

  state.controls.update();

  // Idle animations
  if (app.motion) {
    for (const comp of state.architecture.components) {
      const group = state.components.get(comp.id);
      if (!group) continue;
      switch (comp.idle) {
        case "bob":
          group.position.y =
            comp.position[1] + 0.15 * Math.sin(state.elapsed * 1.5);
          break;
        case "spin":
          group.rotation.y += delta * 0.3;
          break;
        case "pulse": {
          const mat = (group.children[0] as THREE.Mesh)
            .material as THREE.ShaderMaterial;
          if (mat.uniforms?.uColor) {
            const base = new THREE.Color(comp.color);
            const factor = 1 + 0.1 * Math.sin(state.elapsed * 2.5);
            base.multiplyScalar(factor);
            mat.uniforms.uColor.value.copy(base);
          }
          break;
        }
      }
    }

    // Particle advancement
    for (const ps of state.particleSystems) {
      for (let i = 0; i < ps.count; i++) {
        ps.offsets[i] = (ps.offsets[i] + ps.speed * delta * 0.05) % 1;
        const point = ps.curve.getPoint(ps.offsets[i]);
        _mat4.makeTranslation(point.x, point.y, point.z);
        ps.mesh.setMatrixAt(i, _mat4);
      }
      ps.mesh.instanceMatrix.needsUpdate = true;
    }

    // Annotation orb pulse
    for (const ann of state.architecture.annotations) {
      const orb = state.annotations.get(ann.id);
      if (orb) {
        const s = 1 + 0.08 * Math.sin(state.elapsed * 2.5);
        orb.scale.set(s, s, s);
      }
    }

    // Task funnel — spawn cubes that fall into the factory hopper
    const cubeGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeo, 30);
    for (const funnel of state.taskFunnels) {
      funnel.timer += delta;
      if (funnel.timer >= funnel.interval) {
        funnel.timer -= funnel.interval;
        const cube = new THREE.Mesh(cubeGeo, funnel.material);
        const spawnX = funnel.target.x + (Math.random() - 0.5) * 1.6;
        const spawnZ = funnel.target.z + (Math.random() - 0.5) * 1.6;
        cube.position.set(spawnX, funnel.target.y + 4, spawnZ);
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        const edgeLine = new THREE.LineSegments(cubeEdges, funnel.edgeMat);
        cube.add(edgeLine);
        state.scene.add(cube);
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
          state.scene.remove(tc.mesh);
          funnel.cubes.splice(i, 1);
        }
      }
    }

    // Advance the DAG simulator and sync Lambda visuals to it
    if (state.dagSimulator && state.dagBoard) {
      state.dagSimulator.update(delta);
      const snapshot = state.dagSimulator.snapshot;

      syncLambdasToSimulator(state, snapshot, delta);
      updateInvocationPulses(state, delta);
      renderDagCanvas(state.dagBoard, snapshot);
    } else {
      updateLambdaLifecyclesStandalone(state, delta);
      updateInvocationPulses(state, delta);
    }
  }

  // Update component labels
  updateSurfaceLabels();

  renderer.render(state.scene, state.camera);
}

function updateSurfaceLabels(): void {
  if (!state) return;
  state.camera.updateMatrixWorld();

  // Build a map of compId → executor ID for Lambda labeling
  const lambdaExecutorIds = new Map<string, string>();
  if (state.dagSimulator) {
    const snapshot = state.dagSimulator.snapshot;
    for (const [eid, li] of executorToLambda) {
      const lc = state.lambdaLifecycles[li];
      const executor = snapshot.executors.find((e) => e.id === eid);
      if (lc && executor && executor.phase !== "terminated") {
        lambdaExecutorIds.set(lc.compId, eid);
      }
    }
  }

  for (const comp of state.architecture.components) {
    const group = state.components.get(comp.id);
    const label = state.labels.get(comp.id);
    if (!group || !label) continue;

    // Hide label if mesh is scaled to zero (hidden Lambda)
    if (group.scale.x < 0.01) {
      label.style.visibility = "hidden";
      continue;
    }

    // Update Lambda label to show executor ID
    if (comp.shape === "lambda") {
      const eid = lambdaExecutorIds.get(comp.id);
      label.innerHTML = eid
        ? `<strong>λ ${eid}</strong>`
        : `<strong>${comp.label}</strong>`;
    }

    _v3.copy(group.position);
    _v3.y += comp.scale[1] * 0.6 + 0.5;
    _v3.project(state.camera);

    const x = (_v3.x * 0.5 + 0.5) * innerWidth;
    const y = (-_v3.y * 0.5 + 0.5) * innerHeight;
    const visible =
      _v3.z > -1 &&
      _v3.z < 1 &&
      x > 10 &&
      x < innerWidth - 10 &&
      y > 60 &&
      y < innerHeight - 60;

    label.style.transform = `translate3d(${x}px,${y}px,0) translateX(-50%)`;
    label.style.visibility = visible ? "visible" : "hidden";
  }
}

// ---------------------------------------------------------------------------
// Resize + visibility helpers
// ---------------------------------------------------------------------------

export function resizeSurface(width: number, height: number): void {
  if (!state) return;
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
  invalidate();
}

export function resetSurfaceElapsed(): void {
  if (state) state.lastFrame = 0;
}

// ---------------------------------------------------------------------------
// Annotation interaction
// ---------------------------------------------------------------------------

export function pickAnnotation(x: number, y: number): string | null {
  if (!state) return null;
  _pointer.set((x / innerWidth) * 2 - 1, (-y / innerHeight) * 2 + 1);
  state.camera.updateMatrixWorld();
  _raycaster.setFromCamera(_pointer, state.camera);
  const hit = _raycaster.intersectObjects(state.pickable, true)[0];
  if (!hit) return null;
  let obj: THREE.Object3D | null = hit.object;
  while (obj && !obj.userData.annotationId) obj = obj.parent;
  return (obj?.userData.annotationId as string) ?? null;
}

export function showAnnotation(id: string): void {
  if (!state) return;
  const ann = state.architecture.annotations.find((a) => a.id === id);
  if (!ann) return;
  state.activeAnnotation = id;
  const panel = $("annotation-panel") as HTMLElement;
  panel.hidden = false;
  $("annotation-kicker").textContent = state.architecture.name.toUpperCase();
  $("annotation-title").textContent = ann.title;
  $("annotation-text").textContent = ann.text;
}

export function dismissAnnotation(): void {
  if (!state) return;
  state.activeAnnotation = null;
  ($("annotation-panel") as HTMLElement).hidden = true;
}

export function hasActiveAnnotation(): boolean {
  return state?.activeAnnotation != null;
}

export function cycleSurfaceAnnotation(direction: number): void {
  if (!state) return;
  const list = state.annotationList;
  if (list.length === 0) return;
  const current = state.activeAnnotation
    ? list.indexOf(state.activeAnnotation)
    : -1;
  const next = (current + direction + list.length) % list.length;
  showAnnotation(list[next]);
}
