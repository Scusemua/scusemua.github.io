import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import textureData from "../generated-textures.js";
import type { Destination, Vec3 } from "../types.js";
import { batchMeshes } from "../utils.js";

export interface LodEntry {
  root: THREE.Group;
  globe: THREE.Mesh;
  ink: THREE.Mesh;
  radius: number;
  level: number;
  moon: boolean;
}

export interface LambdaOrbitData {
  wrapper: THREE.Group;
  angle: number;
  distance: number;
  speed: number;
  tumble: number;
}

export interface MoonOrbitData {
  moon: THREE.Group;
  angle: number;
  distance: number;
  speed: number;
}

export interface WorldUserData {
  destination?: string;
  globe?: THREE.Mesh;
  ink?: THREE.Mesh;
  detail?: LodEntry[];
  lambdas?: LambdaOrbitData[];
  moons?: MoonOrbitData[];
  moon?: boolean;
  effect?: string;
}

const sphereLevels: THREE.SphereGeometry[] = [
  new THREE.SphereGeometry(1, 24, 16),
  new THREE.SphereGeometry(1, 32, 20),
  new THREE.SphereGeometry(1, 40, 28),
];
const moonLevels: THREE.SphereGeometry[] = [
  new THREE.SphereGeometry(1, 12, 8),
  new THREE.SphereGeometry(1, 16, 12),
];
const sphere = sphereLevels[2],
  moonSphere = moonLevels[1];
