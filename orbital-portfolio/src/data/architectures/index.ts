import { wukongArchitecture } from "./wukong.js";
import type { Architecture } from "../../surface/types.js";

export const architectureById = new Map<string, Architecture>([
  [wukongArchitecture.id, wukongArchitecture],
]);
