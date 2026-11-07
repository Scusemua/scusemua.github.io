export type Vec3 = [number, number, number];

export interface RingConfig {
  inner: number;
  outer: number;
  color: string;
  dark: string;
  tilt: Vec3;
  gap: number;
}

export interface MoonConfig {
  radius: number;
  distance: number;
  color: string;
  angle: number;
  tilt: number;
  speed: number;
}

export interface LambdaConfig {
  distance: number;
  angle: number;
  tilt: number;
  speed: number;
  color: string;
  scale?: number;
  tumble?: number;
}

export interface Section {
  title: string;
  text: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface Destination {
  id: string;
  name: string;
  number: string;
  kind: "planet" | "satellite" | "station";
  type?: string;
  category: string;
  subtitle: string;
  position: Vec3;
  radius: number;
  color: string;
  rings?: RingConfig;
  lambdas?: LambdaConfig[];
  moons?: MoonConfig[];
  tags: string[];
  sections: Section[];
  role: string;
  timeline: string;
  links: Link[];
}
