import * as THREE from "three";
import { seededRandom, toSRGB } from "../../utils.js";

export interface PlanetarySurface {
  time: { value: number };
  meshes: THREE.Object3D[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROCK_COUNT = 22;
const ROCK_PALETTE = ["#1a3848", "#243e50", "#1e4458", "#2a3a44", "#1c3040"];

const MOUNTAIN_SEGMENTS = 40;
const MOUNTAIN_RADIUS = 80;

const DUST_COUNT = 90;

// ---------------------------------------------------------------------------
// Layer 1: Rock formations (instanced toon-shaded icosahedra)
// ---------------------------------------------------------------------------

function buildRockFormations(): THREE.InstancedMesh {
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
        float d = dot(normalize(vNormal), normalize(vec3(-.7, .9, 1.)));
        float shade = d > .55 ? 1. : d > .05 ? .70 : .36;
        gl_FragColor = vec4(vColor * shade, 1.);
      }`,
  });

  const rocks = new THREE.InstancedMesh(geometry, material, ROCK_COUNT);
  rocks.name = "surface-rocks";
  const obj = new THREE.Object3D();
  const random = seededRandom(742);

  for (let i = 0; i < ROCK_COUNT; i++) {
    let x: number, z: number;
    let attempts = 0;
    do {
      const angle = random() * Math.PI * 2;
      const dist = 18 + random() * 20;
      x = Math.cos(angle) * dist;
      z = Math.sin(angle) * dist;
      attempts++;
    } while (attempts < 100 && x > -10 && x < 20 && z > -16 && z < 14);

    const baseSize = 0.4 + random() * 1.0;
    const sx = baseSize * (0.7 + random() * 0.6);
    const sy = baseSize * (0.5 + random() * 0.5);
    const sz = baseSize * (0.7 + random() * 0.6);

    obj.position.set(x, sy * 0.5, z);
    obj.scale.set(sx, sy, sz);
    obj.rotation.set(random() * 0.4, random() * Math.PI * 2, random() * 0.4);
    obj.updateMatrix();
    rocks.setMatrixAt(i, obj.matrix);
    rocks.setColorAt(
      i,
      toSRGB(new THREE.Color(ROCK_PALETTE[i % ROCK_PALETTE.length])),
    );
  }

  rocks.instanceMatrix.needsUpdate = true;
  rocks.instanceColor!.needsUpdate = true;
  return rocks;
}

// ---------------------------------------------------------------------------
// Layer 2: Horizon mountain silhouettes
// ---------------------------------------------------------------------------

function buildMountainSilhouettes(): THREE.Mesh {
  const random = seededRandom(743);

  const arcStart = 0;
  const arcSpan = Math.PI * 2;

  const heights: number[] = [];
  for (let i = 0; i <= MOUNTAIN_SEGMENTS; i++) {
    if (i % 2 === 0) {
      heights.push(8 + random() * 12);
    } else {
      heights.push(heights[i - 1] * (0.15 + random() * 0.2));
    }
  }

  const positions: number[] = [];
  const uvs: number[] = [];
  for (let i = 0; i <= MOUNTAIN_SEGMENTS; i++) {
    const t = i / MOUNTAIN_SEGMENTS;
    const angle = arcStart + t * arcSpan;
    const x = Math.cos(angle) * MOUNTAIN_RADIUS;
    const z = Math.sin(angle) * MOUNTAIN_RADIUS;

    positions.push(x, 0, z);
    uvs.push(t, 0);

    positions.push(x, heights[i], z);
    uvs.push(t, 1);
  }

  const indices: number[] = [];
  for (let i = 0; i < MOUNTAIN_SEGMENTS; i++) {
    const bl = i * 2;
    const tl = i * 2 + 1;
    const br = (i + 1) * 2;
    const tr = (i + 1) * 2 + 1;
    indices.push(bl, br, tl);
    indices.push(tl, br, tr);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      varying float vDist;
      void main() {
        vUv = uv;
        vec4 worldPos = modelMatrix * vec4(position, 1.);
        vDist = length(worldPos.xz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }`,
    fragmentShader: `
      varying vec2 vUv;
      varying float vDist;
      void main() {
        vec3 base = vec3(0.047, 0.102, 0.141);
        vec3 peak = vec3(0.102, 0.188, 0.251);
        vec3 sky  = vec3(0.039, 0.082, 0.125);
        vec3 color = mix(base, peak, vUv.y);
        float fog = exp(-0.0001 * vDist * vDist);
        color = mix(sky, color, fog);
        gl_FragColor = vec4(color, 1.);
      }`,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "surface-mountains";
  return mesh;
}

// ---------------------------------------------------------------------------
// Layer 4: Horizon atmospheric glow
// ---------------------------------------------------------------------------

function buildAtmosphereGlow(): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(
    84, 84, 24, 40, 1, true,
  );

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }`,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        vec3 color = vec3(0.102, 0.353, 0.439);
        float glow = (1.0 - vUv.y) * exp(-vUv.y * 3.0);
        gl_FragColor = vec4(color, glow * 0.15);
      }`,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 12;
  mesh.renderOrder = -1;
  mesh.name = "surface-atmosphere";
  return mesh;
}

