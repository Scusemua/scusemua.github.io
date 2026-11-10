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
import type { SurfaceHooks, SurfaceContext } from "./hooks.js";
import { createWukongHooks } from "./wukong/index.js";

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

  window.addEventListener("keydown", (e) => {
    if (e.key === "p" && state && app.sceneMode === "surface") {
      const p = state.camera.position;
      const t = state.controls.target;
      const fmt = (v: THREE.Vector3) =>
        `[${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)}]`;
      console.log(`cameraStart: ${fmt(p)},\ncameraTarget: ${fmt(t)},`);
    }
  });
}

// ---------------------------------------------------------------------------
// Hook registry — maps architecture IDs to hook factories
// ---------------------------------------------------------------------------

const hookFactories = new Map<string, () => SurfaceHooks>([
  ["atlas", createWukongHooks],
]);

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

interface SurfaceState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  architecture: Architecture;
  components: Map<string, THREE.Group>;
  annotations: Map<string, THREE.Mesh>;
  annotationList: string[];
  particleSystems: ParticleSystem[];
  pickable: THREE.Object3D[];
  elapsed: number;
  lastFrame: number;
  activeAnnotation: string | null;
  labels: Map<string, HTMLElement>;
  hooks: SurfaceHooks | null;
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

  addToonPart(new THREE.BoxGeometry(4, 2.4, 3), c, group, [0, 1.2, 0]);

  const hopperGeo = new THREE.CylinderGeometry(0.6, 1.4, 1.2, 8);
  addToonPart(hopperGeo, "#d09030", group, [0, 3.0, 0]);

  addToonPart(
    new THREE.CylinderGeometry(0.3, 0.3, 2.0, 8),
    "#c07828",
    group,
    [1.5, 3.4, -0.8],
  );

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

  const labels = new Map<string, HTMLElement>();
  const labelsContainer = $("surface-labels");
  for (const comp of arch.components) {
    const el = document.createElement("div");
    el.className = "surface-label";
    el.innerHTML = `<strong>${comp.label}</strong>`;
    labelsContainer.appendChild(el);
    labels.set(comp.id, el);
  }

  // Architecture-specific hooks
  const factory = hookFactories.get(arch.id);
  const hooks = factory ? factory() : null;

  const s: SurfaceState = {
    scene,
    camera,
    controls,
    architecture: arch,
    components,
    annotations,
    annotationList,
    particleSystems,
    pickable,
    elapsed: 0,
    lastFrame: 0,
    activeAnnotation: null,
    labels,
    hooks,
    tween: {
      started: performance.now(),
      from: camera.position.clone(),
      fromTarget: controls.target.clone(),
      to: new THREE.Vector3(...arch.cameraStart),
      toTarget: new THREE.Vector3(...arch.cameraTarget),
    },
  };

  if (hooks) {
    hooks.onBuild(surfaceContext(s));
  }

  return s;
}

function surfaceContext(s: SurfaceState): SurfaceContext {
  return {
    scene: s.scene,
    camera: s.camera,
    architecture: s.architecture,
    components: s.components,
    labels: s.labels,
    elapsed: s.elapsed,
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

  if (s.hooks) {
    s.hooks.onDispose(surfaceContext(s));
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

    // Architecture-specific update
    if (state.hooks) {
      state.hooks.onUpdate(surfaceContext(state), delta);
    }
  }

  // Update component labels
  updateSurfaceLabels();

  renderer.render(state.scene, state.camera);
}

function updateSurfaceLabels(): void {
  if (!state) return;
  state.camera.updateMatrixWorld();

  // Let architecture-specific hooks augment labels
  if (state.hooks) {
    state.hooks.onUpdateLabels(surfaceContext(state));
  }

  for (const comp of state.architecture.components) {
    const group = state.components.get(comp.id);
    const label = state.labels.get(comp.id);
    if (!group || !label) continue;

    if (group.scale.x < 0.01) {
      label.style.visibility = "hidden";
      continue;
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
