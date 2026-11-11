import type { Vec3 } from "../types.js";

export type ComponentShape =
  | "box"
  | "cylinder"
  | "sphere"
  | "lambda"
  | "hexprism"
  | "factory";

export interface ArchComponent {
  id: string;
  label: string;
  description: string;
  shape: ComponentShape;
  color: string;
  position: Vec3;
  scale: Vec3;
  rotation?: Vec3;
  idle?: "bob" | "spin" | "pulse";
}

export interface ArchConnection {
  from: string;
  to: string;
  color: string;
  curveHeight?: number;
}

export interface ArchAnnotation {
  id: string;
  position: Vec3;
  title: string;
  text: string;
  color?: string;
}

export type UnaryOp = "INCR" | "DECR" | "ABS";
export type BinaryOp = "ADD" | "SUB" | "MULT" | "DIV";
export type DagOp = UnaryOp | BinaryOp;

export interface DagNodeConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  op?: DagOp;
  inputValue?: number;
}

export interface DagBoardConfig {
  position: Vec3;
  rotation?: Vec3;
  width: number;
  height: number;
  nodes: DagNodeConfig[];
  edges: { from: string; to: string }[];
  cycleDuration: number;
}

export interface Architecture {
  id: string;
  name: string;
  groundColor: string;
  skyColor: string;
  cameraStart: Vec3;
  cameraTarget: Vec3;
  cameraConstraints: {
    minPolarAngle: number;
    maxPolarAngle: number;
    minDistance: number;
    maxDistance: number;
    enablePan: boolean;
  };
  components: ArchComponent[];
  connections: ArchConnection[];
  annotations: ArchAnnotation[];
  dagBoard?: DagBoardConfig;
}
