import * as THREE from "three";
import { toSRGB, seededRandom } from "../utils.js";
import { SCENE_CENTER_X, ORBIT_Z_SCALE } from "../scene-layout.js";

export interface AsteroidBelt {
  update(elapsed: number): void;
}

const ASTEROID_COUNT = 72;
const BELT_RADIUS = 24;
const BELT_RADIUS_VARIANCE = 4;
const BASE_SIZE = 0.2;
const SIZE_VARIANCE = 0.39;
const Y_SPREAD = 1.7;
const ROTATION_SPEED = 0.003;
const PALETTE = ["#8b829f", "#b89a94", "#647c92", "#a097bd"];

// Icosahedron subdivision 0 gives a faceted look that reads well with the
// toon shading — smooth spheres would lose the hand-drawn aesthetic.
export function createAsteroidBelt(scene: THREE.Scene): AsteroidBelt {
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vColor;
      void main() {
        mat4 transform = modelMatrix * instanceMatrix;
        vNormal = normalize(mat3(transform) * normal);
        vColor = instanceColor;
        gl_Position = projectionMatrix * viewMatrix * transform * vec4(position, 1.);
      }`,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vColor;
      void main() {
        float d = dot(normalize(vNormal), normalize(vec3(-.5, .8, 1.)));
        float shade = d > .55 ? 1. : d > .05 ? .70 : .36;
        gl_FragColor = vec4(vColor * shade, 1.);
      }`,
  });
  const rocks = new THREE.InstancedMesh(geometry, material, ASTEROID_COUNT);
  rocks.name = "asteroid-belt";
  rocks.userData.effect = "asteroids";
  const object = new THREE.Object3D();
  const random = seededRandom(621);
  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const angle = (i / ASTEROID_COUNT) * Math.PI * 2 + random() * 0.045,
      radius = BELT_RADIUS + random() * BELT_RADIUS_VARIANCE;
    object.position.set(
      SCENE_CENTER_X + Math.cos(angle) * radius,
      (random() - 0.5) * Y_SPREAD,
      Math.sin(angle) * radius * ORBIT_Z_SCALE,
    );
    const size = BASE_SIZE + random() * SIZE_VARIANCE;
    object.scale.set(
      size * (0.75 + random() * 0.55),
      size * (0.65 + random() * 0.5),
      size,
    );
    object.rotation.set(
      random() * Math.PI,
      random() * Math.PI,
      random() * Math.PI,
    );
    object.updateMatrix();
    rocks.setMatrixAt(i, object.matrix);
    rocks.setColorAt(
      i,
      toSRGB(new THREE.Color(PALETTE[i % PALETTE.length])),
    );
  }
  rocks.instanceMatrix.needsUpdate = true;
  rocks.instanceColor!.needsUpdate = true;
  scene.add(rocks);
  return {
    update(elapsed: number) {
      rocks.rotation.y = elapsed * ROTATION_SPEED;
    },
  };
}
