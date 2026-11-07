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
  _camera: THREE.PerspectiveCamera,
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

  // ── Impact flash rendering ──
  const impactGeometry = new THREE.SphereGeometry(1, 16, 12);
  const impactMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        float rim = 1.0 - abs(dot(vNormal, normalize(cameraPosition - vWorldPos)));
        float alpha = (1.0 - uProgress) * (0.4 + rim * 0.6);
        vec3 hot = vec3(1.0, 0.85, 0.4);
        vec3 cool = vec3(1.0, 0.25, 0.05);
        vec3 color = mix(hot, cool, uProgress);
        // Add sparks at edges
        float spark = step(0.92, fract(atan(vNormal.x, vNormal.z) * 5.0 + uProgress * 20.0));
        color += spark * vec3(1.0, 0.9, 0.5) * (1.0 - uProgress);
        gl_FragColor = vec4(color, alpha);
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
  for (let i = 0; i < 6; i++) {
    const mesh = new THREE.Mesh(impactGeometry, impactMaterial.clone());
    mesh.visible = false;
    mesh.frustumCulled = false;
    mesh.raycast = () => {};
    scene.add(mesh);
    impactMeshes.push(mesh);
  }

  // ── Ember particle system for impacts ──
  const EMBER_COUNT = 80;
  const emberGeometry = new THREE.BufferGeometry();
  const emberPositions = new Float32Array(EMBER_COUNT * 3);
  const emberVelocities: THREE.Vector3[] = [];
  const emberAges = new Float32Array(EMBER_COUNT);
  const emberActive = new Uint8Array(EMBER_COUNT);
  emberGeometry.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));
  const emberMaterial = new THREE.PointsMaterial({
    color: "#ff8820",
    size: 0.4,
    transparent: true,
    opacity: 0.9,
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

  function spawnImpact(position: THREE.Vector3, radius: number): void {
    impacts.push({
      position: position.clone(),
      age: 0,
      maxAge: IMPACT_DURATION,
      radius: 0.1,
      maxRadius: IMPACT_MAX_RADIUS * (radius / 3.5),
    });

    // Spawn embers
    let spawned = 0;
    for (let i = 0; i < EMBER_COUNT && spawned < 12; i++) {
      if (emberActive[i]) continue;
      emberActive[i] = 1;
      emberAges[i] = 0;
      emberPositions[i * 3] = position.x;
      emberPositions[i * 3 + 1] = position.y;
      emberPositions[i * 3 + 2] = position.z;
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ).normalize().multiplyScalar(6 + Math.random() * 10);
      emberVelocities[i].copy(v);
      spawned++;
    }
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
          const surfacePoint = meteor.targetPos.clone().add(
            meteor.position.clone().sub(meteor.targetPos).normalize().multiplyScalar(meteor.targetRadius),
          );
          spawnImpact(surfacePoint, meteor.targetRadius);
          onImpact?.(meteor.targetId, meteor.size);
        }

        // Kill if too old or too far
        if (meteor.age > 6) meteor.alive = false;
      }

      // Update impacts
      for (let i = impacts.length - 1; i >= 0; i--) {
        const impact = impacts[i];
        impact.age += delta;
        const progress = impact.age / impact.maxAge;
        if (progress >= 1) {
          impacts.splice(i, 1);
          continue;
        }
        impact.radius = impact.maxRadius * Math.sqrt(progress);

        // Find an available impact mesh
        const mesh = impactMeshes[i % impactMeshes.length];
        mesh.visible = true;
        mesh.position.copy(impact.position);
        mesh.scale.setScalar(impact.radius);
        (mesh.material as THREE.ShaderMaterial).uniforms.uProgress.value = progress;
      }
      // Hide unused impact meshes
      for (let i = impacts.length; i < impactMeshes.length; i++) {
        impactMeshes[i].visible = false;
      }

      // Update ember particles
      let anyEmberActive = false;
      for (let i = 0; i < EMBER_COUNT; i++) {
        if (!emberActive[i]) continue;
        emberAges[i] += delta;
        if (emberAges[i] > 1.2) {
          emberActive[i] = 0;
          emberPositions[i * 3 + 1] = -9999;
          continue;
        }
        anyEmberActive = true;
        emberPositions[i * 3] += emberVelocities[i].x * delta;
        emberPositions[i * 3 + 1] += emberVelocities[i].y * delta;
        emberPositions[i * 3 + 2] += emberVelocities[i].z * delta;
        // Gravity
        emberVelocities[i].y -= 6 * delta;
        // Drag
        emberVelocities[i].multiplyScalar(1 - 1.5 * delta);
      }
      (emberGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      emberMaterial.opacity = 0.9;
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
