import type * as THREE from "three";
import type { SurfaceHooks, SurfaceContext, BoardFocusView } from "../hooks.js";
import { DagSimulator } from "./dag-simulator.js";
import { buildDagBoard, renderDagCanvas } from "./dag-renderer.js";
import type { DagBoard } from "./dag-renderer.js";
import {
  type LambdaLifecycle,
  type InvocationPulse,
  buildLambdaLifecycles,
  syncLambdasToSimulator,
  updateLambdaLifecyclesStandalone,
  updatePulses,
  consumeSimEvents,
  clearTaskVisuals,
  updateLambdaLabels,
} from "./lambda-lifecycle.js";
import {
  type DepCounterBoard,
  buildDepCounterBoard,
  renderDepCounterBoard,
} from "./dep-counter-board.js";
import {
  type TaskFunnel,
  buildTaskFunnels,
  updateTaskFunnels,
} from "./task-funnels.js";
import {
  type KvStoreBoard,
  buildKvStoreBoard,
  renderKvStoreBoard,
} from "./kv-store-board.js";
import { type CodeBoard, buildCodeBoard } from "./code-board.js";

// ---------------------------------------------------------------------------
// Wukong-specific state
// ---------------------------------------------------------------------------

interface WukongState {
  dagBoard: DagBoard | null;
  dagSimulator: DagSimulator | null;
  lambdaLifecycles: LambdaLifecycle[];
  invocationPulses: InvocationPulse[];
  storagePulses: InvocationPulse[];
  taskFunnels: TaskFunnel[];
  executorToLambda: Map<string, number>;
  depCounterBoard: DepCounterBoard | null;
  kvStoreBoard: KvStoreBoard | null;
  codeBoard: CodeBoard | null;
}

// ---------------------------------------------------------------------------
// Exported hooks
// ---------------------------------------------------------------------------

export function createWukongHooks(): SurfaceHooks {
  let ws: WukongState | null = null;

  return {
    onBuild(ctx: SurfaceContext): void {
      const arch = ctx.architecture;
      const hasDag = !!arch.dagBoard;

      const taskFunnels = buildTaskFunnels(arch);
      const lambdaLifecycles = buildLambdaLifecycles(ctx, hasDag);

      let dagBoard: DagBoard | null = null;
      let dagSimulator: DagSimulator | null = null;
      if (arch.dagBoard) {
        dagBoard = buildDagBoard(arch.dagBoard, ctx.scene);
        dagSimulator = new DagSimulator(arch.dagBoard);
        renderDagCanvas(dagBoard, dagSimulator.snapshot);
      }

      let depCounterBoard: DepCounterBoard | null = null;
      if (dagSimulator) {
        const metaComp = arch.components.find((c) => c.id === "metadata");
        if (metaComp) {
          depCounterBoard = buildDepCounterBoard(metaComp.position, ctx.scene);
          renderDepCounterBoard(depCounterBoard, dagSimulator.snapshot, 0);
        }
      }

      let kvStoreBoard: KvStoreBoard | null = null;
      if (dagSimulator && arch.dagBoard) {
        const kvComp = arch.components.find((c) => c.id === "kv-store");
        if (kvComp) {
          kvStoreBoard = buildKvStoreBoard(kvComp.position, ctx.scene);
          renderKvStoreBoard(
            kvStoreBoard,
            arch.dagBoard,
            dagSimulator.snapshot.kvStore,
            0,
          );
        }
      }

      let codeBoard: CodeBoard | null = null;
      if (arch.dagBoard) {
        codeBoard = buildCodeBoard(arch.dagBoard.position, ctx.scene);
      }

      ws = {
        dagBoard,
        dagSimulator,
        lambdaLifecycles,
        invocationPulses: [],
        storagePulses: [],
        taskFunnels,
        executorToLambda: new Map(),
        depCounterBoard,
        kvStoreBoard,
        codeBoard,
      };
    },

    onUpdate(ctx: SurfaceContext, delta: number): void {
      if (!ws) return;

      updateTaskFunnels(ws.taskFunnels, ctx, delta);

      if (ws.dagSimulator && ws.dagBoard) {
        ws.dagSimulator.update(delta);
        const snapshot = ws.dagSimulator.snapshot;
        syncLambdasToSimulator(
          ctx,
          ws.lambdaLifecycles,
          ws.invocationPulses,
          ws.executorToLambda,
          ws.dagBoard,
          snapshot,
          delta,
        );
        consumeSimEvents(
          ctx,
          ws.lambdaLifecycles,
          ws.executorToLambda,
          ws.storagePulses,
          snapshot.events,
        );
        updatePulses(ws.invocationPulses, ctx.scene, delta);
        updatePulses(ws.storagePulses, ctx.scene, delta);
        renderDagCanvas(ws.dagBoard, snapshot);
        if (ws.depCounterBoard) {
          renderDepCounterBoard(ws.depCounterBoard, snapshot, delta);
        }
        if (ws.kvStoreBoard && ws.dagBoard) {
          renderKvStoreBoard(
            ws.kvStoreBoard,
            ws.dagBoard.config,
            snapshot.kvStore,
            delta,
          );
        }
      } else {
        updateLambdaLifecyclesStandalone(
          ctx,
          ws.lambdaLifecycles,
          ws.invocationPulses,
          delta,
        );
        updatePulses(ws.invocationPulses, ctx.scene, delta);
      }
    },

    onUpdateLabels(ctx: SurfaceContext): void {
      if (!ws || !ws.dagSimulator) return;
      updateLambdaLabels(
        ctx,
        ws.lambdaLifecycles,
        ws.executorToLambda,
        ws.dagSimulator.snapshot,
      );
    },

    onDispose(ctx: SurfaceContext): void {
      if (!ws) return;
      for (const lc of ws.lambdaLifecycles) {
        if (lc.taskIndicator) ctx.scene.remove(lc.taskIndicator);
        if (lc.taskLabelEl) lc.taskLabelEl.remove();
      }
      for (const pulse of ws.invocationPulses) ctx.scene.remove(pulse.mesh);
      for (const pulse of ws.storagePulses) ctx.scene.remove(pulse.mesh);
      ws = null;
    },

    getBoardMeshes(): { mesh: THREE.Object3D; id: string; view: BoardFocusView }[] {
      if (!ws) return [];
      const boards: { mesh: THREE.Object3D; id: string; view: BoardFocusView }[] = [];

      if (ws.dagBoard) {
        boards.push({
          mesh: ws.dagBoard.mesh,
          id: "dag-board",
          view: {
            cameraPos: [2, 16, 18],
            cameraTarget: [2, 14, -16],
          },
        });
      }
      if (ws.depCounterBoard) {
        boards.push({
          mesh: ws.depCounterBoard.mesh,
          id: "dep-counter-board",
          view: {
            cameraPos: [4, 9, 22],
            cameraTarget: [-5, 8, 5],
          },
        });
      }
      if (ws.kvStoreBoard) {
        boards.push({
          mesh: ws.kvStoreBoard.mesh,
          id: "kv-store-board",
          view: {
            cameraPos: [-8, 9, 28],
            cameraTarget: [-17, 7.7, 11],
          },
        });
      }
      if (ws.codeBoard) {
        boards.push({
          mesh: ws.codeBoard.mesh,
          id: "code-board",
          view: {
            cameraPos: [-6, 16, 22],
            cameraTarget: [-20, 13, -14],
          },
        });
      }

      return boards;
    },
  };
}
