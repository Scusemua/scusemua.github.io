import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export function toSRGB(color: THREE.Color): THREE.Color {
  return (color as any).convertLinearToSRGB();
}

export interface BatchOptions {
  outline?: {
    material: THREE.Material;
    scale?: number;
  };
  edgeMaterial: THREE.Material;
  edgeAngle?: number;
  skipEdges?: (material: THREE.Material) => boolean;
}

export function batchMeshes(group: THREE.Group, options: BatchOptions): THREE.Group {
  group.updateMatrixWorld(true);
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
  for (const child of [...group.children] as THREE.Mesh[]) {
    const geometry = child.geometry.clone().applyMatrix4(child.matrix);
    const mat = child.material as THREE.Material;
    if (!buckets.has(mat)) buckets.set(mat, []);
    buckets.get(mat)!.push(geometry);
    group.remove(child);
    child.geometry.dispose();
  }
  const inkParts: THREE.BufferGeometry[] = [];
  const edgeParts: THREE.EdgesGeometry[] = [];
  const angle = options.edgeAngle ?? 35;
  for (const [material, parts] of buckets) {
    const geometry = mergeGeometries(parts, false);
    parts.forEach((part) => part.dispose());
    group.add(new THREE.Mesh(geometry, material));
    if (options.outline) inkParts.push(geometry);
    if (!options.skipEdges?.(material))
      edgeParts.push(new THREE.EdgesGeometry(geometry, angle));
  }
  if (options.outline && inkParts.length) {
    const inkMesh = new THREE.Mesh(
      mergeGeometries(inkParts, false),
      options.outline.material,
    );
    if (options.outline.scale) inkMesh.scale.setScalar(options.outline.scale);
    inkMesh.raycast = () => {};
    group.add(inkMesh);
  }
  if (edgeParts.length) {
    const edges = new THREE.LineSegments(
      mergeGeometries(edgeParts, false),
      options.edgeMaterial,
    );
    edges.raycast = () => {};
    group.add(edges);
    edgeParts.forEach((geometry) => geometry.dispose());
  }
  return group;
}
