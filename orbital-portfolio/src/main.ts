import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { destinations } from "./data/content.js";
import type { Destination } from "./types.js";
import type { WorldUserData } from "./world/rendering.js";
import {
  createWorld,
  rotateWorld,
  addBackdrop,
  resizeInk,
  updateWorldDetail,
  disposeDetailGeometry,
} from "./world/rendering.js";
import { app, $, mobile } from "./state.js";
import { buildDOM } from "./ui/dom.js";
import { visit, closeDestination, initDetail } from "./ui/detail.js";
import { bindControls, initControls } from "./ui/controls.js";

interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const projection = new THREE.Vector3();

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
  if (!app.initialized) return;
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

function bufferRatio(): number {
  return Math.min(
    devicePixelRatio,
    mobile() ? 1.25 : 1.5,
    Math.sqrt(1800000 / (innerWidth * innerHeight)),
  );
}

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
    const value = `${x},${y},${visible}`,
      label = app.labels.get(destination.id)!;
    if (app.labelCache.get(destination.id) === value) continue;
    app.labelCache.set(destination.id, value);
    label.style.transform = `translate3d(${x}px,${y}px,0) translateX(-50%)`;
    label.style.visibility = visible ? "visible" : "hidden";
  }
}

function updateFrame(now: number): void {
  app.raf = 0;
  if (blocked()) return;
  app.inFrame = true;
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
    if (progress === 1) app.tween = null;
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
  if (app.cameraDirty) {
    for (const world of app.worlds.values())
      updateWorldDetail(world, app.camera, innerHeight);
    updateLabels();
    app.cameraDirty = false;
  }
  if (app.hoverPoint && !app.interacting) {
    app.renderer.domElement.style.cursor = pick(
      app.hoverPoint.x,
      app.hoverPoint.y,
    )
      ? "pointer"
      : "grab";
    app.hoverPoint = null;
  }
  if (app.frameDirty || changed) {
    app.renderer.render(app.scene, app.camera);
    app.frameDirty = false;
  }
  app.inFrame = false;
  if (app.interacting || app.damping || app.tween) scheduleFrame();
  else if (app.motion)
    app.timer = setTimeout(
      () => {
        app.timer = 0;
        scheduleFrame();
      },
      Math.max(0, 33 - (performance.now() - now)),
    );
}

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

