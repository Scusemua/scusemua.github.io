import * as THREE from "three";
import type { SimulatorSnapshot } from "./dag-simulator.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DepCounterBoard {
  mesh: THREE.Mesh;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  lastCounters: Map<string, number>;
  flashTimers: Map<string, number>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEP_BOARD_WIDTH = 4096;
const DEP_BOARD_HEIGHT = 4096;
const DEP_BOARD_BG = "rgba(10, 20, 16, 0.92)";
const DEP_BOARD_HEADER_COLOR = "#82bd6f";
const DEP_BOARD_TEXT_COLOR = "#b0c8b0";
const DEP_BOARD_READY_COLOR = "#60cc80";
const DEP_BOARD_FLASH_COLOR = "#ffdd60";
const DEP_BOARD_FLASH_DURATION = 0.4;

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function buildDepCounterBoard(
  metadataPos: [number, number, number],
  scene: THREE.Scene,
): DepCounterBoard {
  const canvas = document.createElement("canvas");
  canvas.width = DEP_BOARD_WIDTH;
  canvas.height = DEP_BOARD_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const geo = new THREE.PlaneGeometry(8, 8);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(metadataPos[0], metadataPos[1] + 6.5, metadataPos[2]);
  mesh.rotation.y = 0.3;
  scene.add(mesh);

  return {
    mesh,
    canvas,
    ctx,
    texture,
    lastCounters: new Map(),
    flashTimers: new Map(),
  };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

export function renderDepCounterBoard(
  board: DepCounterBoard,
  snapshot: SimulatorSnapshot,
  delta: number,
): void {
  const { ctx, canvas } = board;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = DEP_BOARD_BG;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = DEP_BOARD_HEADER_COLOR;
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  ctx.font = "bold 240px monospace";
  ctx.fillStyle = DEP_BOARD_HEADER_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("DEP COUNTERS", w / 2, 120);

  ctx.beginPath();
  ctx.moveTo(160, 420);
  ctx.lineTo(w - 160, 420);
  ctx.strokeStyle = "rgba(130,189,111,0.4)";
  ctx.lineWidth = 8;
  ctx.stroke();

  const depNodes: {
    id: string;
    label: string;
    counter: number;
    total: number;
    status: string;
  }[] = [];
  for (const [, node] of snapshot.nodes) {
    if (node.depsTotal > 0) {
      depNodes.push({
        id: node.id,
        label: node.label,
        counter: node.depCounter,
        total: node.depsTotal,
        status: node.status,
      });
    }
  }

  for (const node of depNodes) {
    const prev = board.lastCounters.get(node.id) ?? 0;
    if (node.counter > prev) {
      board.flashTimers.set(node.id, DEP_BOARD_FLASH_DURATION);
    }
    board.lastCounters.set(node.id, node.counter);
  }
  for (const [id, t] of board.flashTimers) {
    const next = t - delta;
    if (next <= 0) board.flashTimers.delete(id);
    else board.flashTimers.set(id, next);
  }

  const rowHeight = 340;
  let y = 520;

  ctx.textAlign = "left";
  ctx.font = "bold 180px monospace";
  ctx.fillStyle = "rgba(130,189,111,0.5)";
  ctx.fillText("TASK", 200, y);
  ctx.textAlign = "right";
  ctx.fillText("DEPS", w - 200, y);
  y += rowHeight;

  ctx.beginPath();
  ctx.moveTo(160, y - 80);
  ctx.lineTo(w - 160, y - 80);
  ctx.strokeStyle = "rgba(130,189,111,0.2)";
  ctx.lineWidth = 6;
  ctx.stroke();

  for (const node of depNodes) {
    const flash = board.flashTimers.get(node.id);
    const isSatisfied = node.counter >= node.total;
    const isCompleted = node.status === "completed";

    if (flash) {
      const alpha = 0.15 * (flash / DEP_BOARD_FLASH_DURATION);
      ctx.fillStyle = `rgba(255, 221, 96, ${alpha})`;
      ctx.fillRect(160, y - 60, w - 320, rowHeight - 40);
    }

    ctx.textAlign = "left";
    ctx.font = "bold 200px monospace";
    ctx.fillStyle = isCompleted
      ? "rgba(96,204,128,0.5)"
      : isSatisfied
        ? DEP_BOARD_READY_COLOR
        : flash
          ? DEP_BOARD_FLASH_COLOR
          : DEP_BOARD_TEXT_COLOR;
    ctx.fillText(node.label, 200, y);

    ctx.textAlign = "right";
    const counterText = `${node.counter}/${node.total}`;
    ctx.fillStyle = isCompleted
      ? "rgba(96,204,128,0.5)"
      : isSatisfied
        ? DEP_BOARD_READY_COLOR
        : flash
          ? DEP_BOARD_FLASH_COLOR
          : DEP_BOARD_TEXT_COLOR;
    ctx.font = "bold 220px monospace";
    ctx.fillText(counterText, w - 200, y);

    if (isSatisfied && !isCompleted) {
      ctx.font = "bold 160px monospace";
      ctx.fillStyle = DEP_BOARD_READY_COLOR;
      ctx.textAlign = "center";
      ctx.fillText("✓", w - 760, y);
    }

    y += rowHeight;
  }

  board.texture.needsUpdate = true;
}