const lodPosition = new THREE.Vector3();
const vertex = `
varying vec3 vNormal; varying vec3 vWorld; varying vec2 vUv;
void main(){vNormal=normalize(mat3(modelMatrix)*normal);vWorld=(modelMatrix*vec4(position,1.)).xyz;vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
const fragment = `
uniform vec3 uColor; uniform sampler2D uMap; uniform float uTexture;
varying vec3 vNormal; varying vec3 vWorld; varying vec2 vUv;
void main(){
  vec3 n=normalize(vNormal),light=normalize(vec3(-.7,.9,1.));
  float diffuse=dot(n,light);
  float level=diffuse>.7?1.13:diffuse>.28?.89:diffuse>-.06?.62:.30;
  vec3 color=uColor;
  if(uTexture>.5) color=texture2D(uMap,vUv).rgb;
  vec3 shadow=vec3(.56,.68,.89);
  color*=level;
  if(diffuse<.28)color*=shadow;
  float hatch=step(.86,fract((gl_FragCoord.x+gl_FragCoord.y)*.115));
  if(diffuse<-.06)color*=1.-hatch*.21;
  float rim=abs(dot(n,normalize(cameraPosition-vWorld)));
  if(rim<.12)color*=.36;
  gl_FragColor=vec4(color,1.);
}
`;
function toon(color: string, map: THREE.Texture | null = null): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uMap: { value: map },
      uTexture: { value: map ? 1 : 0 },
    },
  });
}
const outlineMaterial = new THREE.ShaderMaterial({
  vertexShader: `uniform vec2 uViewport;uniform float uWidth;void main(){vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);vec3 n=normalMatrix*normal;vec2 direction=(projectionMatrix*vec4(n,0.)).xy;float lengthN=length(direction);p.xy+=(lengthN>.0001?direction/lengthN:vec2(0.))*uWidth*2./uViewport*p.w;gl_Position=p;}`,
  fragmentShader: `void main(){gl_FragColor=vec4(.012,.014,.021,1.);}`,
  uniforms: {
    uViewport: { value: new THREE.Vector2(innerWidth, innerHeight) },
    uWidth: { value: 3 },
  },
  side: THREE.BackSide,
});
function outline(geometry: THREE.BufferGeometry, parent: THREE.Group, scale = 1): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, outlineMaterial);
  mesh.scale.setScalar(scale);
  mesh.raycast = () => {};
  parent.add(mesh);
  return mesh;
}
export function resizeInk(width: number, height: number): void {
  (outlineMaterial.uniforms.uViewport.value as THREE.Vector2).set(width, height);
}
const metal = toon("#c7ddd6"),
  darkMetal = toon("#384963"),
  gold = toon("#e9b956");
const edgeMaterial = new THREE.LineBasicMaterial({ color: "#10131d" });

function solarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#417ca8";
  ctx.fillRect(0, 0, 128, 96);
  ctx.fillStyle = "#253347";
  for (let x = 0; x <= 128; x += 16) ctx.fillRect(x, 0, 2, 96);
  for (let y = 0; y <= 96; y += 16) ctx.fillRect(0, y, 128, 2);
  ctx.fillStyle = "#a6c7ca";
  ctx.fillRect(0, 0, 128, 3);
  ctx.fillRect(0, 93, 128, 3);
  ctx.fillRect(0, 0, 3, 96);
  ctx.fillRect(125, 0, 3, 96);
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}
const panelMaterial = toon("#ffffff", solarTexture());
function addMesh(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: Vec3 = [0, 0, 0],
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}
function box(group: THREE.Group, size: Vec3, position: Vec3, material: THREE.Material): THREE.Mesh {
  return addMesh(group, new THREE.BoxGeometry(...size), material, position);
}
function solarArray(group: THREE.Group, x: number, width = 1.55, depth = 1.1): void {
  box(group, [width, 0.045, depth], [x, 0.05, 0], panelMaterial);
}
function batchCraft(group: THREE.Group): THREE.Group {
  return batchMeshes(group, {
    outline: { material: outlineMaterial },
    edgeMaterial,
  });
}
function satellite(): THREE.Group {
  const group = new THREE.Group();
  box(group, [0.72, 0.85, 0.72], [0, 0, 0], gold);
  box(group, [3.8, 0.06, 0.06], [0, 0, 0], metal);
  solarArray(group, -1.45);
  solarArray(group, 1.45);
  addMesh(
    group,
    new THREE.SphereGeometry(0.49, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42),
    metal,
    [0, 0.62, 0],
  );
  addMesh(
    group,
    new THREE.CylinderGeometry(0.025, 0.025, 0.55, 6),
    metal,
    [0, 1, 0],
  );
  batchCraft(group);
  group.rotation.set(0.4, -0.5, 0.25);
  return group;
}
function station(): THREE.Group {
  const group = new THREE.Group();
  const hub = addMesh(
    group,
    new THREE.CylinderGeometry(0.3, 0.3, 2.3, 12),
    metal,
  );
  hub.rotation.x = Math.PI / 2;
  const ring = addMesh(
    group,
    new THREE.TorusGeometry(0.92, 0.085, 8, 40),
    gold,
  );
  ring.rotation.x = 0.6;
  for (let i = 0; i < 6; i++) {
    const spoke = addMesh(
      group,
      new THREE.CylinderGeometry(0.03, 0.03, 1.7, 6),
      darkMetal,
    );
    spoke.rotation.z = (i * Math.PI) / 3;
    spoke.rotation.x = 0.6;
  }
  box(group, [4.5, 0.07, 0.07], [0, 0, -0.6], metal);
  solarArray(group, -1.9, 1.8, 1.3);
  solarArray(group, 1.9, 1.8, 1.3);
  batchCraft(group);
  group.rotation.set(0.2, 0.4, -0.3);
  return group;
}
function planet(destination: Destination, invalidate: () => void): THREE.Group {
  const group = new THREE.Group();
  const ud = group.userData as WorldUserData;
  const map = new THREE.TextureLoader().load(
    textureData[destination.type!],
    invalidate,
    undefined,
    () => {},
  );
  map.colorSpace = THREE.NoColorSpace;
  map.anisotropy = 1;
  const globe = new THREE.Mesh(sphere, toon("#ffffff", map));
  globe.scale.setScalar(destination.radius);
  globe.rotation.z = destination.id === "atlas" ? 0.15 : -0.2;
  group.add(globe);
  const ink = outline(sphere, group, destination.radius);
  ink.rotation.copy(globe.rotation);
  ud.globe = globe;
  ud.ink = ink;
  ud.detail = [
    {
      root: group,
      globe,
      ink,
      radius: destination.radius,
      level: 2,
      moon: false,
    },
  ];
  if (destination.rings) {
    const config = destination.rings;
    const ringMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying float vR;void main(){vR=length(position.xy);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform float uInner;uniform float uOuter;uniform float uGap;uniform vec3 uColor;uniform vec3 uDark;varying float vR;void main(){float r=(vR-uInner)/(uOuter-uInner);if(abs(r-uGap)<.032)discard;float band=mod(floor(r*24.),4.);vec3 c=band<1.?uDark*.5:band<2.?uColor:uDark;if(r<.025||r>.975)c=vec3(.02,.02,.03);gl_FragColor=vec4(c,1.);}`,
      uniforms: {
        uInner: { value: config.inner },
        uOuter: { value: config.outer },
        uGap: { value: config.gap },
        uColor: { value: new THREE.Color(config.color) },
        uDark: { value: new THREE.Color(config.dark) },
      },
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(config.inner, config.outer, 96),
      ringMaterial,
    );
    ring.scale.setScalar(destination.radius);
    ring.rotation.set(...config.tilt);
    group.add(ring);
  }
  ud.lambdas = [];
  if (destination.lambdas) {
    const svgData = `<path d="M7.983 8.37c-.053.073-.098.133-.141.194L5.775 11.5c-.64.91-1.282 1.82-1.924 2.73a.128.128 0 01-.092.051c-.906-.007-1.813-.017-2.719-.028-.01 0-.02-.003-.04-.006a.455.455 0 01.025-.053 13977.496 13977.496 0 015.446-8.146c.092-.138.188-.273.275-.413a.165.165 0 00.018-.124c-.167-.515-.338-1.03-.508-1.543-.073-.22-.15-.44-.218-.66-.022-.072-.059-.094-.134-.093-.57.002-1.136.001-1.704.001-.108 0-.108 0-.108-.103 0-.674 0-1.347-.002-2.021 0-.075.026-.092.099-.092 1.143.002 2.286.002 3.43 0a.113.113 0 01.076.017.107.107 0 01.045.061 18266.184 18266.184 0 003.92 9.51c.218.53.438 1.059.654 1.59.026.064.053.076.12.056.6-.178 1.2-.352 1.8-.531.075-.023.102-.008.126.064.204.62.412 1.239.62 1.858l.02.073c-.043.015-.083.032-.124.043l-4.085 1.25c-.065.02-.085 0-.106-.054l-1.25-3.048-1.226-2.984-.183-.449c-.01-.026-.023-.048-.043-.087z"/>`;
    const loader = new SVGLoader();
    const svgDoc = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${svgData}</svg>`);
    const lambdaShapes = SVGLoader.createShapes(svgDoc.paths[0]);
    const lambdaGeometry = new THREE.ExtrudeGeometry(lambdaShapes, { depth: 3.0, bevelEnabled: false, curveSegments: 4 });
    lambdaGeometry.center();
    lambdaGeometry.computeVertexNormals();
    for (const config of destination.lambdas) {
      const pivot = new THREE.Group();
      pivot.rotation.z = config.tilt;
      group.add(pivot);
      const wrapper = new THREE.Group();
      pivot.add(wrapper);
      const lambdaGroup = new THREE.Group();
      const s = (config.scale ?? 0.5) * 0.13;
      const mat = toon(config.color);
      const inkMat = new THREE.MeshBasicMaterial({ color: 0x0a0b10, side: THREE.BackSide });
      const lambdaInk = new THREE.Mesh(lambdaGeometry, inkMat);
      lambdaInk.scale.setScalar(s * 1.12);
      lambdaInk.raycast = () => {};
      lambdaGroup.add(lambdaInk);
      const mesh = new THREE.Mesh(lambdaGeometry, mat);
      mesh.scale.setScalar(s);
      lambdaGroup.add(mesh);
      wrapper.add(lambdaGroup);
      const data: LambdaOrbitData = { wrapper, angle: config.angle, distance: config.distance, speed: config.speed, tumble: config.tumble ?? 0.4 };
      wrapper.position.set(Math.cos(data.angle) * data.distance, 0, Math.sin(data.angle) * data.distance);
      ud.lambdas!.push(data);
    }
  }
  ud.moons = [];
  for (const config of destination.moons ?? []) {
    const pivot = new THREE.Group();
    pivot.rotation.z = config.tilt;
    group.add(pivot);
    const moonGroup = new THREE.Group();
    pivot.add(moonGroup);
    const moonGlobe = new THREE.Mesh(moonSphere, toon(config.color));
    moonGlobe.scale.setScalar(config.radius);
    moonGroup.add(moonGlobe);
    const moonInk = outline(moonSphere, moonGroup, config.radius);
    ud.detail!.push({
      root: moonGroup,
      globe: moonGlobe,
      ink: moonInk,
      radius: config.radius,
      level: 1,
      moon: true,
    });
    const data: MoonOrbitData = {
      moon: moonGroup,
      angle: config.angle,
      distance: config.distance,
      speed: config.speed,
    };
    moonGroup.position.set(
      Math.cos(data.angle) * data.distance,
      0,
      Math.sin(data.angle) * data.distance,
    );
    (moonGroup.userData as WorldUserData).moon = true;
    ud.moons!.push(data);
  }
  return group;
}
export function createWorld(destination: Destination, invalidate: () => void): THREE.Group {
  const group =
    destination.kind === "planet"
      ? planet(destination, invalidate)
      : destination.kind === "satellite"
        ? satellite()
        : station();
  group.position.set(...destination.position);
  (group.userData as WorldUserData).destination = destination.id;
  return group;
}
export function updateWorldDetail(group: THREE.Group, camera: THREE.PerspectiveCamera, height: number): void {
  const ud = group.userData as WorldUserData;
  if (!ud.detail) return;
  const focal = height / (2 * Math.tan((camera.fov * Math.PI) / 360));
  group.updateWorldMatrix(true, true);
  for (const item of ud.detail) {
    item.root.getWorldPosition(lodPosition);
    const pixels =
      (item.radius / Math.max(0.1, camera.position.distanceTo(lodPosition))) *
      focal;
    const thresholds = item.moon ? [18] : [45, 75];
    let level = item.level;
    while (level < thresholds.length && pixels > thresholds[level] * 1.08)
      level++;
    while (level > 0 && pixels < thresholds[level - 1] * 0.92) level--;
    if (level === item.level) continue;
    item.level = level;
    const geometry = (item.moon ? moonLevels : sphereLevels)[level];
    item.globe.geometry = geometry;
    item.ink.geometry = geometry;
  }
}
export function disposeDetailGeometry(): void {
  for (const geometry of [...sphereLevels, ...moonLevels]) geometry.dispose();
}
export function rotateWorld(group: THREE.Group, delta: number): void {
  const ud = group.userData as WorldUserData;
  if (ud.globe) {
    ud.globe.rotation.y += delta * 0.025;
    ud.ink!.rotation.y = ud.globe.rotation.y;
  } else group.rotation.y += delta * 0.045;
  for (const data of ud.lambdas ?? []) {
    data.angle += delta * data.speed;
    data.wrapper.position.set(Math.cos(data.angle) * data.distance, 0, Math.sin(data.angle) * data.distance);
    data.wrapper.rotation.x += delta * data.tumble;
    data.wrapper.rotation.y += delta * data.tumble * 1.3;
  }
  for (const data of ud.moons ?? []) {
    data.angle += delta * data.speed;
    data.moon.position.set(
      Math.cos(data.angle) * data.distance,
      0,
      Math.sin(data.angle) * data.distance,
    );
    data.moon.rotation.y += delta * 0.05;
  }
}
