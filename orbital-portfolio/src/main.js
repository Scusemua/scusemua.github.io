import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { destinations } from "./content.js";
import {
  createWorld,
  rotateWorld,
  addBackdrop,
  resizeInk,
  updateWorldDetail,
  disposeDetailGeometry,
} from "./rendering.js";

const $ = (id) => document.getElementById(id);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = () => innerWidth <= 760;
let motion = !reducedMotion.matches;
let selected = null,
  returnFocus = null;
let scene, camera, renderer, controls, tween, backdrop;
let initialCamera, initialTarget;
let initialized = false,
  cameraDirty = true,
  frameDirty = true;
let raf = 0,
  timer = 0,
  inFrame = false,
  lastAmbient = 0;
let interacting = false,
  modalOpen = false,
  damping = false,
  dampingDeadline = 0;
let shrinkProgress = 0;
let hoverPoint = null,
  down = null;
const activePointers = new Set();
const worlds = new Map(),
  labels = new Map(),
  cards = new Map();
const pickable = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(),
  projection = new THREE.Vector3();
const labelCache = new Map();

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
$("coord").textContent =
  `${String(destinations.length).padStart(2, "0")} DESTINATIONS · ${destinations.reduce((sum, world) => sum + (world.moons?.length || 0), 0)} MOONS`;
