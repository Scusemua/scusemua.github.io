import * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Backdrop } from "./backdrop/index.js";

export interface TweenState {
  started: number;
  fromCamera: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toCamera: THREE.Vector3;
  toTarget: THREE.Vector3;
  duration?: number;
  ease?: (t: number) => number;
}

export interface PointerDown {
  x: number;
  y: number;
  id: number;
  dragged: boolean;
}

export interface AppState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  backdrop: Backdrop;
  initialCamera: THREE.Vector3;
  initialTarget: THREE.Vector3;

  motion: boolean;
  selected: string | null;
  returnFocus: Element | null;
  tween: TweenState | null;
  initialized: boolean;
  cameraDirty: boolean;
  frameDirty: boolean;
  raf: number;
  timer: ReturnType<typeof setTimeout> | number;
  inFrame: boolean;
  lastAmbient: number;
  interacting: boolean;
  modalOpen: boolean;
  damping: boolean;
  dampingDeadline: number;
  shrinkProgress: number;
  hoverPoint: { x: number; y: number } | null;
  down: PointerDown | null;
  mobileDelay: ReturnType<typeof setTimeout> | undefined;

  activePointers: Set<number>;
  worlds: Map<string, THREE.Group>;
  labels: Map<string, HTMLElement>;
  cards: Map<string, HTMLElement>;
  pickable: THREE.Group[];
  labelCache: Map<string, string>;
}

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

export const app: AppState = {
  scene: undefined!,
  camera: undefined!,
  renderer: undefined!,
  controls: undefined!,
  backdrop: undefined!,
  initialCamera: undefined!,
  initialTarget: undefined!,

  motion: !reducedMotion.matches,
  selected: null,
  returnFocus: null,
  tween: null,
  initialized: false,
  cameraDirty: true,
  frameDirty: true,
  raf: 0,
  timer: 0,
  inFrame: false,
  lastAmbient: 0,
  interacting: false,
  modalOpen: false,
  damping: false,
  dampingDeadline: 0,
  shrinkProgress: 0,
  hoverPoint: null,
  down: null,
  mobileDelay: undefined,

  activePointers: new Set(),
  worlds: new Map(),
  labels: new Map(),
  cards: new Map(),
  pickable: [],
  labelCache: new Map(),
};

export { reducedMotion };

export const $ = (id: string): HTMLElement => document.getElementById(id)!;

export const mobile = (): boolean => innerWidth <= 760;

export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function upperKeepLambda(str: string): string {
  return str.replace(/[^λ]/g, (c) => c.toUpperCase());
}

export function setTextKeepLambda(el: HTMLElement, str: string): void {
  el.textContent = "";
  for (const part of str.split(/(λ)/)) {
    if (part === "λ") {
      const span = document.createElement("span");
      span.style.textTransform = "none";
      span.textContent = "λ";
      el.append(span);
    } else {
      el.append(part);
    }
  }
}
