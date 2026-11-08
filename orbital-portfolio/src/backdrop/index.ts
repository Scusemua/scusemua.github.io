import * as THREE from "three";
import { toSRGB, seededRandom } from "../utils.js";
import { createAsteroidBelt } from "./asteroids.js";
import { createFlybys } from "./flybys.js";
import { createTransit } from "./transit.js";
import { createMeteorShower } from "./meteor-shower.js";
import type { OnImpactCallback } from "./meteor-shower.js";


export interface Backdrop {
  update(delta: number): void;
  setMotion(value: boolean): void;
  resize(width: number, height: number): void;
  triggerMeteorShower(): void;
  updateMeteorShower(delta: number): void;
  meteorShowerActive(): boolean;
}

export function addBackdrop(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  invalidate?: () => void,
  onImpact?: OnImpactCallback,
): Backdrop {
  let elapsed = 0;
  const random = seededRandom(319);
  const time = { value: 0 },
    meteorsEnabled = { value: 1 },
    aspect = { value: innerWidth / innerHeight };
  const stars: number[] = [],
    sizes: number[] = [],
    phases: number[] = [];
  for (let i = 0; i < 2600; i++) {
    const theta = random() * Math.PI * 2,
      cosine = random() * 2 - 1,
      radius = 85 + random() * 90,
      sine = Math.sqrt(1 - cosine * cosine);
    stars.push(
      radius * sine * Math.cos(theta),
      radius * cosine,
      radius * sine * Math.sin(theta),
    );
    sizes.push(0.7 + random() * 3);
    phases.push(random() * Math.PI * 2);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(stars, 3),
  );
  starGeometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizes, 1),
  );
  starGeometry.setAttribute(
    "aPhase",
    new THREE.Float32BufferAttribute(phases, 1),
  );
  const starMaterial = new THREE.ShaderMaterial({
    vertexShader: `uniform float uTime;attribute float aSize;attribute float aPhase;varying float vGlow;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(aSize*210./(-mv.z),.7,4.);vGlow=.67+.16*sin(uTime*(.6+aPhase*.05)+aPhase);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying float vGlow;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(.73,.81,.89,(1.-smoothstep(.03,.5,d))*vGlow);}`,
    uniforms: { uTime: time },
    transparent: true,
    depthWrite: false,
  });
  scene.add(new THREE.Points(starGeometry, starMaterial));

  const dust: number[] = [],
    dustSizes: number[] = [],
    dustColors: number[] = [];
  const palette = ["#ac63ed", "#dd73ba", "#638cda", "#51a3b6", "#c792df"];
  for (let i = 0; i < 1150; i++) {
    const x = (random() - 0.5) * 210,
      spread = (random() + random() + random() - 1.5) * 16;
    dust.push(x, -8 + x * 0.2 + spread, -95 + (random() - 0.5) * 35);
    dustSizes.push(2 + random() * 13);
    const color = toSRGB(new THREE.Color(palette[i % palette.length]));
    dustColors.push(color.r, color.g, color.b);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(dust, 3),
  );
  dustGeometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(dustSizes, 1),
  );
  dustGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(dustColors, 3),
  );
  // Additive blending lets overlapping dust particles brighten into a
  // soft nebula glow rather than occluding each other.
  const dustCloud = new THREE.Points(
    dustGeometry,
    new THREE.ShaderMaterial({
      vertexShader: `attribute float aSize;attribute vec3 color;varying vec3 vColor;void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(aSize*240./(-mv.z),1.,24.);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `varying vec3 vColor;void main(){float d=length(gl_PointCoord-.5);float glow=pow(1.-smoothstep(0.,.5,d),2.);gl_FragColor=vec4(vColor,glow*.32);}`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(dustCloud);

  const linePositions: number[] = [],
    constellationStars: number[] = [];
  const paths: number[][][] = [
    [
      [-58, 38, -100],
      [-47, 44, -100],
      [-39, 35, -100],
      [-29, 43, -100],
      [-17, 38, -100],
      [-24, 26, -100],
      [-39, 35, -100],
    ],
    [
      [36, 40, -105],
      [44, 48, -105],
      [59, 44, -105],
      [64, 33, -105],
      [52, 27, -105],
      [44, 35, -105],
      [44, 48, -105],
    ],
    [
      [-77, 5, -110],
      [-68, 12, -110],
      [-59, 7, -110],
      [-63, -1, -110],
      [-77, 5, -110],
    ],
  ];
  for (const path of paths) {
    for (const position of path) position[1] -= 55;
    for (let i = 0; i < path.length; i++) {
      constellationStars.push(...path[i]);
      if (i) linePositions.push(...path[i - 1], ...path[i]);
    }
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3),
  );
  scene.add(
    new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: "#6a98bb",
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
      }),
    ),
  );
  const beaconGeometry = new THREE.BufferGeometry();
  beaconGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(constellationStars, 3),
  );
  scene.add(
    new THREE.Points(
      beaconGeometry,
      new THREE.PointsMaterial({
        color: "#afd5df",
        size: 0.3,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    ),
  );

  const meteor = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      vertexShader: `uniform float uTime;uniform float uAspect;uniform float uEnabled;varying vec2 vUv;varying float vLife;void main(){vUv=uv;float cycle=floor(uTime/13.);float age=mod(uTime,13.)-4.;vLife=step(0.,age)*step(age,1.5)*uEnabled;float p=clamp(age/1.5,0.,1.);vec2 direction=normalize(vec2(.85,-.5));vec2 across=vec2(-direction.y,direction.x);vec2 start=vec2(-.65+mod(cycle,3.)*.42,.74-mod(cycle,2.)*.2);vec2 point=start+direction*(p*.95+(uv.x-1.)*.38)+across*((uv.y-.5)*.013);point.x/=uAspect;gl_Position=vec4(point*vLife,.99999,1.);}`,
      fragmentShader: `varying vec2 vUv;varying float vLife;void main(){float edge=1.-smoothstep(.05,.5,abs(vUv.y-.5));float tail=pow(vUv.x,2.);float head=smoothstep(.88,1.,vUv.x);gl_FragColor=vec4(mix(vec3(.35,.68,.83),vec3(.95,.91,.71),head),edge*tail*vLife*.85);}`,
      uniforms: { uTime: time, uAspect: aspect, uEnabled: meteorsEnabled },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
    }),
  );
  meteor.frustumCulled = false;
  meteor.raycast = () => {};
  scene.add(meteor);

  // Orbit rings: centered at x=6 (the solar system offset) with 0.9 z-scale
  // for a slight elliptical appearance when viewed from the default camera angle.
  const orbitPositions: number[] = [];
  for (const radius of [10.5, 16, 25])
    for (let i = 0; i < 144; i++) {
      for (const step of [i, i + 1]) {
        const angle = (step / 144) * Math.PI * 2;
        orbitPositions.push(
          6 + Math.cos(angle) * radius,
          -0.1,
          Math.sin(angle) * radius * 0.9,
        );
      }
    }
  const orbits = new THREE.BufferGeometry();
  orbits.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(orbitPositions, 3),
  );
  scene.add(
    new THREE.LineSegments(
      orbits,
      new THREE.LineBasicMaterial({
        color: "#526572",
        transparent: true,
        opacity: 0.24,
      }),
    ),
  );
  const asteroids = createAsteroidBelt(scene),
    flybys = createFlybys(scene, camera),
    transit = createTransit(scene),
    meteorShower = createMeteorShower(scene, invalidate ?? (() => {}), onImpact);
  return {
    update(delta: number) {
      elapsed += delta;
      time.value = elapsed;
      dustCloud.rotation.z = Math.sin(elapsed * 0.025) * 0.009;
      asteroids.update(elapsed);
      flybys.update(elapsed);
      transit.update(elapsed);
      meteorShower.update(delta);
    },
    setMotion(value: boolean) {
      meteorsEnabled.value = value ? 1 : 0;
      flybys.setMotion(value);
    },
    resize(width: number, height: number) {
      aspect.value = width / height;
      flybys.resize();
    },
    triggerMeteorShower() {
      meteorShower.trigger();
    },
    updateMeteorShower(delta: number) {
      meteorShower.update(delta);
    },
    meteorShowerActive() {
      return meteorShower.active();
    },
  };
}
