import * as THREE from "three";
import { destinations } from "../data/content.js";
import type { Destination, Vec3 } from "../types.js";

interface Meteor {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  targetId: string;
  targetPos: THREE.Vector3;
  targetRadius: number;
  alive: boolean;
  age: number;
  trail: THREE.Vector3[];
  trailAge: number[];
  speed: number;
  size: number;
  impacted: boolean;
}

interface Impact {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  age: number;
  maxAge: number;
  radius: number;
  maxRadius: number;
}

export interface MeteorShower {
  trigger(): void;
  update(delta: number): void;
  active(): boolean;
}

export type OnImpactCallback = (targetId: string, intensity: number) => void;

const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();

const TRAIL_LENGTH = 18;
const MAX_TRAIL_AGE = 0.6;
const METEOR_SPEED_MIN = 28;
const METEOR_SPEED_MAX = 45;
const IMPACT_DURATION = 0.8;
const IMPACT_MAX_RADIUS = 4;
const WAVE_COUNT = 24;
const WAVE_INTERVAL = 0.06;

export function createMeteorShower(
  scene: THREE.Scene,
  invalidate: () => void,
  onImpact?: OnImpactCallback,
): MeteorShower {
  const meteors: Meteor[] = [];
  const impacts: Impact[] = [];
  let waveRemaining = 0;
  let waveTimer = 0;

  const planets = destinations.filter((d) => d.kind === "planet");

  // ── Trail rendering (instanced planes aligned to velocity) ──
  const trailGeometry = new THREE.PlaneGeometry(1, 1);
  const trailMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      attribute vec3 instancePosition;
      attribute vec3 instanceDirection;
      attribute float instanceAge;
      attribute float instanceSize;
      varying float vAge;
      varying vec2 vUv;
      void main() {
        vAge = instanceAge;
        vUv = uv;
        float scale = instanceSize * (1.0 - instanceAge * 0.5);
        // Project velocity direction into screen space for streak alignment
        vec3 dir = normalize(instanceDirection);
        vec3 toCamera = normalize(cameraPosition - instancePosition);
        vec3 across = normalize(cross(dir, toCamera));
        // x stretches along velocity (elongated streak), y across it (thin)
        vec3 pos = instancePosition
          + dir * position.x * scale * 2.5
          + across * position.y * scale * 0.3;
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAge;
      varying vec2 vUv;
      void main() {
        float dx = vUv.x - 0.5;
        float dy = vUv.y - 0.5;
        float d = sqrt(dx * dx * 0.5 + dy * dy * 4.0);
        float alpha = smoothstep(0.5, 0.0, d) * (1.0 - vAge);
        vec3 hot = vec3(1.0, 0.95, 0.8);
        vec3 mid = vec3(1.0, 0.5, 0.1);
        vec3 cool = vec3(0.8, 0.15, 0.05);
        vec3 color = mix(hot, mix(mid, cool, vAge), vAge);
        gl_FragColor = vec4(color, alpha * 0.9);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const MAX_INSTANCES = WAVE_COUNT * TRAIL_LENGTH;
  const trailMesh = new THREE.InstancedMesh(trailGeometry, trailMaterial, MAX_INSTANCES);
  trailMesh.frustumCulled = false;
  trailMesh.raycast = () => {};
  trailMesh.visible = false;

  const instancePositions = new Float32Array(MAX_INSTANCES * 3);
  const instanceDirections = new Float32Array(MAX_INSTANCES * 3);
  const instanceAges = new Float32Array(MAX_INSTANCES);
  const instanceSizes = new Float32Array(MAX_INSTANCES);
  trailMesh.geometry.setAttribute("instancePosition", new THREE.InstancedBufferAttribute(instancePositions, 3));
  trailMesh.geometry.setAttribute("instanceDirection", new THREE.InstancedBufferAttribute(instanceDirections, 3));
  trailMesh.geometry.setAttribute("instanceAge", new THREE.InstancedBufferAttribute(instanceAges, 1));
  trailMesh.geometry.setAttribute("instanceSize", new THREE.InstancedBufferAttribute(instanceSizes, 1));
  scene.add(trailMesh);

  // ── Impact fireball rendering ──
  const impactGeometry = new THREE.SphereGeometry(1, 20, 14);
  const impactMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vLocalPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vLocalPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vLocalPos;

      // Simple 3D noise for fire turbulence
      float hash(vec3 p) {
        p = fract(p * vec3(443.897, 441.423, 437.195));
        p += dot(p, p.yzx + 19.19);
        return fract((p.x + p.y) * p.z);
      }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
              mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
              mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p) {
        float v = 0.0;
        v += 0.5 * noise(p); p *= 2.1;
        v += 0.25 * noise(p); p *= 2.3;
        v += 0.125 * noise(p);
        return v;
      }

      void main() {
        float rim = 1.0 - abs(dot(vNormal, normalize(cameraPosition - vWorldPos)));
        // Animated fire noise
        float n = fbm(vLocalPos * 4.0 + uProgress * 8.0);
        float fireShape = n * (1.0 - uProgress);

        // Bright white flash in first 10%
        float flash = smoothstep(0.1, 0.0, uProgress);
        // Core glow that fades
        float core = (1.0 - uProgress * uProgress) * (0.6 + fireShape * 0.4);
        // Rim fire
        float rimFire = rim * rim * (1.0 - uProgress) * 0.8;

        // Color: white → yellow → orange → red → dark
        vec3 white = vec3(1.0, 1.0, 0.95);
        vec3 yellow = vec3(1.0, 0.85, 0.3);
        vec3 orange = vec3(1.0, 0.4, 0.05);
        vec3 red = vec3(0.6, 0.1, 0.02);
        vec3 color;
        if (uProgress < 0.15) {
          color = mix(white, yellow, uProgress / 0.15);
        } else if (uProgress < 0.45) {
          color = mix(yellow, orange, (uProgress - 0.15) / 0.3);
        } else {
          color = mix(orange, red, (uProgress - 0.45) / 0.55);
        }
        // Add bright noise-driven hotspots
        color += vec3(1.0, 0.7, 0.2) * fireShape * (1.0 - uProgress) * 0.5;

        float alpha = max(flash * 1.5, core + rimFire);
        alpha *= smoothstep(1.0, 0.7, uProgress);

        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
      }
    `,
    uniforms: {
      uProgress: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const impactMeshes: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(impactGeometry, impactMaterial.clone());
    mesh.visible = false;
    mesh.frustumCulled = false;
    mesh.raycast = () => {};
    scene.add(mesh);
    impactMeshes.push(mesh);
  }

  // ── Shockwave ring rendering ──
  const ringGeometry = new THREE.TorusGeometry(1, 0.06, 8, 48);
  const ringMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      void main() {
        float fade = 1.0 - uProgress;
        float rim = pow(1.0 - abs(dot(vNormal, normalize(cameraPosition - vWorldPos))), 2.0);
        vec3 color = mix(vec3(1.0, 0.7, 0.2), vec3(1.0, 0.3, 0.05), uProgress);
        float alpha = fade * fade * (0.5 + rim * 0.5);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: { uProgress: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const ringMeshes: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    mesh.visible = false;
    mesh.frustumCulled = false;
    mesh.raycast = () => {};
    scene.add(mesh);
    ringMeshes.push(mesh);
  }

  // ── Ember / spark particle system ──
  const EMBER_COUNT = 200;
  const emberGeometry = new THREE.BufferGeometry();
  const emberPositions = new Float32Array(EMBER_COUNT * 3);
  const emberVelocities: THREE.Vector3[] = [];
  const emberAges = new Float32Array(EMBER_COUNT);
  const emberMaxAges = new Float32Array(EMBER_COUNT);
  const emberActive = new Uint8Array(EMBER_COUNT);
  const emberColorArray = new Float32Array(EMBER_COUNT * 3);
  const emberSizeArray = new Float32Array(EMBER_COUNT);
  emberGeometry.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));
  emberGeometry.setAttribute("color", new THREE.BufferAttribute(emberColorArray, 3));
  emberGeometry.setAttribute("aSize", new THREE.BufferAttribute(emberSizeArray, 1));
  const emberMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float aSize;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = clamp(aSize * 180.0 / (-mv.z), 1.0, 8.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float glow = 1.0 - smoothstep(0.0, 0.5, d);
        gl_FragColor = vec4(vColor, glow * glow);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const embers = new THREE.Points(emberGeometry, emberMaterial);
  embers.frustumCulled = false;
  embers.raycast = () => {};
  embers.visible = false;
  scene.add(embers);
  for (let i = 0; i < EMBER_COUNT; i++) {
    emberVelocities.push(new THREE.Vector3());
  }

  function spawnMeteor(): void {
    const target = planets[Math.floor(Math.random() * planets.length)];
    const targetPos = new THREE.Vector3(...target.position);

    const phi = Math.random() * Math.PI * 0.4 + 0.1;
    const theta = Math.random() * Math.PI * 2;
    const spawnDist = 50 + Math.random() * 30;
    const spawnPos = new THREE.Vector3(
      targetPos.x + Math.sin(phi) * Math.cos(theta) * spawnDist,
      targetPos.y + Math.cos(phi) * spawnDist,
      targetPos.z + Math.sin(phi) * Math.sin(theta) * spawnDist,
    );

    const dir = targetPos.clone().sub(spawnPos).normalize();
    const speed = METEOR_SPEED_MIN + Math.random() * (METEOR_SPEED_MAX - METEOR_SPEED_MIN);

    meteors.push({
      position: spawnPos,
      velocity: dir.multiplyScalar(speed),
      targetId: target.id,
      targetPos,
      targetRadius: target.radius,
      alive: true,
      age: 0,
      trail: [],
      trailAge: [],
      speed,
      size: 0.6 + Math.random() * 0.8,
      impacted: false,
    });
  }

  function spawnImpact(position: THREE.Vector3, radius: number, normal: THREE.Vector3): void {
    impacts.push({
      position: position.clone(),
      normal: normal.clone(),
      age: 0,
      maxAge: IMPACT_DURATION,
      radius: 0.1,
      maxRadius: IMPACT_MAX_RADIUS * (radius / 3.5),
    });

    const emberTiers: {
      threshold: number;
      life: [number, number];
      speed: [number, number];
      r: [number, number]; g: [number, number]; b: [number, number];
      size: [number, number];
    }[] = [
      { threshold: 0.4,  life: [0.6, 0.4],  speed: [12, 14], r: [1.0, 0], g: [0.85, 0.15], b: [0.5, 0.4],   size: [0.2, 0.3] },
      { threshold: 0.75, life: [0.8, 0.6],  speed: [6, 8],   r: [1.0, 0], g: [0.3, 0.3],   b: [0.02, 0.08], size: [0.4, 0.4] },
      { threshold: 1.0,  life: [1.2, 0.8],  speed: [2, 4],   r: [0.5, 0.3], g: [0.1, 0.1], b: [0.02, 0],    size: [0.5, 0.6] },
    ];
    const spawnCount = 24;
    let spawned = 0;
    for (let i = 0; i < EMBER_COUNT && spawned < spawnCount; i++) {
      if (emberActive[i]) continue;
      emberActive[i] = 1;
      emberAges[i] = 0;
      const kind = Math.random();
      const tier = emberTiers.find((t) => kind < t.threshold)!;
      emberMaxAges[i] = tier.life[0] + Math.random() * tier.life[1];
      emberPositions[i * 3] = position.x;
      emberPositions[i * 3 + 1] = position.y;
      emberPositions[i * 3 + 2] = position.z;
      const outward = normal.clone().multiplyScalar(0.5 + Math.random() * 0.5);
      const scatter = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      );
      const v = outward.add(scatter).normalize();
      v.multiplyScalar(tier.speed[0] + Math.random() * tier.speed[1]);
      emberVelocities[i].copy(v);
      emberColorArray[i * 3] = tier.r[0] + Math.random() * tier.r[1];
      emberColorArray[i * 3 + 1] = tier.g[0] + Math.random() * tier.g[1];
      emberColorArray[i * 3 + 2] = tier.b[0] + Math.random() * tier.b[1];
      emberSizeArray[i] = tier.size[0] + Math.random() * tier.size[1];
      spawned++;
    }
    (emberGeometry.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
    (emberGeometry.getAttribute("aSize") as THREE.BufferAttribute).needsUpdate = true;
    embers.visible = true;
  }

  function updateInstances(): void {
    let idx = 0;
    for (const meteor of meteors) {
      if (!meteor.alive) continue;
      const dirX = meteor.velocity.x, dirY = meteor.velocity.y, dirZ = meteor.velocity.z;
      // Head particle
      if (idx < MAX_INSTANCES) {
        instancePositions[idx * 3] = meteor.position.x;
        instancePositions[idx * 3 + 1] = meteor.position.y;
        instancePositions[idx * 3 + 2] = meteor.position.z;
        instanceDirections[idx * 3] = dirX;
        instanceDirections[idx * 3 + 1] = dirY;
        instanceDirections[idx * 3 + 2] = dirZ;
        instanceAges[idx] = 0;
        instanceSizes[idx] = meteor.size * 1.5;
        idx++;
      }
      // Trail particles
      for (let t = 0; t < meteor.trail.length && idx < MAX_INSTANCES; t++) {
        instancePositions[idx * 3] = meteor.trail[t].x;
        instancePositions[idx * 3 + 1] = meteor.trail[t].y;
        instancePositions[idx * 3 + 2] = meteor.trail[t].z;
        instanceDirections[idx * 3] = dirX;
        instanceDirections[idx * 3 + 1] = dirY;
        instanceDirections[idx * 3 + 2] = dirZ;
        instanceAges[idx] = meteor.trailAge[t] / MAX_TRAIL_AGE;
        instanceSizes[idx] = meteor.size * (1.0 - meteor.trailAge[t] / MAX_TRAIL_AGE);
        idx++;
      }
    }
    // Zero out remaining
    for (let i = idx; i < MAX_INSTANCES; i++) {
      instanceSizes[i] = 0;
    }
    (trailMesh.geometry.getAttribute("instancePosition") as THREE.InstancedBufferAttribute).needsUpdate = true;
    (trailMesh.geometry.getAttribute("instanceDirection") as THREE.InstancedBufferAttribute).needsUpdate = true;
    (trailMesh.geometry.getAttribute("instanceAge") as THREE.InstancedBufferAttribute).needsUpdate = true;
    (trailMesh.geometry.getAttribute("instanceSize") as THREE.InstancedBufferAttribute).needsUpdate = true;
    trailMesh.count = idx;
    trailMesh.visible = idx > 0;
  }

  return {
    trigger() {
      waveRemaining = WAVE_COUNT;
      waveTimer = 0;
      trailMesh.visible = true;
    },

    active() {
      return waveRemaining > 0 || meteors.some((m) => m.alive) || impacts.length > 0;
    },

    update(delta: number) {
      if (!this.active()) return;

      // Spawn meteors in waves
      if (waveRemaining > 0) {
        waveTimer -= delta;
        while (waveTimer <= 0 && waveRemaining > 0) {
          spawnMeteor();
          waveRemaining--;
          waveTimer += WAVE_INTERVAL;
        }
      }

      // Update meteors
      for (const meteor of meteors) {
        if (!meteor.alive) continue;
        meteor.age += delta;

        // Add current position to trail
        meteor.trail.unshift(meteor.position.clone());
        meteor.trailAge.unshift(0);
        while (meteor.trail.length > TRAIL_LENGTH) {
          meteor.trail.pop();
          meteor.trailAge.pop();
        }
        for (let t = 0; t < meteor.trailAge.length; t++) {
          meteor.trailAge[t] += delta;
        }
        // Remove old trail segments
        while (
          meteor.trailAge.length > 0 &&
          meteor.trailAge[meteor.trailAge.length - 1] > MAX_TRAIL_AGE
        ) {
          meteor.trail.pop();
          meteor.trailAge.pop();
        }

        // Move
        meteor.position.addScaledVector(meteor.velocity, delta);

        // Check collision with target planet
        const dist = meteor.position.distanceTo(meteor.targetPos);
        if (dist <= meteor.targetRadius * 1.1) {
          meteor.alive = false;
          meteor.impacted = true;
          const surfaceNormal = meteor.position.clone().sub(meteor.targetPos).normalize();
          const surfacePoint = meteor.targetPos.clone().add(
            surfaceNormal.clone().multiplyScalar(meteor.targetRadius),
          );
          spawnImpact(surfacePoint, meteor.targetRadius, surfaceNormal);
          onImpact?.(meteor.targetId, meteor.size);
        }

        // Kill if too old or too far
        if (meteor.age > 6) meteor.alive = false;
      }

      // Update impacts (fireball + shockwave ring)
      for (let i = impacts.length - 1; i >= 0; i--) {
        const impact = impacts[i];
        impact.age += delta;
        const progress = impact.age / impact.maxAge;
        if (progress >= 1) {
          impacts.splice(i, 1);
          continue;
        }
        // Fireball: fast expansion then slow
        const expandEase = 1 - Math.pow(1 - progress, 3);
        impact.radius = impact.maxRadius * expandEase;

        // Fireball mesh
        const fireIdx = i % impactMeshes.length;
        const mesh = impactMeshes[fireIdx];
        mesh.visible = true;
        mesh.position.copy(impact.position);
        mesh.scale.setScalar(impact.radius);
        (mesh.material as THREE.ShaderMaterial).uniforms.uProgress.value = progress;

        // Shockwave ring: expands faster, fades quickly
        const ringIdx = i % ringMeshes.length;
        const ring = ringMeshes[ringIdx];
        ring.visible = true;
        ring.position.copy(impact.position);
        const ringScale = impact.maxRadius * 1.8 * expandEase;
        ring.scale.setScalar(ringScale);
        // Orient ring perpendicular to impact normal
        _quat.setFromUnitVectors(_up, impact.normal);
        ring.quaternion.copy(_quat);
        (ring.material as THREE.ShaderMaterial).uniforms.uProgress.value = Math.min(progress * 1.5, 1);
      }
      // Hide unused meshes
      for (let i = impacts.length; i < impactMeshes.length; i++) {
        impactMeshes[i].visible = false;
      }
      for (let i = impacts.length; i < ringMeshes.length; i++) {
        ringMeshes[i].visible = false;
      }

      // Update ember / spark / smoke particles
      let anyEmberActive = false;
      for (let i = 0; i < EMBER_COUNT; i++) {
        if (!emberActive[i]) continue;
        emberAges[i] += delta;
        if (emberAges[i] >= emberMaxAges[i]) {
          emberActive[i] = 0;
          emberPositions[i * 3 + 1] = -9999;
          emberSizeArray[i] = 0;
          continue;
        }
        anyEmberActive = true;
        emberPositions[i * 3] += emberVelocities[i].x * delta;
        emberPositions[i * 3 + 1] += emberVelocities[i].y * delta;
        emberPositions[i * 3 + 2] += emberVelocities[i].z * delta;
        // Gravity (light — we're in space but near planet)
        emberVelocities[i].y -= 3 * delta;
        // Drag
        emberVelocities[i].multiplyScalar(1 - 1.2 * delta);
        emberColorArray[i * 3] *= (1 - delta * 1.5);
        emberColorArray[i * 3 + 1] *= (1 - delta * 2.5);
        emberColorArray[i * 3 + 2] *= (1 - delta * 3.0);
        // Shrink over time
        emberSizeArray[i] *= (1 - delta * 0.8);
      }
      (emberGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      (emberGeometry.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
      (emberGeometry.getAttribute("aSize") as THREE.BufferAttribute).needsUpdate = true;
      if (!anyEmberActive && impacts.length === 0) embers.visible = false;

      updateInstances();

      // Clean up dead meteors with finished trails
      for (let i = meteors.length - 1; i >= 0; i--) {
        if (!meteors[i].alive && meteors[i].trail.length === 0) {
          meteors.splice(i, 1);
        }
      }

      invalidate();
    },
  };
}