$("flight-count").textContent = `${destinations.length} destinations`;
for (const destination of destinations) {
  const label = element("button", "destination-label");
  label.append(
    element("strong", "", destination.name.toUpperCase()),
    element("small", "", destination.category.toUpperCase()),
  );
  label.setAttribute(
    "aria-label",
    `Visit ${destination.name}: ${destination.category}`,
  );
  label.addEventListener("click", () => visit(destination.id));
  $("labels").append(label);
  labels.set(destination.id, label);
  const card = element("button", "dest-card");
  card.dataset.destination = destination.id;
  card.setAttribute(
    "aria-label",
    `Visit ${destination.name}: ${destination.category}`,
  );
  card.append(element("span", `orb ${destination.id}`));
  const text = element("span");
  text.append(
    element("strong", "", destination.name),
    element("small", "", destination.category),
  );
  card.append(text, element("span", "num mono", destination.number));
  card.addEventListener("click", () => visit(destination.id));
  $("cards").append(card);
  cards.set(destination.id, card);
  const row = element("button", "index-row");
  row.append(element("span", "row-num mono", destination.number));
  const rowText = element("span");
  rowText.append(
    element("strong", "", destination.name),
    element("small", "", destination.category),
  );
  row.append(rowText, element("span", "arrow", "↗"));
  row.addEventListener("click", () => {
    $("index-dialog").close();
    visit(destination.id);
  });
  $("index-list").append(row);
}
function visit(id) {
  const destination = destinations.find((item) => item.id === id);
  if (!destination) return;
  if (!selected) returnFocus = document.activeElement;
  selected = id;
  document.body.classList.add("detail-open");
  if (mobile() && initialized) {
    $("detail").hidden = true;
    clearTimeout(visit._mobileDelay);
    visit._mobileDelay = setTimeout(() => {
      $("detail").hidden = false;
      $("detail").classList.add("slide-in");
      $("close-detail").focus({ preventScroll: true });
    }, 550);
  } else {
    $("detail").hidden = false;
  }
  $("detail-title").textContent = destination.name;
  $("detail-kicker").textContent =
    `${destination.kind} ${destination.number} / ${destination.category}`;
  $("detail-subtitle").textContent = destination.subtitle;
  const visualTags =
    destination.kind === "planet"
      ? [
          `${destination.moons?.length || 0} moon${destination.moons?.length === 1 ? "" : "s"}`,
          destination.rings ? "Ringed world" : "Unringed world",
        ]
      : [];
  $("detail-tags").replaceChildren(
    ...destination.tags.map((tag) => element("span", "tag", tag)),
    ...visualTags.map((tag) => element("span", "tag tag-visual", tag)),
  );
  const sections = destination.sections.map((section) => {
    const wrapper = element("div", "panel-section");
    wrapper.append(
      element("h3", "", section.title),
      element("p", "", section.text),
    );
    return wrapper;
  });
  const fields = element("div", "field-row");
  for (const [title, value] of [
    ["ROLE / TEAM", destination.role],
    ["TIMELINE / FOCUS", destination.timeline],
  ]) {
    const field = element("div");
    field.append(element("small", "", title), element("span", "", value));
    fields.append(field);
  }
  $("detail-content").replaceChildren(...sections, fields);
  $("detail-resources").replaceChildren();
  for (const link of destination.links) {
    try {
      const url = new URL(link.url);
      if (url.protocol !== "https:" || url.username || url.password) continue;
      const anchor = element("a", "resource", `${link.label} ↗`);
      anchor.href = url.href;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      $("detail-resources").append(anchor);
    } catch {
      /* Invalid links are not rendered. */
    }
  }
  $("tour-position").textContent =
    `${destination.number} / ${String(destinations.length).padStart(2, "0")}`;
  for (const item of destinations) {
    cards.get(item.id).classList.toggle("selected", item.id === id);
    cards.get(item.id).setAttribute("aria-pressed", String(item.id === id));
    labels.get(item.id).classList.toggle("selected", item.id === id);
  }
  cards.get(id).scrollIntoView({ block: "nearest", inline: "nearest" });
  $("scene-status").textContent =
    `NOW EXPLORING / ${destination.name.toUpperCase()}`;
  $("announcer").textContent =
    `Exploring ${destination.name}, ${destination.category}. /.`;
  if (initialized) flyTo(destination);
  $("detail-scroll").scrollTop = 0;
  $("close-detail").focus({ preventScroll: true });
}
function closeDestination(restore = true) {
  selected = null;
  clearTimeout(visit._mobileDelay);
  document.body.classList.remove("detail-open");
  $("detail").hidden = true;
  $("detail").classList.remove("slide-in");
  for (const [id, card] of cards) {
    card.classList.remove("selected");
    card.setAttribute("aria-pressed", "false");
    labels.get(id).classList.remove("selected");
  }
  $("scene-status").textContent = initialized
    ? "EVERY WORLD HAS A STORY"
    : "3D UNAVAILABLE · USE ALL WORK";
  $("announcer").textContent = "Returned to the solar system overview.";
  if (initialized) startTween(initialCamera, initialTarget);
  if (restore && returnFocus?.isConnected)
    returnFocus.focus({ preventScroll: true });
  returnFocus = null;
}
function tour(direction) {
  const index = destinations.findIndex(
    (destination) => destination.id === selected,
  );
  visit(
    destinations[
      (index + direction + destinations.length) % destinations.length
    ].id,
  );
}
function updateMotion() {
  $("motion").setAttribute("aria-pressed", String(motion));
  $("motion").title = motion ? "Pause ambient motion" : "Resume ambient motion";
  $("motion-icon").textContent = motion ? "Ⅱ" : "▷";
  $("motion-label").textContent = motion ? "Motion on" : "Motion off";
}
function setMotion(value) {
  motion = value;
  updateMotion();
  backdrop?.setMotion(value);
  if (!motion && tween) {
    camera.position.copy(tween.toCamera);
    controls.target.copy(tween.toTarget);
    tween = null;
    cameraDirty = true;
  }
  lastAmbient = 0;
  invalidate();
}
$("begin").addEventListener("click", () => visit(destinations[0].id));
$("about").addEventListener("click", () => visit("station"));
$("close-detail").addEventListener("click", () => closeDestination());
$("home").addEventListener("click", () => closeDestination(false));
$("explore").addEventListener("click", () => closeDestination(false));
$("reset").addEventListener("click", () => closeDestination(false));
$("prev").addEventListener("click", () => tour(-1));
$("next").addEventListener("click", () => tour(1));
$("index").addEventListener("click", () => openDialog($("index-dialog")));
$("help").addEventListener("click", () => openDialog($("help-dialog")));
$("motion").addEventListener("click", () => setMotion(!motion));
reducedMotion.addEventListener("change", (event) => setMotion(!event.matches));
function openDialog(dialog) {
  dialog.showModal();
  modalOpen = true;
  suspend();
}
for (const dialog of document.querySelectorAll("dialog")) {
  dialog
    .querySelector("[data-close-dialog]")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    modalOpen = !!document.querySelector("dialog[open]");
    lastAmbient = 0;
    invalidate();
  });
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
}
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    selected &&
    !document.querySelector("dialog[open]")
  )
    closeDestination();
});
updateMotion();
let barIdleTimer = 0;
function resetBarIdle() {
  const bottom = document.querySelector(".bottom");
  if (bottom) bottom.classList.remove("idle");
  clearTimeout(barIdleTimer);
  if (mobile())
    barIdleTimer = setTimeout(() => {
      const b = document.querySelector(".bottom");
      if (b) b.classList.add("idle");
    }, 2500);
}
document
  .querySelector(".bottom")
  ?.addEventListener("pointerdown", resetBarIdle);
