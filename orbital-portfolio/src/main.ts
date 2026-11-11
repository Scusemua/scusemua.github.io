import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { destinations, destinationById } from "./data/content.js";
import type { Destination } from "./types.js";
import type { WorldUserData } from "./world/rendering.js";
import {
  createWorld,
  rotateWorld,
  resizeInk,
  updateWorldDetail,
  disposeDetailGeometry,
} from "./world/rendering.js";
import { addBackdrop } from "./backdrop/index.js";
import { app, $, mobile } from "./state.js";
import { startWarpFlyIn } from "./warp-flyin.js";
import { buildDOM } from "./ui/dom.js";
import { visit, closeDestination, initDetail } from "./ui/detail.js";
import { bindControls, initControls } from "./ui/controls.js";
import {
  initSurface,
  enterSurface,
  exitSurface,
  disposeSurface,
  updateSurfaceFrame,
  resizeSurface,
  resetSurfaceElapsed,
  pickAnnotation,
  showAnnotation,
  dismissAnnotation,
  hasActiveAnnotation,
  cycleSurfaceAnnotation,
  pickBoard,
  focusBoard,
  unfocusBoard,
  hasFocusedBoard,
} from "./surface/scene.js";

interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface ShakeState {
  age: number;
  duration: number;
  intensity: number;
  basePosition: THREE.Vector3;
}

const shakes = new Map<string, ShakeState>();
const SHAKE_DURATION = 0.25;
const SHAKE_INTENSITY = 0.6;

function onMeteorImpact(targetId: string, meteorSize: number): void {
  const group = app.worlds.get(targetId);
  if (!group) return;
  const existing = shakes.get(targetId);
  const intensity = SHAKE_INTENSITY * meteorSize;
  if (existing) {
    existing.age = 0;
    existing.intensity = Math.min(existing.intensity + intensity * 0.5, 1.5);
  } else {
    const dest = destinationById.get(targetId)!;
    shakes.set(targetId, {
      age: 0,
      duration: SHAKE_DURATION,
      intensity,
      basePosition: new THREE.Vector3(...dest.position),
    });
  }
}

