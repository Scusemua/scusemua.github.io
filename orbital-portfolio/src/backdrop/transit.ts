import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { destinations } from "../data/content.js";
import type { Destination, Vec3 } from "../types.js";
import { toSRGB } from "../utils.js";

interface TransitRouteConfig {
  from: string;
  to: string;
  bend: number;
  rise: number;
  color: string;
  duration: number;
  capacity: number;
  wait: number;
}

interface LaneTable {
  positions: THREE.Vector3[];
  rotations: THREE.Quaternion[];
}

interface TransitRoute extends TransitRouteConfig {
  curve: THREE.CubicBezierCurve3;
  tables: Map<number, LaneTable>;
}

interface VehicleType {
  id: string;
  speed: number;
  scale: number;
  color: string;
}

interface Vehicle {
  id: number;
  route: TransitRoute;
  lane: number;
  type: number;
  duration: number;
  period: number;
  phase: number;
  batchIndex: number;
  tint?: THREE.Color;
}

interface TrafficTarget {
  active: boolean;
  progress: number;
  duration: number;
  delay: number;
}

interface TransitBatch {
  type: string;
  body: THREE.InstancedMesh;
  ink: THREE.InstancedMesh;
  members: Vehicle[];
  currentIds: Int32Array;
}

export interface Transit {
  routes: TransitRoute[];
  vehicles: Vehicle[];
  batches: TransitBatch[];
  update(elapsed: number): void;
  carCount: number;
  group: THREE.Group;
}

const transitRoutes: TransitRouteConfig[] = [
  {
    from: "atlas",
    to: "nova",
    bend: 1.3,
    rise: 1.4,
    color: "#81bfc7",
    duration: 18,
    capacity: 5,
    wait: 7,
  },
  {
    from: "atlas",
    to: "ember",
    bend: -1.2,
    rise: 1,
    color: "#dfb982",
    duration: 25,
    capacity: 3,
    wait: 13,
  },
  {
    from: "nova",
    to: "aurora",
    bend: 1.8,
    rise: 1.2,
    color: "#ada4dd",
    duration: 29,
    capacity: 2,
    wait: 22,
  },
  {
    from: "atlas",
    to: "solstice",
    bend: 0.8,
    rise: 1.3,
    color: "#dfb982",
    duration: 22,
    capacity: 4,
    wait: 10,
  },
  {
    from: "ember",
    to: "verdant",
    bend: 1,
    rise: 1.5,
    color: "#8dbdae",
    duration: 24,
    capacity: 3,
    wait: 16,
  },
];

const vehicleTypes: VehicleType[] = [
  { id: "shuttle", speed: 1, scale: 1, color: "#bfc9d4" },
  { id: "freighter", speed: 1.34, scale: 1.04, color: "#d6bd9a" },
  { id: "speeder", speed: 0.66, scale: 0.9, color: "#a8cfdd" },
];

const laneWidth = 0.22,
  samples = 128;
const up = new THREE.Vector3(0, 1, 0);

function worldExtent(world: Destination) {
  return world.radius * (world.rings?.outer || 1);
}