function initialize(): void {
  app.scene = new THREE.Scene();
  app.camera = new THREE.PerspectiveCamera(
    38,
    innerWidth / innerHeight,
    0.1,
    240,
  );
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
  app.controls.addEventListener("end", () => {
    app.interacting = false;
    app.damping = true;
    app.dampingDeadline = performance.now() + 900;
    invalidate();
  });
  setOverview();
  app.backdrop = addBackdrop(app.scene, app.camera);
  app.backdrop.setMotion(app.motion);
  for (const destination of destinations) {
    const group = createWorld(destination, invalidate);
    app.scene.add(group);
    app.worlds.set(destination.id, group);
    app.pickable.push(group);
  }
  const canvas = app.renderer.domElement;
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
  canvas.addEventListener("pointerup", (event: PointerEvent) => {
    app.activePointers.delete(event.pointerId);
    const start = app.down;
    if (app.activePointers.size === 0) app.down = null;
    if (
      !start ||
      start.id !== event.pointerId ||
      start.dragged ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6 ||
      event.button !== 0
    )
      return;
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
  app.initialized = true;
  resizeInk(innerWidth, innerHeight);

  // Light-speed fly-in: start camera far behind the scene and tween to overview
  const flyInFrom = app.initialCamera.clone().add(new THREE.Vector3(0, 55, 250));
  app.camera.position.copy(flyInFrom);
  app.controls.update();
  app.cameraDirty = true;
  app.tween = {
    started: performance.now(),
    fromCamera: flyInFrom,
    fromTarget: app.controls.target.clone().add(new THREE.Vector3(0, 30, 110)),
    toCamera: app.initialCamera.clone(),
    toTarget: app.initialTarget.clone(),
    duration: 1600,
    ease: (t: number) => 1 - Math.pow(1 - t, 3),
  };

  // Warp-drive star streak canvas
  const warpCanvas = document.createElement("canvas");
  warpCanvas.style.cssText = "position:fixed;inset:0;z-index:1000;pointer-events:none;";
  warpCanvas.width = innerWidth;
  warpCanvas.height = innerHeight;
  document.body.appendChild(warpCanvas);
  const wctx = warpCanvas.getContext("2d")!;
  const cx = warpCanvas.width / 2, cy = warpCanvas.height / 2;
  const warpStars: { x: number; y: number; r: number; speed: number; persist: boolean }[] = [];
  for (let i = 0; i < 100; i++) {
    warpStars.push({
      x: Math.random() * warpCanvas.width,
      y: Math.random() * warpCanvas.height,
      r: 0.5 + Math.random() * 1.5,
      speed: 0.5 + Math.random() * 0.5,
      persist: true, // Math.random() < 0.4,
    });
  }
  const warpStart = performance.now();
  const warpDuration = 1400;
  const lingerDuration = 1200;
  let lingerStart = 0;
  function animateWarp(): void {
    const elapsed = performance.now() - warpStart;
    const t = Math.min(elapsed / warpDuration, 1);
    const warpSpeed = Math.max(0, 1 - t * t);
    const warpDone = t >= 1;
    if (warpDone && lingerStart === 0) lingerStart = performance.now();
    const lingerT = lingerStart > 0 ? Math.min((performance.now() - lingerStart) / lingerDuration, 1) : 0;
    const fadeOpacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
    wctx.clearRect(0, 0, warpCanvas.width, warpCanvas.height);
    const ambientAlpha = 0.15;
    let anyVisible = false;
    for (const star of warpStars) {
      let alpha: number;
      if (star.persist) {
        const target = warpDone ? ambientAlpha : 1;
        alpha = warpDone ? ambientAlpha * (1 - lingerT) : Math.max(ambientAlpha, fadeOpacity);
        if (warpDone) alpha = ambientAlpha * (1 - lingerT);
        else alpha = Math.max(ambientAlpha, fadeOpacity);
      } else {
        alpha = fadeOpacity;
        if (warpDone) alpha = 0;
      }
      if (alpha <= 0.001) continue;
      anyVisible = true;
      const angle = Math.atan2(star.y - cy, star.x - cx);
      if (!warpDone) {
        const move = warpSpeed * 18 * star.speed;
        star.x += move * Math.cos(angle);
        star.y += move * Math.sin(angle);
        if (star.x > warpCanvas.width || star.x < 0 || star.y > warpCanvas.height || star.y < 0) {
          star.x = cx + (Math.random() - 0.5) * 100;
          star.y = cy + (Math.random() - 0.5) * 100;
        }
      }
      const dist = Math.sqrt((star.x - cx) ** 2 + (star.y - cy) ** 2);
      const lineLen = warpSpeed * 40 * star.speed * (dist / (warpCanvas.width * 0.5));
      const brightness = Math.min(1, 0.4 + dist / (warpCanvas.width * 0.4));
      const col = `rgba(${180 + Math.round(75 * brightness)},${200 + Math.round(55 * brightness)},255,${brightness * alpha})`;
      if (lineLen > star.r * 1.5) {
        const tailX = star.x - lineLen * Math.cos(angle);
        const tailY = star.y - lineLen * Math.sin(angle);
        wctx.beginPath();
        wctx.moveTo(tailX, tailY);
        wctx.lineTo(star.x, star.y);
        wctx.strokeStyle = col;
        wctx.lineWidth = star.r * (1 + warpSpeed);
        wctx.stroke();
      } else {
        wctx.beginPath();
        wctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        wctx.fillStyle = col;
        wctx.fill();
      }
    }
    if (!anyVisible) { warpCanvas.remove(); return; }
    requestAnimationFrame(animateWarp);
  }
  requestAnimationFrame(animateWarp);

  invalidate();
}

// Wire up module dependencies
initDetail(flyTo, startTween, invalidate);
initControls({ invalidate, suspend, zoom });
buildDOM(visit);
bindControls();

let previousMobile = mobile();
window.addEventListener("resize", () => {
  if (!app.initialized) return;
  app.renderer.setPixelRatio(bufferRatio());
  app.renderer.setSize(innerWidth, innerHeight);
  resizeInk(innerWidth, innerHeight);
  app.backdrop.resize(innerWidth, innerHeight);
  app.camera.aspect = innerWidth / innerHeight;
  if (previousMobile !== mobile()) {
    previousMobile = mobile();
    app.tween = null;
    clearDamping();
    setOverview();
    if (app.selected)
      flyTo(
        destinations.find(
          (destination) => destination.id === app.selected,
        )!,
      );
  }
  app.camera.updateProjectionMatrix();
  app.cameraDirty = true;
  invalidate();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) suspend();
  else {
    app.lastAmbient = 0;
    app.cameraDirty = true;
    invalidate();
  }
});

for (const link of document.querySelectorAll('a[href="/"]')) {
  link.addEventListener("click", () => {
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
