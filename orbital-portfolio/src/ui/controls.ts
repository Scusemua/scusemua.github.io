import { destinations } from "../data/content.js";
import { app, $, mobile, reducedMotion } from "../state.js";
import { visit, closeDestination, tour } from "./detail.js";

// TODO: replace locked() with direct app.flyingIn reads for consistency with other app.* flag checks
function locked(): boolean {
  return app.flyingIn;
}

let invalidateFn: () => void;
let suspendFn: () => void;
let zoomFn: (factor: number) => void;

export function initControls(deps: {
  invalidate: () => void;
  suspend: () => void;
  zoom: (factor: number) => void;
}): void {
  invalidateFn = deps.invalidate;
  suspendFn = deps.suspend;
  zoomFn = deps.zoom;
}

function updateMotion(): void {
  $("motion").setAttribute("aria-pressed", String(app.motion));
  $("motion").title = app.motion ? "Pause ambient motion" : "Resume ambient motion";
  $("motion-icon").textContent = app.motion ? "Ⅱ" : "▷";
  $("motion-label").textContent = app.motion ? "Motion on" : "Motion off";
}

export function setMotion(value: boolean): void {
  app.motion = value;
  updateMotion();
  app.backdrop?.setMotion(value);
  if (!app.motion && app.tween) {
    app.camera.position.copy(app.tween.toCamera);
    app.controls.target.copy(app.tween.toTarget);
    app.tween = null;
    app.cameraDirty = true;
    if (app.flyingIn) {
      app.flyingIn = false;
      app.controls.enabled = true;
    }
  }
  app.lastAmbient = 0;
  invalidateFn();
}

function openDialog(dialog: HTMLDialogElement): void {
  dialog.showModal();
  app.modalOpen = true;
  suspendFn();
}

export function bindControls(): void {
  $("begin").addEventListener("click", () => { if (!locked()) visit(destinations[0].id); });
  $("about").addEventListener("click", () => { if (!locked()) visit("station"); });
  $("close-detail").addEventListener("click", () => { if (!locked()) closeDestination(); });
  $("home").addEventListener("click", () => { if (!locked()) closeDestination(false); });
  $("explore").addEventListener("click", () => { if (!locked()) closeDestination(false); });
  $("reset").addEventListener("click", () => { if (!locked()) closeDestination(false); });
  $("prev").addEventListener("click", () => { if (!locked()) tour(-1); });
  $("next").addEventListener("click", () => { if (!locked()) tour(1); });
  $("index").addEventListener("click", () => {
    if (!locked()) openDialog($("index-dialog") as HTMLDialogElement);
  });
  $("help").addEventListener("click", () => {
    if (!locked()) openDialog($("help-dialog") as HTMLDialogElement);
  });
  $("motion").addEventListener("click", () => { if (!locked()) setMotion(!app.motion); });
  reducedMotion.addEventListener("change", (event) => setMotion(!event.matches));
  $("zoom-in").addEventListener("click", () => { if (!locked()) zoomFn(0.85); });
  $("zoom-out").addEventListener("click", () => { if (!locked()) zoomFn(1.18); });

  for (const dialog of document.querySelectorAll("dialog")) {
    dialog
      .querySelector("[data-close-dialog]")!
      .addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      app.modalOpen = !!document.querySelector("dialog[open]");
      app.lastAmbient = 0;
      invalidateFn();
    });
    // Close dialog on backdrop click. <dialog> fills the viewport, so a click
    // outside the content rect means the user tapped the backdrop overlay.
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
    if (locked()) return;
    if (
      event.key === "Escape" &&
      app.selected &&
      !document.querySelector("dialog[open]")
    )
      closeDestination();
    if (
      (event.key === "m" || event.key === "M") &&
      !event.ctrlKey &&
      !event.metaKey &&
      !document.querySelector("dialog[open]")
    ) {
      app.backdrop?.triggerMeteorShower();
      invalidateFn();
    }
  });

  updateMotion();

  document
    .querySelector(".bottom")
    ?.addEventListener("pointerdown", resetBarIdle);
  document
    .querySelector(".bottom")
    ?.addEventListener("pointerenter", resetBarIdle);
  document.addEventListener("pointerdown", resetBarIdle);
  document.addEventListener("scroll", resetBarIdle, { passive: true });
  resetBarIdle();
}

// Hide the mobile bottom bar after 2.5s of inactivity to maximize the
// viewport for the 3D scene. Any touch or scroll resets the timer.
let barIdleTimer: ReturnType<typeof setTimeout> | number = 0;
function resetBarIdle(): void {
  const bottom = document.querySelector(".bottom");
  if (bottom) bottom.classList.remove("idle");
  clearTimeout(barIdleTimer);
  if (mobile())
    barIdleTimer = setTimeout(() => {
      const b = document.querySelector(".bottom");
      if (b) b.classList.add("idle");
    }, 2500);
}