function updateShakes(delta: number): boolean {
  let anyActive = false;
  for (const [id, shake] of shakes) {
    shake.age += delta;
    if (shake.age >= shake.duration) {
      const group = app.worlds.get(id);
      if (group) group.position.copy(shake.basePosition);
      shakes.delete(id);
      continue;
    }
    anyActive = true;
    const progress = shake.age / shake.duration;
    const decay = 1 - progress;
    const freq = 35;
    const amp = shake.intensity * decay * decay;
    const group = app.worlds.get(id);
    if (group) {
      group.position.set(
        shake.basePosition.x + Math.sin(shake.age * freq) * amp,
        shake.basePosition.y + Math.sin(shake.age * freq * 1.3 + 1.0) * amp * 0.7,
        shake.basePosition.z + Math.sin(shake.age * freq * 0.9 + 2.0) * amp * 0.5,
      );
    }
  }
  return anyActive;
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const projection = new THREE.Vector3();

function endFlyIn(): void {
  if (!app.flyingIn) return;
  app.flyingIn = false;
  app.controls.enabled = true;
}

// OrbitControls' damping applies residual momentum after interaction ends.
// We must flush one update() with damping disabled, then re-enable it;
// otherwise the next tween or snap would fight the leftover inertia.
function clearDamping(): void {
  const enabled = app.controls.enableDamping;
  app.controls.enableDamping = false;
  app.controls.update();
  app.controls.enableDamping = enabled;
  app.damping = false;
}

function startTween(position: THREE.Vector3, target: THREE.Vector3): void {
  clearDamping();
  if (!app.motion) {
    app.camera.position.copy(position);
    app.controls.target.copy(target);
    app.controls.update();
    app.tween = null;
  } else
    app.tween = {
      started: performance.now(),
      fromCamera: app.camera.position.clone(),
      fromTarget: app.controls.target.clone(),
      toCamera: position.clone(),
      toTarget: target.clone(),
    };
  app.cameraDirty = true;
  invalidate();
}

// Compute camera placement that frames a destination nicely.
// On mobile the camera looks down from above (portrait-friendly);
// on desktop it sits to the side so the detail panel doesn't overlap the world.
// Satellites/stations ("small") get a tighter framing than planets.
function flyTo(destination: Destination): void {
  const position = new THREE.Vector3(...destination.position),
    small = destination.kind !== "planet";
  const target = position
    .clone()
    .add(
      mobile()
        ? new THREE.Vector3(0, -7, 0)
        : new THREE.Vector3(small ? -3.5 : -5, 0, 0),
    );
  const offset = mobile()
    ? new THREE.Vector3(0, 15, 30)
    : small
      ? new THREE.Vector3(0, 6, 16)
      : new THREE.Vector3(0, 10, 25);
  startTween(target.clone().add(offset), target);
}

function zoom(factor: number): void {
  if (!app.initialized || app.flyingIn) return;
  app.tween = null;
  clearDamping();
  const delta = app.camera.position.clone().sub(app.controls.target);
  app.camera.position
    .copy(app.controls.target)
    .add(
      delta.setLength(THREE.MathUtils.clamp(delta.length() * factor, 8, 120)),
    );
  app.controls.update();
  app.cameraDirty = true;
  invalidate();
}

// Cap the render buffer resolution to balance sharpness against GPU cost.
// On high-DPI screens or large viewports, rendering at full devicePixelRatio
// would push millions of fragments per frame. The square-root formula targets
// roughly 1.8M pixels regardless of viewport size.
function bufferRatio(): number {
  return Math.min(
    devicePixelRatio,
    mobile() ? 1.25 : 1.5,
    Math.sqrt(1800000 / (innerWidth * innerHeight)),
  );
}

// Raycast from screen coordinates to find which destination the user clicked.
// We walk up the scene graph from the hit mesh because sub-meshes (globes,
// rings, ink outlines) don't carry the destination id — only the root group does.
function pick(x: number, y: number): string | undefined {
  pointer.set((x / innerWidth) * 2 - 1, (-y / innerHeight) * 2 + 1);
  app.camera.updateMatrixWorld();
  app.scene.updateMatrixWorld();
  raycaster.setFromCamera(pointer, app.camera);
  const object = raycaster.intersectObjects(app.pickable, true)[0]?.object;
  let parent: THREE.Object3D | null = object ?? null;
  while (parent && !(parent.userData as WorldUserData).destination)
    parent = parent.parent;
  return (parent?.userData as WorldUserData)?.destination;
}

function setOverview(): void {
  if (mobile()) {
    app.camera.fov = 49;
    app.initialTarget = new THREE.Vector3(10, 6, 0);
    app.initialCamera = new THREE.Vector3(10, 35, 65);
  } else {
    app.camera.fov = 40;
    app.initialTarget = new THREE.Vector3(5, 0, 0);
    app.initialCamera = new THREE.Vector3(5, 35, 70);
  }
  app.camera.position.copy(app.initialCamera);
  app.controls.target.copy(app.initialTarget);
  app.camera.updateProjectionMatrix();
  app.controls.update();
  app.cameraDirty = true;
}

// Pause the render loop when the tab is hidden or a modal is open to
// avoid burning CPU/GPU while the user can't see the scene.
function blocked(): boolean {
  return !app.initialized || document.hidden || app.modalOpen;
}

function suspend(): void {
  cancelAnimationFrame(app.raf);
  clearTimeout(app.timer);
  app.raf = 0;
  app.timer = 0;
}

function scheduleFrame(): void {
  if (blocked() || app.raf) return;
  clearTimeout(app.timer);
  app.timer = 0;
  app.raf = requestAnimationFrame(updateFrame);
}

function invalidate(): void {
  app.frameDirty = true;
  if (!app.inFrame) scheduleFrame();
}

// Project each destination's 3D position onto the screen and position its
// HTML label. Labels that would overlap the detail panel, the hero section,
// or another label are hidden to prevent clutter.
function updateLabels(): void {
  if (mobile() && app.selected) return;
  const width = innerWidth,
    height = innerHeight,
    focal = height / (2 * Math.tan((app.camera.fov * Math.PI) / 360));
  app.camera.updateMatrixWorld();
  const occupied: Bounds[] = [];
  const overlay: Element | null = mobile()
    ? !app.selected
      ? document.querySelector(".hero")
      : null
    : app.selected
      ? $("detail")
      : document.querySelector(".hero");
  if (overlay) occupied.push(overlay.getBoundingClientRect());
  // Sort so the selected destination and larger worlds claim label space
  // first, preventing small peripheral labels from occluding them.
  const ordered = [...destinations].sort(
    (a, b) =>
      Number(b.id === app.selected) - Number(a.id === app.selected) ||
      b.radius - a.radius,
  );
  for (const destination of ordered) {
    const position = app.worlds.get(destination.id)!.position;
    projection.copy(position).project(app.camera);
    const x = Math.round((projection.x * 0.5 + 0.5) * width),
      y = Math.round(
        (-projection.y * 0.5 + 0.5) * height +
          (destination.radius / app.camera.position.distanceTo(position)) *
            focal +
          17,
      );
    const halfWidth = mobile() ? 56 : 84;
    const bounds: Bounds = {
      left: x - halfWidth,
      right: x + halfWidth,
      top: y,
      bottom: y + 44,
    };
    const overlaps = occupied.some(
      (rect) =>
        bounds.left < rect.right + 6 &&
        bounds.right > rect.left - 6 &&
        bounds.top < rect.bottom + 6 &&
        bounds.bottom > rect.top - 6,
    );
    const visible =
      projection.z < 1 &&
      projection.z > -1 &&
      x > halfWidth &&
      x < width - halfWidth &&
      y > 90 &&
      y < height - (mobile() ? 154 : 185) &&
      !overlaps;
    if (visible) occupied.push(bounds);
    // Skip DOM writes when the label hasn't moved — avoids layout thrashing
    // during idle ambient rotation frames.
    const value = `${x},${y},${visible}`,
      label = app.labels.get(destination.id)!;
    if (app.labelCache.get(destination.id) === value) continue;
    app.labelCache.set(destination.id, value);
    label.style.transform = `translate3d(${x}px,${y}px,0) translateX(-50%)`;
    label.style.visibility = visible ? "visible" : "hidden";
  }
}

function needsNextFrame(): boolean {
  return app.interacting || app.damping || !!app.tween || app.sceneMode === "surface" || app.backdrop.meteorShowerActive() || shakes.size > 0;
}

function updateFrame(now: number): void {
  app.raf = 0;
  if (blocked()) return;
  app.inFrame = true;

  if (app.sceneMode === "surface") {
    if (app.hoverPoint && !app.interacting) {
      app.renderer.domElement.style.cursor = (pickAnnotation(app.hoverPoint.x, app.hoverPoint.y) || pickBoard(app.hoverPoint.x, app.hoverPoint.y)) ? "pointer" : "grab";
      app.hoverPoint = null;
    }
    updateSurfaceFrame(now);
    app.inFrame = false;
    if (needsNextFrame()) scheduleFrame();
    else if (app.motion)
      app.timer = setTimeout(() => { app.timer = 0; scheduleFrame(); },
        Math.max(0, 33 - (performance.now() - now)));
    return;
  }

  let changed = false;
  if (app.tween) {
    const tweenDuration = app.tween.duration ?? 600;
    const tweenEase = app.tween.ease ?? ((t: number) => t * t * (3 - 2 * t));
    const progress = Math.min((now - app.tween.started) / tweenDuration, 1),
      ease = tweenEase(progress);
    app.camera.position.lerpVectors(
      app.tween.fromCamera,
      app.tween.toCamera,
      ease,
    );
    app.controls.target.lerpVectors(
      app.tween.fromTarget,
      app.tween.toTarget,
      ease,
    );
    app.cameraDirty = true;
    changed = true;
    if (progress === 1) {
      app.tween = null;
      endFlyIn();
    }
  }
  if (app.damping && !app.interacting && now >= app.dampingDeadline)
    clearDamping();
  if (mobile() && app.interacting && app.shrinkProgress < 1) {
    app.shrinkProgress = Math.min(1, app.shrinkProgress + 0.018);
    document.body.style.setProperty("--shrink", String(app.shrinkProgress));
  }
  if (app.interacting || app.damping || app.cameraDirty) {
    const controlsChanged = app.controls.update();
    changed ||= controlsChanged;
    if (!app.interacting && app.damping) app.damping = controlsChanged;
  }
  // Only run ambient animation (planet rotation, transit vehicles, backdrop)
  // when the user is interacting, a tween is active, or ~30ms have elapsed
  // since the last update. This throttles idle animation to ~30fps to save
  // power while keeping interactions smooth at native refresh rate.
  const animate =
    app.motion &&
    (app.interacting ||
      app.damping ||
      app.tween ||
      !app.lastAmbient ||
      now - app.lastAmbient >= 32);
  if (animate) {
    const rotationDelta = app.lastAmbient
      ? Math.min((now - app.lastAmbient) / 1000, 0.1)
      : 0;
    for (const world of app.worlds.values()) rotateWorld(world, rotationDelta);
    app.backdrop.update(rotationDelta);
    app.lastAmbient = now;
    changed = true;
  }
  if (app.backdrop.meteorShowerActive()) {
    const showerDelta = app.lastAmbient ? Math.min((now - app.lastAmbient) / 1000, 0.1) : 0.016;
    if (!animate) {
      app.backdrop.updateMeteorShower(showerDelta);
      changed = true;
    }
  }
  if (shakes.size > 0) {
    const shakeDelta = app.lastAmbient ? Math.min((now - app.lastAmbient) / 1000, 0.1) : 0.016;
    changed = updateShakes(shakeDelta) || changed;
  }
  if (app.cameraDirty) {
    for (const world of app.worlds.values())
      updateWorldDetail(world, app.camera, innerHeight);
    updateLabels();
    app.cameraDirty = false;
  }
  if (app.hoverPoint && !app.interacting) {
    app.renderer.domElement.style.cursor = pick(app.hoverPoint.x, app.hoverPoint.y) ? "pointer" : "grab";
    app.hoverPoint = null;
  }
  if (app.frameDirty || changed) {
    app.renderer.render(app.scene, app.camera);
    app.frameDirty = false;
  }
  app.inFrame = false;
  // During active interaction/animation, keep requesting frames immediately.
  // Otherwise, schedule the next ambient tick via setTimeout to target ~30fps
  // rather than the monitor's native rate, significantly reducing idle GPU load.
  if (needsNextFrame()) scheduleFrame();
  else if (app.motion)
    app.timer = setTimeout(
      () => {
        app.timer = 0;
        scheduleFrame();
      },
      Math.max(0, 33 - (performance.now() - now)),
    );
}

// Walk the entire scene graph to collect every geometry, material, and texture,
// then dispose them. Three.js doesn't garbage-collect GPU resources automatically,
// so skipping this would leak VRAM when navigating away from the 3D page.
function disposeScene(): void {
  if (!app.scene) return;
  const geometries = new Set<THREE.BufferGeometry>(),
    materials = new Set<THREE.Material>(),
    textures = new Set<THREE.Texture>();
  app.scene.traverse((object: THREE.Object3D) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    const mats = mesh.material;
    if (!mats) return;
    for (const material of (Array.isArray(mats)
      ? mats
      : [mats]) as THREE.ShaderMaterial[]) {
      if (!material) continue;
      materials.add(material);
      for (const value of Object.values(material)) {
        if (
          value &&
          typeof value === "object" &&
          (value as THREE.Texture).isTexture
        )
          textures.add(value as THREE.Texture);
      }
      for (const uniform of Object.values(material.uniforms || {}) as {
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
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
  disposeDetailGeometry();
}

// Gracefully degrade to a non-3D accessible layout if WebGL fails to
// initialize or the context is lost at runtime.
function useFallback(): void {
  app.initialized = false;
  suspend();
  disposeScene();
  app.renderer?.dispose();
  app.controls?.dispose();
  document.body.classList.add("no-webgl");
  $("scene-status").textContent = "3D UNAVAILABLE · USE ALL WORK";
  $("announcer").textContent =
    "3D rendering is unavailable. All destinations remain available in the shortcuts and All work.";
  for (const id of ["zoom-in", "zoom-out"])
    ($(id) as HTMLButtonElement).disabled = true;
}

function bindCanvasEvents(canvas: HTMLCanvasElement): void {
  canvas.addEventListener("pointerdown", (event: PointerEvent) => {
    app.activePointers.add(event.pointerId);
    if (app.activePointers.size === 1)
      app.down = {
        x: event.clientX,
        y: event.clientY,
        id: event.pointerId,
        dragged: false,
      };
    else if (app.down) app.down.dragged = true;
    app.hoverPoint = null;
  });
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    if (app.down) {
      if (
        Math.hypot(event.clientX - app.down.x, event.clientY - app.down.y) > 6
      )
        app.down.dragged = true;
      return;
    }
    if (event.pointerType === "touch") return;
    app.hoverPoint = { x: event.clientX, y: event.clientY };
    scheduleFrame();
  });
  // Distinguish clicks from drags: only fire visit() if the pointer hasn't
  // moved more than 6px from its down position. This prevents accidental
  // navigation when the user is orbiting the camera.
  canvas.addEventListener("pointerup", (event: PointerEvent) => {
    app.activePointers.delete(event.pointerId);
    const start = app.down;
    if (app.activePointers.size === 0) app.down = null;
    if (
      app.flyingIn ||
      !start ||
      start.id !== event.pointerId ||
      start.dragged ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6 ||
      event.button !== 0
    )
      return;
    if (app.sceneMode === "surface") {
      const boardId = pickBoard(event.clientX, event.clientY);
      if (boardId) {
        focusBoard(boardId);
        return;
      }
      const annotationId = pickAnnotation(event.clientX, event.clientY);
      if (annotationId) showAnnotation(annotationId);
      else dismissAnnotation();
      return;
    }
    const id = pick(event.clientX, event.clientY);
    if (id) visit(id);
  });
  canvas.addEventListener("pointercancel", (event: PointerEvent) => {
    app.activePointers.delete(event.pointerId);
    app.down = null;
  });
  canvas.addEventListener("pointerleave", () => {
    app.hoverPoint = null;
    canvas.style.cursor = "grab";
  });
  canvas.addEventListener("webglcontextlost", (event: Event) => {
    event.preventDefault();
    useFallback();
  });
}

function initialize(): void {
  app.scene = new THREE.Scene();
  app.camera = new THREE.PerspectiveCamera(
    38,
    innerWidth / innerHeight,
    0.1,
    240,
  );
  // "low-power" tells the browser to prefer the integrated GPU, which is
  // enough for this toon-shaded scene and avoids draining laptop batteries
  // by waking a discrete GPU.
  app.renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  app.renderer.setPixelRatio(bufferRatio());
  app.renderer.setSize(innerWidth, innerHeight);
  app.renderer.outputColorSpace = THREE.SRGBColorSpace;
  $("universe").append(app.renderer.domElement);
  app.controls = new OrbitControls(app.camera, app.renderer.domElement);
  app.controls.enableDamping = true;
  app.controls.dampingFactor = 0.13;
  app.controls.enablePan = true;
  app.controls.panSpeed = 0.8;
  app.controls.rotateSpeed = 0.4;
  app.controls.zoomSpeed = 0.6;
  app.controls.minDistance = 8;
  app.controls.maxDistance = 120;
  app.controls.minPolarAngle = 0.25;
  app.controls.maxPolarAngle = 1.35;
  app.controls.addEventListener("change", () => {
    app.cameraDirty = true;
    app.frameDirty = true;
    if (!app.inFrame) invalidate();
  });
  app.controls.addEventListener("start", () => {
    app.tween = null;
    app.interacting = true;
    invalidate();
  });
  // After the user stops dragging, let OrbitControls damping decay for up to
  // 900ms so the scene feels "loose" rather than snapping to a stop.
  app.controls.addEventListener("end", () => {
    app.interacting = false;
    app.damping = true;
    app.dampingDeadline = performance.now() + 900;
    invalidate();
  });
  setOverview();
  app.backdrop = addBackdrop(app.scene, app.camera, invalidate, onMeteorImpact);
  app.backdrop.setMotion(app.motion);
  for (const destination of destinations) {
    const group = createWorld(destination, invalidate);
    app.scene.add(group);
    app.worlds.set(destination.id, group);
    app.pickable.push(group);
  }
  bindCanvasEvents(app.renderer.domElement);
  app.initialized = true;
  resizeInk(innerWidth, innerHeight);
  initSurface({ renderer: app.renderer, invalidate, scheduleFrame });

  app.flyingIn = true;
  app.controls.enabled = false;
  startWarpFlyIn({
    camera: app.camera,
    controls: app.controls,
    initialCamera: app.initialCamera,
    initialTarget: app.initialTarget,
    isMobile: mobile(),
    setTween(tween) {
      app.tween = tween;
      app.cameraDirty = true;
    },
  });

  invalidate();
}

// detail.ts and controls.ts can't import main.ts (circular dependency), so
// we inject the functions they need via init calls at module load time.
initDetail(flyTo, startTween, invalidate, enterSurface);
initControls({
  invalidate, suspend, zoom,
  exitSurface, hasActiveAnnotation, dismissAnnotation, cycleSurfaceAnnotation,
  unfocusBoard, hasFocusedBoard,
});
buildDOM(visit);
bindControls();

let previousMobile = mobile();
window.addEventListener("resize", () => {
  if (!app.initialized) return;
  app.renderer.setPixelRatio(bufferRatio());
  app.renderer.setSize(innerWidth, innerHeight);
  resizeInk(innerWidth, innerHeight);
  app.backdrop.resize(innerWidth, innerHeight);

  if (app.sceneMode === "surface") {
    resizeSurface(innerWidth, innerHeight);
    return;
  }

  app.camera.aspect = innerWidth / innerHeight;
  // Crossing the mobile/desktop breakpoint changes camera FOV, position,
  // and which UI layout is active, so reset the view entirely.
  if (previousMobile !== mobile()) {
    previousMobile = mobile();
    app.tween = null;
    endFlyIn();
    clearDamping();
    setOverview();
    if (app.selected)
      flyTo(destinationById.get(app.selected!)!);
  }
  app.camera.updateProjectionMatrix();
  app.cameraDirty = true;
  invalidate();
});

// Stop the render loop when the tab is backgrounded to save battery.
// On return, reset lastAmbient so the first frame doesn't apply a huge
// delta that would teleport planets and vehicles forward in time.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) suspend();
  else {
    app.lastAmbient = 0;
    resetSurfaceElapsed();
    app.cameraDirty = true;
    invalidate();
  }
});

// If the user navigates back to the main portfolio via an in-page link,
// tear down the WebGL context to free GPU memory before the page transition.
for (const link of document.querySelectorAll('a[href="/"]')) {
  link.addEventListener("click", () => {
    if (app.sceneMode === "surface") disposeSurface();
    suspend();
    disposeScene();
    app.renderer?.dispose();
    app.renderer?.domElement.remove();
  });
}

try {
  initialize();
} catch (error) {
  console.warn(
    "Orbital switched to the accessible non-3D view:",
    (error as Error).message,
  );
  useFallback();
}
