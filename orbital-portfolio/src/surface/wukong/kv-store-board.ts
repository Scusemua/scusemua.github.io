import * as THREE from "three";
import type { DagBoardConfig } from "../types.js";
import type { KvStore } from "./dag-ops.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KvStoreBoard {
  mesh: THREE.Mesh;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  lastKeys: Set<string>;
  flashTimers: Map<string, number>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const KV_BOARD_WIDTH = 4096;
const KV_BOARD_HEIGHT = 4096;
const KV_BOARD_BG = "rgba(16, 12, 8, 0.92)";
const KV_BOARD_HEADER_COLOR = "#c8956a";
const KV_BOARD_TEXT_COLOR = "#d0b898";
const KV_BOARD_VALUE_COLOR = "#e8c080";
const KV_BOARD_FLASH_COLOR = "#ffdd60";
const KV_BOARD_FLASH_DURATION = 0.4;

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function buildKvStoreBoard(
  kvStorePos: [number, number, number],
  scene: THREE.Scene,
): KvStoreBoard {
  const canvas = document.createElement("canvas");
  canvas.width = KV_BOARD_WIDTH;
  canvas.height = KV_BOARD_HEIGHT;
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
  mesh.position.set(kvStorePos[0], kvStorePos[1] + 6.5, kvStorePos[2]);
  mesh.rotation.y = 0.3;
  scene.add(mesh);

  return {
    mesh,
    canvas,
    ctx,
    texture,
    lastKeys: new Set(),
    flashTimers: new Map(),
  };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

export function renderKvStoreBoard(
  board: KvStoreBoard,
  dagConfig: DagBoardConfig,
  kvStore: KvStore,
  delta: number,
): void {
  const { ctx, canvas } = board;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = KV_BOARD_BG;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = KV_BOARD_HEADER_COLOR;
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  ctx.font = "bold 240px monospace";
  ctx.fillStyle = KV_BOARD_HEADER_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("KV STORE", w / 2, 120);

  ctx.beginPath();
  ctx.moveTo(160, 420);
  ctx.lineTo(w - 160, 420);
  ctx.strokeStyle = "rgba(200,149,106,0.4)";
  ctx.lineWidth = 8;
  ctx.stroke();

  // Update flash timers for newly-added keys
  for (const [key] of kvStore.values) {
    if (!board.lastKeys.has(key)) {
      board.flashTimers.set(key, KV_BOARD_FLASH_DURATION);
    }
  }
  board.lastKeys.clear();
  for (const [key] of kvStore.values) board.lastKeys.add(key);

  for (const [id, t] of board.flashTimers) {
    const next = t - delta;
    if (next <= 0) board.flashTimers.delete(id);
    else board.flashTimers.set(id, next);
  }

  // Column headers
  const rowHeight = 340;
  let y = 520;

  ctx.textAlign = "left";
  ctx.font = "bold 180px monospace";
  ctx.fillStyle = "rgba(200,149,106,0.5)";
  ctx.fillText("KEY", 200, y);
  ctx.textAlign = "center";
  ctx.fillText("OP", w / 2, y);
  ctx.textAlign = "right";
  ctx.fillText("VALUE", w - 200, y);
  y += rowHeight;

  ctx.beginPath();
  ctx.moveTo(160, y - 80);
  ctx.lineTo(w - 160, y - 80);
  ctx.strokeStyle = "rgba(200,149,106,0.2)";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Render rows in DAG node order
  for (const node of dagConfig.nodes) {
    const value = kvStore.values.get(node.id);
    const flash = board.flashTimers.get(node.id);
    const hasValue = value !== undefined;

    if (flash) {
      const alpha = 0.15 * (flash / KV_BOARD_FLASH_DURATION);
      ctx.fillStyle = `rgba(255, 221, 96, ${alpha})`;
      ctx.fillRect(160, y - 60, w - 320, rowHeight - 40);
    }

    // Key column
    ctx.textAlign = "left";
    ctx.font = "bold 200px monospace";
    ctx.fillStyle = hasValue
      ? (flash ? KV_BOARD_FLASH_COLOR : KV_BOARD_TEXT_COLOR)
      : "rgba(200,149,106,0.25)";
    ctx.fillText(node.id, 200, y);

    // Op column
    ctx.textAlign = "center";
    ctx.font = "bold 180px monospace";
    const opLabel = node.op ?? (node.inputValue !== undefined ? "INPUT" : "—");
    ctx.fillStyle = hasValue
      ? (flash ? KV_BOARD_FLASH_COLOR : "rgba(200,149,106,0.6)")
      : "rgba(200,149,106,0.2)";
    ctx.fillText(opLabel, w / 2, y);

    // Value column
    ctx.textAlign = "right";
    ctx.font = "bold 220px monospace";
    if (hasValue) {
      ctx.fillStyle = flash ? KV_BOARD_FLASH_COLOR : KV_BOARD_VALUE_COLOR;
      const formatted = Number.isInteger(value)
        ? String(value)
        : value.toFixed(2);
      ctx.fillText(formatted, w - 200, y);
    } else {
      ctx.fillStyle = "rgba(200,149,106,0.2)";
      ctx.fillText("—", w - 200, y);
    }

    y += rowHeight;
  }

  board.texture.needsUpdate = true;
}
