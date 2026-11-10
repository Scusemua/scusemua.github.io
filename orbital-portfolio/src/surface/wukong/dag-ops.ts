import type { DagOp, DagBoardConfig } from "../types.js";

// ---------------------------------------------------------------------------
// Operation evaluation
// ---------------------------------------------------------------------------

const unaryOps: Record<string, (a: number) => number> = {
  INCR: (a) => a + 1,
  DECR: (a) => a - 1,
  ABS: (a) => Math.abs(a),
};

const binaryOps: Record<string, (a: number, b: number) => number> = {
  ADD: (a, b) => a + b,
  SUB: (a, b) => a - b,
  MULT: (a, b) => a * b,
  DIV: (a, b) => (b === 0 ? 0 : a / b),
};

export function evaluateOp(
  op: DagOp,
  inputs: readonly number[],
): number {
  if (op in unaryOps) return unaryOps[op](inputs[0] ?? 0);
  if (op in binaryOps) return binaryOps[op](inputs[0] ?? 0, inputs[1] ?? 0);
  return 0;
}

export function isUnaryOp(op: DagOp): boolean {
  return op in unaryOps;
}

export function isBinaryOp(op: DagOp): boolean {
  return op in binaryOps;
}

// ---------------------------------------------------------------------------
// KV store — tracks computed values per node across a simulation cycle
// ---------------------------------------------------------------------------

export interface KvStore {
  readonly values: ReadonlyMap<string, number>;
}

export function createKvStore(): KvStore & { set(key: string, value: number): void; clear(): void } {
  const values = new Map<string, number>();
  return {
    get values() { return values as ReadonlyMap<string, number>; },
    set(key: string, value: number) { values.set(key, value); },
    clear() { values.clear(); },
  };
}

export function computeNodeValue(
  nodeId: string,
  config: DagBoardConfig,
  kvStore: KvStore,
): number {
  const node = config.nodes.find((n) => n.id === nodeId);
  if (!node) return 0;

  if (node.inputValue !== undefined && !node.op) {
    return node.inputValue;
  }

  const parentIds = config.edges
    .filter((e) => e.to === nodeId)
    .map((e) => e.from);
  const inputs = parentIds.map((pid) => kvStore.values.get(pid) ?? 0);

  if (!node.op) {
    return inputs[0] ?? node.inputValue ?? 0;
  }

  return evaluateOp(node.op, inputs);
}
