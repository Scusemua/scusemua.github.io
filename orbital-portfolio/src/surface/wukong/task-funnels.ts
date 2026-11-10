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
// Build
// ---------------------------------------------------------------------------

export function buildTaskFunnels(arch: Architecture): TaskFunnel[] {
  const funnels: TaskFunnel[] = [];
  for (const comp of arch.components) {
    if (comp.shape !== "factory") continue;
    const pos = new THREE.Vector3(...comp.position);
    const funnelMat = toon("#f5d060");
    const funnelEdgeMat = new THREE.LineBasicMaterial({ color: "#10131d" });
    funnels.push({
      target: pos.clone().add(new THREE.Vector3(0, 3.6, 0)),
      cubes: [],
      interval: 0.8,
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

const _cubeGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
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
      const spawnX = funnel.target.x + (Math.random() - 0.5) * 1.6;
      const spawnZ = funnel.target.z + (Math.random() - 0.5) * 1.6;
      cube.position.set(spawnX, funnel.target.y + 4, spawnZ);
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const edgeLine = new THREE.LineSegments(_cubeEdges, funnel.edgeMat);
      cube.add(edgeLine);
      ctx.scene.add(cube);
      funnel.cubes.push({
        mesh: cube,
        t: 0,
        speed: 1.5 + Math.random() * 0.5,
      });
    }
    for (let i = funnel.cubes.length - 1; i >= 0; i--) {
      const tc = funnel.cubes[i];
      tc.t += delta * tc.speed;
      tc.mesh.position.y = funnel.target.y + 4 - tc.t * 4;
      tc.mesh.rotation.x += delta * 2;
      tc.mesh.rotation.z += delta * 1.5;
      const scale = tc.t > 0.85 ? Math.max(0, 1 - (tc.t - 0.85) / 0.15) : 1;
      tc.mesh.scale.setScalar(scale);
      if (tc.t >= 1) {
        ctx.scene.remove(tc.mesh);
        funnel.cubes.splice(i, 1);
      }
    }
  }
}
