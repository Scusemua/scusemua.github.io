import { destinations, destinationById } from "../data/content.js";
import type { Destination } from "../types.js";
import {
  app, $, mobile, element,
  upperKeepLambda, setTextKeepLambda,
} from "../state.js";

export type FlyToFn = (destination: Destination) => void;
export type StartTweenFn = (position: import("three").Vector3, target: import("three").Vector3) => void;

let flyTo: FlyToFn;
let startTween: StartTweenFn;
let invalidate: () => void;

export function initDetail(
  flyToFn: FlyToFn,
  startTweenFn: StartTweenFn,
  invalidateFn: () => void,
): void {
  flyTo = flyToFn;
  startTween = startTweenFn;
  invalidate = invalidateFn;
}

export function visit(id: string): void {
  if (app.flyingIn) return;
  const destination = destinationById.get(id);
  if (!destination) return;
  if (!app.selected) app.returnFocus = document.activeElement;
  app.selected = id;
  document.body.classList.add("detail-open");
  if (mobile() && app.initialized) {
    ($("detail") as HTMLElement).hidden = true;
    clearTimeout(app.mobileDelay);
    app.mobileDelay = setTimeout(() => {
      ($("detail") as HTMLElement).hidden = false;
      $("detail").classList.add("slide-in");
      $("close-detail").focus({ preventScroll: true });
    }, 550);
  } else {
    ($("detail") as HTMLElement).hidden = false;
  }
  setTextKeepLambda($("detail-title"), destination.name);
  $("detail-kicker").textContent =
    `${destination.kind} ${destination.number} / ${destination.category}`;
  $("detail-subtitle").textContent = destination.subtitle;
  const visualTags: string[] =
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
  ] as const) {
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
      (anchor as HTMLAnchorElement).href = url.href;
      (anchor as HTMLAnchorElement).target = "_blank";
      (anchor as HTMLAnchorElement).rel = "noopener noreferrer";
      $("detail-resources").append(anchor);
    } catch {
      /* Invalid links are not rendered. */
    }
  }
  $("tour-position").textContent =
    `${destination.number} / ${String(destinations.length).padStart(2, "0")}`;
  for (const item of destinations) {
    app.cards.get(item.id)!.classList.toggle("selected", item.id === id);
    app.cards.get(item.id)!.setAttribute("aria-pressed", String(item.id === id));
    app.labels.get(item.id)!.classList.toggle("selected", item.id === id);
  }
  app.cards.get(id)!.scrollIntoView({ block: "nearest", inline: "nearest" });
  setTextKeepLambda(
    $("scene-status"),
    `NOW EXPLORING / ${upperKeepLambda(destination.name)}`,
  );
  $("announcer").textContent =
    `Exploring ${destination.name}, ${destination.category}. /.`;
  if (app.initialized) flyTo(destination);
  $("detail-scroll").scrollTop = 0;
  $("close-detail").focus({ preventScroll: true });
}

export function closeDestination(restore = true): void {
  app.selected = null;
  clearTimeout(app.mobileDelay);
  document.body.classList.remove("detail-open");
  ($("detail") as HTMLElement).hidden = true;
  $("detail").classList.remove("slide-in");
  for (const [id, card] of app.cards) {
    card.classList.remove("selected");
    card.setAttribute("aria-pressed", "false");
    app.labels.get(id)!.classList.remove("selected");
  }
  $("scene-status").textContent = app.initialized
    ? "EVERY WORLD HAS A STORY"
    : "3D UNAVAILABLE · USE ALL WORK";
  $("announcer").textContent = "Returned to the solar system overview.";
  if (app.initialized) startTween(app.initialCamera, app.initialTarget);
  if (restore && app.returnFocus?.isConnected)
    (app.returnFocus as HTMLElement).focus({ preventScroll: true });
  app.returnFocus = null;
}

export function tour(direction: number): void {
  const index = destinations.findIndex(
    (destination) => destination.id === app.selected,
  );
  visit(
    destinations[
      (index + direction + destinations.length) % destinations.length
    ].id,
  );
}
