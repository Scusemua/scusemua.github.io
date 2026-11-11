import * as THREE from "three";
import { toon, edgeMaterial } from "../../world/rendering.js";
import type { SurfaceContext } from "../hooks.js";
import type { Architecture } from "../types.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TaskCube {
  mesh: THREE.Mesh;
  t: number;
  speed: number;
}

export interface TaskFunnel {
  target: THREE.Vector3;
  cubes: TaskCube[];
  interval: number;
  timer: number;
  material: THREE.ShaderMaterial;
  edgeMat: THREE.LineBasicMaterial;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FUNNEL_CUBE_COLOR = "#f5d060";
const FUNNEL_EDGE_COLOR = "#10131d";
const FUNNEL_Y_OFFSET = 3.6;
const FUNNEL_SPAWN_INTERVAL = 0.8;
const FUNNEL_CUBE_SIZE = 0.25;
const FUNNEL_SPAWN_SPREAD = 1.6;
const FUNNEL_DROP_HEIGHT = 4;
const FUNNEL_SPEED_BASE = 1.5;
const FUNNEL_SPEED_RANGE = 0.5;
const FUNNEL_TUMBLE_X = 2;
const FUNNEL_TUMBLE_Z = 1.5;
const FUNNEL_FADE_START = 0.85;
const FUNNEL_FADE_RANGE = 0.15;

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function buildTaskFunnels(arch: Architecture): TaskFunnel[] {
  const funnels: TaskFunnel[] = [];
  for (const comp of arch.components) {
    if (comp.shape !== "factory") continue;
    const pos = new THREE.Vector3(...comp.position);
    const funnelMat = toon(FUNNEL_CUBE_COLOR);
    const funnelEdgeMat = new THREE.LineBasicMaterial({
      color: FUNNEL_EDGE_COLOR,
    });
    funnels.push({
      target: pos.clone().add(new THREE.Vector3(0, FUNNEL_Y_OFFSET, 0)),
      cubes: [],
      interval: FUNNEL_SPAWN_INTERVAL,
      timer: 0,
      material: funnelMat,
      edgeMat: funnelEdgeMat,
    });
  }
  return funnels;
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

const _cubeGeo = new THREE.BoxGeometry(
  FUNNEL_CUBE_SIZE,
  FUNNEL_CUBE_SIZE,
  FUNNEL_CUBE_SIZE,
);
const _cubeEdges = new THREE.EdgesGeometry(_cubeGeo, 30);

export function updateTaskFunnels(
  funnels: TaskFunnel[],
  ctx: SurfaceContext,
  delta: number,
): void {
  for (const funnel of funnels) {
    funnel.timer += delta;
    if (funnel.timer >= funnel.interval) {
      funnel.timer -= funnel.interval;
      const cube = new THREE.Mesh(_cubeGeo, funnel.material);
      const spawnX =
        funnel.target.x + (Math.random() - 0.5) * FUNNEL_SPAWN_SPREAD;
      const spawnZ =
        funnel.target.z + (Math.random() - 0.5) * FUNNEL_SPAWN_SPREAD;
      cube.position.set(spawnX, funnel.target.y + FUNNEL_DROP_HEIGHT, spawnZ);
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const edgeLine = new THREE.LineSegments(_cubeEdges, funnel.edgeMat);
      cube.add(edgeLine);
      ctx.scene.add(cube);
      funnel.cubes.push({
        mesh: cube,
        t: 0,
        speed: FUNNEL_SPEED_BASE + Math.random() * FUNNEL_SPEED_RANGE,
      });
    }
    for (let i = funnel.cubes.length - 1; i >= 0; i--) {
      const tc = funnel.cubes[i];
      tc.t += delta * tc.speed;
      tc.mesh.position.y =
        funnel.target.y + FUNNEL_DROP_HEIGHT - tc.t * FUNNEL_DROP_HEIGHT;
      tc.mesh.rotation.x += delta * FUNNEL_TUMBLE_X;
      tc.mesh.rotation.z += delta * FUNNEL_TUMBLE_Z;
      const scale =
        tc.t > FUNNEL_FADE_START
          ? Math.max(0, 1 - (tc.t - FUNNEL_FADE_START) / FUNNEL_FADE_RANGE)
          : 1;
      tc.mesh.scale.setScalar(scale);
      if (tc.t >= 1) {
        ctx.scene.remove(tc.mesh);
        funnel.cubes.splice(i, 1);
      }
    }
  }
}