document
  .querySelector(".bottom")
  ?.addEventListener("pointerenter", resetBarIdle);
document.addEventListener("pointerdown", resetBarIdle);
document.addEventListener("scroll", resetBarIdle, { passive: true });
resetBarIdle();

function setOverview() {
  if (mobile()) {
    camera.fov = 49;
    initialTarget = new THREE.Vector3(7, 6, 0);
    initialCamera = new THREE.Vector3(7, 25, 43);
  } else {
    camera.fov = 40;
    initialTarget = new THREE.Vector3(2.5, 0, 0);
    initialCamera = new THREE.Vector3(2.5, 24.5, 46.5);
  }
  camera.position.copy(initialCamera);
  controls.target.copy(initialTarget);
  camera.updateProjectionMatrix();
  controls.update();
  cameraDirty = true;
}
function clearDamping() {
  const enabled = controls.enableDamping;
  controls.enableDamping = false;
  controls.update();
  controls.enableDamping = enabled;
  damping = false;
}
function startTween(position, target) {
  clearDamping();
  if (!motion) {
    camera.position.copy(position);
    controls.target.copy(target);
    controls.update();
    tween = null;
  } else
    tween = {
      started: performance.now(),
      fromCamera: camera.position.clone(),
      fromTarget: controls.target.clone(),
      toCamera: position.clone(),
      toTarget: target.clone(),
    };
  cameraDirty = true;
  invalidate();
}
function flyTo(destination) {
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
function zoom(factor) {
  if (!initialized) return;
  tween = null;
  clearDamping();
  const delta = camera.position.clone().sub(controls.target);
  camera.position
    .copy(controls.target)
    .add(
      delta.setLength(THREE.MathUtils.clamp(delta.length() * factor, 8, 85)),
    );
  controls.update();
  cameraDirty = true;
  invalidate();
}
$("zoom-in").addEventListener("click", () => zoom(0.85));
$("zoom-out").addEventListener("click", () => zoom(1.18));
function bufferRatio() {
  return Math.min(
    devicePixelRatio,
    mobile() ? 1.25 : 1.5,
    Math.sqrt(1800000 / (innerWidth * innerHeight)),
  );
}
function pick(x, y) {
  pointer.set((x / innerWidth) * 2 - 1, (-y / innerHeight) * 2 + 1);
  camera.updateMatrixWorld();
  scene.updateMatrixWorld();
  raycaster.setFromCamera(pointer, camera);
  const object = raycaster.intersectObjects(pickable, true)[0]?.object;
  let parent = object;
  while (parent && !parent.userData.destination) parent = parent.parent;
  return parent?.userData.destination;
}
function initialize() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 240);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(bufferRatio());
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  $("universe").append(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.13;
  controls.enablePan = true;
  controls.panSpeed = 0.8;
  controls.rotateSpeed = 0.4;
  controls.zoomSpeed = 0.6;
  controls.minDistance = 8;
  controls.maxDistance = 85;
  controls.minPolarAngle = 0.25;
  controls.maxPolarAngle = 1.35;
  controls.addEventListener("change", () => {
    cameraDirty = true;
    frameDirty = true;
    if (!inFrame) invalidate();
  });
  controls.addEventListener("start", () => {
    tween = null;
    interacting = true;
    invalidate();
  });
  controls.addEventListener("end", () => {
    interacting = false;
    damping = true;
    dampingDeadline = performance.now() + 900;
    invalidate();
  });
  setOverview();
  backdrop = addBackdrop(scene, camera);
  backdrop.setMotion(motion);
  for (const destination of destinations) {
    const group = createWorld(destination, invalidate);
    scene.add(group);
    worlds.set(destination.id, group);
    pickable.push(group);
  }
  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", (event) => {
    activePointers.add(event.pointerId);
    if (activePointers.size === 1)
      down = {
        x: event.clientX,
        y: event.clientY,
        id: event.pointerId,
        dragged: false,
      };
    else if (down) down.dragged = true;
    hoverPoint = null;
  });
  canvas.addEventListener("pointermove", (event) => {
    if (down) {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6)
        down.dragged = true;
      return;
    }
    if (event.pointerType === "touch") return;
    hoverPoint = { x: event.clientX, y: event.clientY };
    scheduleFrame();
  });
  canvas.addEventListener("pointerup", (event) => {
    activePointers.delete(event.pointerId);
    const start = down;
    if (activePointers.size === 0) down = null;
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
  canvas.addEventListener("pointercancel", (event) => {
    activePointers.delete(event.pointerId);
    down = null;
  });
  canvas.addEventListener("pointerleave", () => {
    hoverPoint = null;
    canvas.style.cursor = "grab";
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    useFallback();
  });
  initialized = true;
  resizeInk(innerWidth, innerHeight);
  invalidate();
}
function updateLabels() {
  if (mobile() && selected) return;
  const width = innerWidth,
    height = innerHeight,
    focal = height / (2 * Math.tan((camera.fov * Math.PI) / 360));
  camera.updateMatrixWorld();
  const occupied = [];
  const overlay = mobile()
    ? !selected
      ? document.querySelector(".hero")
      : null
    : selected
      ? $("detail")
      : document.querySelector(".hero");
  if (overlay) occupied.push(overlay.getBoundingClientRect());
  const ordered = [...destinations].sort(
    (a, b) =>
      Number(b.id === selected) - Number(a.id === selected) ||
      b.radius - a.radius,
  );
  for (const destination of ordered) {
    const position = worlds.get(destination.id).position;
    projection.copy(position).project(camera);
    const x = Math.round((projection.x * 0.5 + 0.5) * width),
      y = Math.round(
        (-projection.y * 0.5 + 0.5) * height +
          (destination.radius / camera.position.distanceTo(position)) * focal +
          17,
      );
    const halfWidth = mobile() ? 56 : 84;
    const bounds = {
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
      label = labels.get(destination.id);
    if (labelCache.get(destination.id) === value) continue;
    labelCache.set(destination.id, value);
    label.style.transform = `translate3d(${x}px,${y}px,0) translateX(-50%)`;
    label.style.visibility = visible ? "visible" : "hidden";
  }
}
function blocked() {
  return !initialized || document.hidden || modalOpen;
}
function suspend() {
  cancelAnimationFrame(raf);
  clearTimeout(timer);
  raf = 0;
  timer = 0;
}
function scheduleFrame() {
  if (blocked() || raf) return;
  clearTimeout(timer);
  timer = 0;
  raf = requestAnimationFrame(updateFrame);
}
function invalidate() {
  frameDirty = true;
  if (!inFrame) scheduleFrame();
}
function updateFrame(now) {
  raf = 0;
  if (blocked()) return;
  inFrame = true;
  let changed = false;
  if (tween) {
    const progress = Math.min((now - tween.started) / 600, 1),
      ease = progress * progress * (3 - 2 * progress);
    camera.position.lerpVectors(tween.fromCamera, tween.toCamera, ease);
    controls.target.lerpVectors(tween.fromTarget, tween.toTarget, ease);
    cameraDirty = true;
    changed = true;
    if (progress === 1) tween = null;
  }
  if (damping && !interacting && now >= dampingDeadline) clearDamping();
  if (mobile() && interacting && shrinkProgress < 1) {
    shrinkProgress = Math.min(1, shrinkProgress + 0.018);
    document.body.style.setProperty("--shrink", String(shrinkProgress));
  }
  if (interacting || damping || cameraDirty) {
    const controlsChanged = controls.update();
    changed ||= controlsChanged;
    if (!interacting && damping) damping = controlsChanged;
  }
  const animate =
    motion &&
    (interacting ||
      damping ||
      tween ||
      !lastAmbient ||
      now - lastAmbient >= 32);
  if (animate) {
    const rotationDelta = lastAmbient
      ? Math.min((now - lastAmbient) / 1000, 0.1)
      : 0;
    for (const world of worlds.values()) rotateWorld(world, rotationDelta);
    backdrop.update(rotationDelta);
    lastAmbient = now;
    changed = true;
  }
  if (cameraDirty) {
    for (const world of worlds.values())
      updateWorldDetail(world, camera, innerHeight);
    updateLabels();
    cameraDirty = false;
  }
  if (hoverPoint && !interacting) {
    renderer.domElement.style.cursor = pick(hoverPoint.x, hoverPoint.y)
      ? "pointer"
      : "grab";
    hoverPoint = null;
  }
  if (frameDirty || changed) {
    renderer.render(scene, camera);
    frameDirty = false;
  }
  inFrame = false;
  if (interacting || damping || tween) scheduleFrame();
  else if (motion)
    timer = setTimeout(
      () => {
        timer = 0;
        scheduleFrame();
      },
      Math.max(0, 33 - (performance.now() - now)),
    );
}
let previousMobile = mobile();
window.addEventListener("resize", () => {
  if (!initialized) return;
  renderer.setPixelRatio(bufferRatio());
  renderer.setSize(innerWidth, innerHeight);
  resizeInk(innerWidth, innerHeight);
  backdrop.resize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  if (previousMobile !== mobile()) {
    previousMobile = mobile();
    tween = null;
    clearDamping();
    setOverview();
    if (selected)
      flyTo(destinations.find((destination) => destination.id === selected));
  }
  camera.updateProjectionMatrix();
  cameraDirty = true;
  invalidate();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) suspend();
  else {
    lastAmbient = 0;
    cameraDirty = true;
    invalidate();
  }
});
function disposeScene() {
  if (!scene) return;
  const geometries = new Set(),
    materials = new Set(),
    textures = new Set();
  scene.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of Array.isArray(object.material)
      ? object.material
      : [object.material]) {
      if (!material) continue;
      materials.add(material);
      for (const value of Object.values(material))
        if (value?.isTexture) textures.add(value);
      for (const uniform of Object.values(material.uniforms || {}))
        if (uniform.value?.isTexture) textures.add(uniform.value);
    }
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
  disposeDetailGeometry();
}
function useFallback() {
  initialized = false;
  suspend();
  disposeScene();
  renderer?.dispose();
  controls?.dispose();
  document.body.classList.add("no-webgl");
  $("scene-status").textContent = "3D UNAVAILABLE · USE ALL WORK";
  $("announcer").textContent =
    "3D rendering is unavailable. All destinations remain available in the shortcuts and All work.";
  for (const id of ["zoom-in", "zoom-out"]) $(id).disabled = true;
}
for (const link of document.querySelectorAll('a[href="/"]')) {
  link.addEventListener("click", () => {
    suspend();
    disposeScene();
    renderer?.dispose();
    renderer?.domElement.remove();
  });
}
try {
  initialize();
} catch (error) {
  console.warn(
    "Orbital switched to the accessible non-3D view:",
    error.message,
  );
  useFallback();
}
