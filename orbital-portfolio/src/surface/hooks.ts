import type * as THREE from "three";
import type { Architecture } from "./types.js";

export interface SurfaceContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  architecture: Architecture;
  components: Map<string, THREE.Group>;
  labels: Map<string, HTMLElement>;
  elapsed: number;
}

export interface BoardFocusView {
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}

export interface SurfaceHooks {
  onBuild(ctx: SurfaceContext): void;
  onUpdate(ctx: SurfaceContext, delta: number): void;
  onUpdateLabels(ctx: SurfaceContext): void;
  onDispose(ctx: SurfaceContext): void;
  getBoardMeshes?(): { mesh: THREE.Object3D; id: string; view: BoardFocusView }[];
}
