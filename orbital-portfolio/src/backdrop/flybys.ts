import * as THREE from "three";
import type { Vec3 } from "../types.js";
import { toSRGB, batchMeshes } from "../utils.js";

function paint(color: string) {
  return new THREE.ShaderMaterial({
    vertexShader: `varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform vec3 uColor;varying vec3 vNormal;void main(){float d=dot(normalize(vNormal),normalize(vec3(-.5,.8,1.)));float band=d>.55?1.:d>.05?.72:.38;gl_FragColor=vec4(uColor*band,1.);}`,
    uniforms: {
      uColor: { value: toSRGB(new THREE.Color(color)) },
    },
  });
}
const hullPaint = paint("#b8a0cd"),
  wingPaint = paint("#c2cece"),
  darkPaint = paint("#394758");
const cockpitPaint = new THREE.MeshBasicMaterial({ color: "#7bcbd4" });
const drivePaint = new THREE.MeshBasicMaterial({ color: "#83dcea" });
const ink = new THREE.LineBasicMaterial({ color: "#080b14" });

function add(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: Vec3 = [0, 0, 0],
  rotation: Vec3 = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

// Skip edge detection on the engine glow material (drivePaint) so the
// glowing exhaust isn't outlined with hard ink edges.
function batch(group: THREE.Group) {
  return batchMeshes(group, {
    edgeMaterial: ink,
    edgeAngle: 30,
    skipEdges: (material) => material === drivePaint,
  });
}

function spaceship() {
  const group = new THREE.Group();
  add(
    group,
    new THREE.ConeGeometry(0.48, 2.8, 6),
    wingPaint,
    [0.25, 0, 0],
    [0, 0, -Math.PI / 2],
  );
  add(
    group,
    new THREE.BoxGeometry(1.6, 0.09, 2.5),
    hullPaint,
    [-0.55, -0.13, 0],
    [0, -0.2, 0],
  );
  add(
    group,
    new THREE.BoxGeometry(0.8, 0.72, 0.06),
    darkPaint,
    [-0.8, 0.3, 0],
    [0, 0, -0.2],
  );
  add(
    group,
    new THREE.SphereGeometry(0.28, 10, 6),
    cockpitPaint,
    [0.35, 0.25, 0],
  );
  add(
    group,
    new THREE.ConeGeometry(0.3, 1.35, 8),
    drivePaint,
    [-1.65, 0, 0],
    [0, 0, Math.PI / 2],
  );
  batch(group);
  group.rotation.set(0.65, 0.2, -0.12);
  group.scale.setScalar(1.55);
  group.userData.effect = "ship";
  return group;
}

function saucer() {
  const group = new THREE.Group();
  add(
    group,
    new THREE.CylinderGeometry(1.55, 1.75, 0.24, 20),
    hullPaint,
    [0, 0, 0],
  );
  add(group, new THREE.ConeGeometry(1.55, 0.35, 20), wingPaint, [0, 0.27, 0]);
  const dome = add(
    group,
    new THREE.SphereGeometry(0.74, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    cockpitPaint,
    [0, 0.34, 0],
  );
  dome.scale.y = 0.65;
  add(
    group,
    new THREE.TorusGeometry(1.63, 0.055, 6, 24),
    drivePaint,
    [0, -0.04, 0],
    [Math.PI / 2, 0, 0],
  );
  batch(group);
  group.rotation.set(0.48, 0, 0.08);
  group.scale.setScalar(1.6);
  group.userData.effect = "ufo";
  return group;
}

export interface Flybys {
  update(elapsed: number): void;
  setMotion(value: boolean): void;
  resize(): void;
}

// Fly-bys are children of the camera, not the scene, so they appear at
// consistent screen positions regardless of where the user has orbited.
export function createFlybys(scene: THREE.Scene, camera: THREE.PerspectiveCamera): Flybys {
  const fleet = new THREE.Group();
  fleet.name = "background-flybys";
  camera.add(fleet);
  scene.add(camera);
  const ship = spaceship(),
    ufo = saucer();
  fleet.add(ship, ufo);
  ship.visible = false;
  ufo.visible = false;
  const depth = 90;
  let width = 0,
    height = 0,
    enabled = true;
  const resize = () => {
    height = 2 * Math.tan((camera.fov * Math.PI) / 360) * depth;
    width = height * camera.aspect;
  };
  const update = (elapsed: number) => {
    resize();
    const shipAge = (elapsed % 37) - 2,
      shipActive = shipAge >= 0 && shipAge < 9;
    const ufoAge = (elapsed % 37) - 14,
      ufoActive = ufoAge >= 0 && ufoAge < 9;
    ship.visible = enabled && shipActive;
    ufo.visible = enabled && ufoActive;
    const sp = THREE.MathUtils.clamp(shipAge / 9, 0, 1),
      up = THREE.MathUtils.clamp(ufoAge / 9, 0, 1);
    ship.position.set(
      (-0.72 + sp * 1.44) * width,
      height * (0.32 + Math.sin(sp * Math.PI) * 0.018),
      -depth,
    );
    ufo.position.set(
      (0.72 - up * 1.44) * width,
      height * (0.28 + Math.sin(up * Math.PI) * 0.022),
      -depth,
    );
    ufo.rotation.z = 0.08 + Math.sin(elapsed * 0.65) * 0.055;
  };
  return {
    update,
    setMotion(value: boolean) {
      enabled = value;
      if (!enabled) {
        ship.visible = false;
        ufo.visible = false;
      }
    },
    resize,
  };
}
