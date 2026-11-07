import { destinations } from "../data/content.js";
import { app, $, mobile, reducedMotion } from "../state.js";
import { visit, closeDestination, tour } from "./detail.js";

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
  $("begin").addEventListener("click", () => visit(destinations[0].id));
  $("about").addEventListener("click", () => visit("station"));
  $("close-detail").addEventListener("click", () => closeDestination());
  $("home").addEventListener("click", () => closeDestination(false));
  $("explore").addEventListener("click", () => closeDestination(false));
  $("reset").addEventListener("click", () => closeDestination(false));
  $("prev").addEventListener("click", () => tour(-1));
  $("next").addEventListener("click", () => tour(1));
  $("index").addEventListener("click", () =>
    openDialog($("index-dialog") as HTMLDialogElement),
  );
  $("help").addEventListener("click", () =>
    openDialog($("help-dialog") as HTMLDialogElement),
  );
  $("motion").addEventListener("click", () => setMotion(!app.motion));
  reducedMotion.addEventListener("change", (event) => setMotion(!event.matches));
  $("zoom-in").addEventListener("click", () => zoomFn(0.85));
  $("zoom-out").addEventListener("click", () => zoomFn(1.18));

  for (const dialog of document.querySelectorAll("dialog")) {
    dialog
      .querySelector("[data-close-dialog]")!
      .addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      app.modalOpen = !!document.querySelector("dialog[open]");
      app.lastAmbient = 0;
      invalidateFn();
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
