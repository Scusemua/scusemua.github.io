import * as THREE from "three";

export function createAsteroidBelt(scene) {
  const count = 72;
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const material = new THREE.ShaderMaterial({
    vertexShader: `varying vec3 vNormal;varying vec3 vColor;void main(){mat4 transform=modelMatrix*instanceMatrix;vNormal=normalize(mat3(transform)*normal);vColor=instanceColor;gl_Position=projectionMatrix*viewMatrix*transform*vec4(position,1.);}`,
    fragmentShader: `varying vec3 vNormal;varying vec3 vColor;void main(){float d=dot(normalize(vNormal),normalize(vec3(-.5,.8,1.)));float shade=d>.55?1.:d>.05?.70:.36;gl_FragColor=vec4(vColor*shade,1.);}`,
  });
  const rocks = new THREE.InstancedMesh(geometry, material, count);
  rocks.name = "asteroid-belt";
  rocks.userData.effect = "asteroids";
  const object = new THREE.Object3D();
  let seed = 621;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const palette = ["#8b829f", "#b89a94", "#647c92", "#a097bd"];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + random() * 0.045,
      radius = 24 + random() * 4;
    object.position.set(
      6 + Math.cos(angle) * radius,
      (random() - 0.5) * 1.7,
      Math.sin(angle) * radius * 0.9,
    );
    const size = 0.2 + random() * 0.39;
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
      new THREE.Color(palette[i % palette.length]).convertLinearToSRGB(),
    );
  }
  rocks.instanceMatrix.needsUpdate = true;
  rocks.instanceColor.needsUpdate = true;
  scene.add(rocks);
  return {
    update(elapsed) {
      rocks.rotation.y = elapsed * 0.003;
    },
  };
}