function hash(id: number, cycle: number) {
  let n = Math.imul(id + 17, 374761393) ^ Math.imul(cycle + 31, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function buildTransitRoutes(): TransitRoute[] {
  return transitRoutes.map((config) => {
    const from = destinations.find((world) => world.id === config.from)!;
    const to = destinations.find((world) => world.id === config.to)!;
    const a = new THREE.Vector3(...from.position),
      b = new THREE.Vector3(...to.position);
    const direction = b.clone().sub(a).normalize();
    const sideways = new THREE.Vector3()
      .crossVectors(up, direction)
      .normalize();
    const start = a
      .clone()
      .addScaledVector(direction, worldExtent(from) + 0.85);
    const end = b.clone().addScaledVector(direction, -worldExtent(to) - 0.85);
    const p1 = start
      .clone()
      .lerp(end, 0.32)
      .addScaledVector(sideways, config.bend);
    p1.y += config.rise;
    const p2 = start
      .clone()
      .lerp(end, 0.68)
      .addScaledVector(sideways, config.bend);
    p2.y += config.rise;
    const curve = new THREE.CubicBezierCurve3(start, p1, p2, end);
    curve.arcLengthDivisions = 160;
    curve.updateArcLengths();
    const tables = new Map<number, LaneTable>();
    for (const lane of [-1, 1]) {
      const positions: THREE.Vector3[] = [];
      const rotations: THREE.Quaternion[] = [];
      const point = new THREE.Vector3(),
        tangent = new THREE.Vector3(),
        side = new THREE.Vector3(),
        vertical = new THREE.Vector3(),
        basis = new THREE.Matrix4();
      for (let i = 0; i <= samples; i++) {
        const fraction = lane === 1 ? i / samples : 1 - i / samples;
        curve.getPointAt(fraction, point);
        curve.getTangentAt(fraction, tangent);
        side.crossVectors(up, tangent).normalize();
        positions.push(
          point
            .clone()
            .addScaledVector(side, lane * laneWidth)
            .add(new THREE.Vector3(0, 0.08, 0)),
        );
        tangent.multiplyScalar(lane);
        side.crossVectors(up, tangent).normalize();
        vertical.crossVectors(tangent, side).normalize();
        basis.makeBasis(side, vertical, tangent);
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(basis);
        if (i && quaternion.dot(rotations[i - 1]) < 0)
          quaternion.set(
            -quaternion.x,
            -quaternion.y,
            -quaternion.z,
            -quaternion.w,
          );
        rotations.push(quaternion);
      }
      tables.set(lane, { positions, rotations });
    }
    return { ...config, curve, tables };
  });
}

function carGeometry(type: VehicleType) {
  const parts: THREE.BufferGeometry[] = [];
  const box = (size: Vec3, position: Vec3, color: string) => {
    const geometry = new THREE.BoxGeometry(...size);
    geometry.translate(...position);
    const rgb = toSRGB(new THREE.Color(color));
    const colors: number[] = [];
    for (let i = 0; i < geometry.attributes.position.count; i++)
      colors.push(rgb.r, rgb.g, rgb.b);
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    parts.push(geometry);
  };
  if (type.id === "freighter") {
    box([0.34, 0.2, 0.68], [0, 0.02, -0.04], type.color);
    box([0.26, 0.14, 0.23], [0, 0.17, 0.15], "#93b6c2");
    box([0.38, 0.045, 0.43], [0, -0.055, -0.1], "#7a8296");
  } else if (type.id === "speeder") {
    box([0.16, 0.075, 0.57], [0, 0, 0], type.color);
    box([0.12, 0.08, 0.2], [0, 0.06, 0.03], "#6cbbcf");
    box([0.38, 0.035, 0.15], [0, -0.02, -0.18], "#a78cbb");
  } else {
    box([0.27, 0.12, 0.52], [0, 0, 0], type.color);
    box([0.19, 0.1, 0.23], [0, 0.1, -0.025], "#6dafc4");
    box([0.34, 0.045, 0.18], [0, -0.035, -0.16], "#7b819a");
  }
  const nose = type.id === "freighter" ? 0.315 : 0.27;
  box([0.055, 0.05, 0.06], [-0.087, 0.01, nose], "#fff1b4");
  box([0.055, 0.05, 0.06], [0.087, 0.01, nose], "#fff1b4");
  box(
    [0.13, 0.045, 0.14],
    [0, -0.015, type.id === "freighter" ? -0.43 : -0.3],
    "#9edef2",
  );
  const geometry = mergeGeometries(parts, false);
  parts.forEach((part) => part.dispose());
  return geometry;
}

function trafficState(vehicle: Vehicle, elapsed: number, target: Partial<TrafficTarget> = {}): TrafficTarget {
  const shifted = elapsed + vehicle.phase;
  const cycle = Math.floor(shifted / vehicle.period),
    clock = shifted - cycle * vehicle.period;
  const duration = vehicle.duration * (0.86 + 0.25 * hash(vehicle.id, cycle));
  const delay =
    (vehicle.period - duration) * (0.1 + 0.85 * hash(vehicle.id + 73, cycle));
  const progress = (clock - delay) / duration;
  target.active = progress >= 0 && progress <= 1;
  target.progress = THREE.MathUtils.clamp(progress, 0, 1);
  target.duration = duration;
  target.delay = delay;
  return target as TrafficTarget;
}

export function createTransit(scene: THREE.Scene): Transit {
  const routes = buildTransitRoutes();
  const highway = new THREE.Group();
  highway.name = "interplanetary-highways";
  scene.add(highway);
  const positions: number[] = [];
  const colors: number[] = [];
  const point = new THREE.Vector3(),
    tangent = new THREE.Vector3(),
    side = new THREE.Vector3();
  for (const route of routes) {
    const color = toSRGB(new THREE.Color(route.color));
    for (const lane of [-1, 1])
      for (let i = 0; i < 72; i++) {
        if (i % 4 === 3) continue;
        for (const fraction of [i / 72, (i + 0.7) / 72]) {
          route.curve.getPointAt(fraction, point);
          route.curve.getTangentAt(fraction, tangent);
          side.crossVectors(up, tangent).normalize();
          point.addScaledVector(side, lane * laneWidth);
          positions.push(point.x, point.y, point.z);
          colors.push(color.r, color.g, color.b);
        }
      }
  }
  const laneGeometry = new THREE.BufferGeometry();
  laneGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  laneGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );
  const lanes = new THREE.LineSegments(
    laneGeometry,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    }),
  );
  lanes.name = "transit-lanes";
  highway.add(lanes);
  const vehicles: Vehicle[] = [];
  for (let r = 0; r < routes.length; r++)
    for (const lane of [-1, 1])
      for (let i = 0; i < routes[r].capacity; i++) {
        const id = vehicles.length,
          type = (i + r + (lane === 1 ? 1 : 0)) % vehicleTypes.length;
        const duration =
          routes[r].duration *
          vehicleTypes[type].speed *
          (0.9 + hash(id, 0) * 0.23);
        const period = duration * 1.14 + routes[r].wait;
        vehicles.push({
          id,
          route: routes[r],
          lane,
          type,
          duration,
          period,
          phase:
            period * ((i + 0.2 + hash(id + 9, 0) * 0.3) / routes[r].capacity),
          batchIndex: 0,
        });
      }
  const bodyMaterial = new THREE.ShaderMaterial({
    vertexShader: `varying vec3 vColor;varying vec3 vNormal;void main(){vColor=color*instanceColor;vNormal=normalize(mat3(modelMatrix*instanceMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*modelMatrix*instanceMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec3 vColor;varying vec3 vNormal;void main(){float light=dot(normalize(vNormal),normalize(vec3(-.5,.8,1.)));float shade=light>.5?1.:light>0.?.78:.48;gl_FragColor=vec4(vColor*shade,1.);}`,
    vertexColors: true,
  });
  const inkMaterial = new THREE.ShaderMaterial({
    vertexShader: `void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*instanceMatrix*vec4(position+normal*.025,1.);}`,
    fragmentShader: `void main(){gl_FragColor=vec4(.015,.02,.035,1.);}`,
    side: THREE.BackSide,
  });
  const bounds = new THREE.Box3();
  for (const route of routes)
    for (const table of route.tables.values())
      for (const pt of table.positions) bounds.expandByPoint(pt);
  bounds.expandByScalar(0.85);
  const sphere = bounds.getBoundingSphere(new THREE.Sphere());
  const palette = ["#d6bd9a", "#a8cfdd", "#c2add9", "#a5cdb6", "#d6a8b3"];
  const batches: TransitBatch[] = vehicleTypes.map((type, index) => {
    const members = vehicles.filter((vehicle) => vehicle.type === index),
      geometry = carGeometry(type);
    const body = new THREE.InstancedMesh(
      geometry,
      bodyMaterial,
      members.length,
    );
    body.name = `space-cars-${type.id}`;
    body.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    body.boundingSphere = sphere.clone();
    body.raycast = () => {};
    const ink = new THREE.InstancedMesh(geometry, inkMaterial, members.length);
    ink.name = `space-car-ink-${type.id}`;
    ink.instanceMatrix = body.instanceMatrix;
    ink.boundingSphere = sphere.clone();
    ink.raycast = () => {};
    members.forEach((vehicle, i) => {
      vehicle.batchIndex = i;
      vehicle.tint = toSRGB(new THREE.Color(
        palette[vehicle.id % palette.length],
      ));
      body.setColorAt(i, vehicle.tint);
    });
    const currentIds = new Int32Array(members.length);
    currentIds.fill(-1);
    highway.add(body, ink);
    return { type: type.id, body, ink, members, currentIds };
  });
  const object = new THREE.Object3D();
  const state: Partial<TrafficTarget> = {};
  const update = (elapsed: number) => {
    for (const batch of batches) {
      let activeCount = 0,
        colorDirty = false;
      for (const vehicle of batch.members) {
        trafficState(vehicle, elapsed, state);
        if (!state.active) continue;
        const table = vehicle.route.tables.get(vehicle.lane)!;
        const sample = state.progress! * samples,
          index = Math.min(samples - 1, Math.floor(sample)),
          blend = sample - index;
        object.position.lerpVectors(
          table.positions[index],
          table.positions[index + 1],
          blend,
        );
        object.quaternion.slerpQuaternions(
          table.rotations[index],
          table.rotations[index + 1],
          blend,
        );
        const fade = Math.min(
          1,
          state.progress! / 0.045,
          (1 - state.progress!) / 0.045,
        );
        object.scale.setScalar(
          Math.max(0.001, fade * vehicleTypes[vehicle.type].scale),
        );
        object.updateMatrix();
        batch.body.setMatrixAt(activeCount, object.matrix);
        if (batch.currentIds[activeCount] !== vehicle.id) {
          batch.currentIds[activeCount] = vehicle.id;
          batch.body.setColorAt(activeCount, vehicle.tint!);
          colorDirty = true;
        }
        activeCount++;
      }
      batch.body.count = activeCount;
      batch.ink.count = activeCount;
      batch.body.visible = activeCount > 0;
      batch.ink.visible = activeCount > 0;
      if (activeCount) {
        batch.body.instanceMatrix.clearUpdateRanges();
        batch.body.instanceMatrix.addUpdateRange(0, activeCount * 16);
        batch.body.instanceMatrix.needsUpdate = true;
      }
      if (colorDirty) {
        batch.body.instanceColor!.clearUpdateRanges();
        batch.body.instanceColor!.needsUpdate = true;
      }
    }
  };
  update(0);
  return {
    routes,
    vehicles,
    batches,
    update,
    carCount: vehicles.length,
    group: highway,
  };
}