// ---------------------------------------------------------------------------
// Layer 5: Floating dust particles
// ---------------------------------------------------------------------------

function buildDustParticles(time: { value: number }): THREE.Points {
  const random = seededRandom(744);
  const positions: number[] = [];
  const sizes: number[] = [];
  const phases: number[] = [];
  const speeds: number[] = [];

  for (let i = 0; i < DUST_COUNT; i++) {
    positions.push(
      (random() - 0.5) * 50,
      0.5 + random() * 3.5,
      (random() - 0.5) * 50,
    );
    sizes.push(1.5 + random() * 3.0);
    phases.push(random() * Math.PI * 2);
    speeds.push(0.05 + random() * 0.1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizes, 1),
  );
  geometry.setAttribute(
    "aPhase",
    new THREE.Float32BufferAttribute(phases, 1),
  );
  geometry.setAttribute(
    "aSpeed",
    new THREE.Float32BufferAttribute(speeds, 1),
  );

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: time },
    vertexShader: `
      uniform float uTime;
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        pos.x += sin(uTime * aSpeed + aPhase) * 1.5;
        pos.z += cos(uTime * aSpeed * 0.7 + aPhase * 1.3) * 1.5;
        pos.y += sin(uTime * aSpeed * 0.5 + aPhase * 0.7) * 0.3;
        vec4 mv = modelViewMatrix * vec4(pos, 1.);
        gl_PointSize = clamp(aSize * 120. / (-mv.z), 0.5, 4.);
        float edgeFade = 1.0 - smoothstep(20.0, 25.0, max(abs(pos.x), abs(pos.z)));
        vAlpha = edgeFade * 0.25;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float glow = 1.0 - smoothstep(0.0, 0.5, d);
        gl_FragColor = vec4(0.45, 0.75, 0.85, glow * vAlpha);
      }`,
  });

  const points = new THREE.Points(geometry, material);
  points.name = "surface-dust";
  return points;
}

// ---------------------------------------------------------------------------
// Public builder
// ---------------------------------------------------------------------------

export function buildPlanetarySurface(scene: THREE.Scene): PlanetarySurface {
  const time = { value: 0 };
  const meshes: THREE.Object3D[] = [];

  const rocks = buildRockFormations();
  scene.add(rocks);
  meshes.push(rocks);

  const mountains = buildMountainSilhouettes();
  scene.add(mountains);
  meshes.push(mountains);

  const glow = buildAtmosphereGlow();
  scene.add(glow);
  meshes.push(glow);

  const dust = buildDustParticles(time);
  scene.add(dust);
  meshes.push(dust);

  return { time, meshes };
}
