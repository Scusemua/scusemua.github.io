import * as THREE from "three";
import type { DagBoardConfig } from "../types.js";
import type { SimulatorSnapshot } from "./dag-simulator.js";

// ---------------------------------------------------------------------------
// Canvas rendering constants
// ---------------------------------------------------------------------------

const DAG_RESOLUTION = 8192;
const NODE_RADIUS = 400;
const PADDING = 320;

const FONT_NODE_LABEL = "bold 260px monospace";
const FONT_NODE_VALUE = "bold 200px monospace";
const FONT_EXECUTOR_LABEL = "bold 180px monospace";
const FONT_TITLE = "bold 220px monospace";
const FONT_PROGRESS = "bold 160px monospace";
const FONT_PHASE = "bold 200px monospace";

const EDGE_WIDTH_ACTIVE = 80;
const EDGE_WIDTH_COMPLETED = 40;
const EDGE_WIDTH_DEFAULT = 22;
const NODE_STROKE_ACTIVE = 40;
const NODE_STROKE_COMPLETED = 30;
const NODE_STROKE_DEFAULT = 20;

const PROGRESS_BAR_WIDTH = 700;
const PROGRESS_BAR_HEIGHT = 50;

const EXECUTOR_LABEL_OFFSET = 160;

// Color palette
const COLOR_BG = "rgba(8, 14, 28, 0.95)";
const COLOR_EDGE_ACTIVE = "#60d8ff";
const COLOR_EDGE_COMPLETED = "rgba(100,200,255,0.35)";
const COLOR_EDGE_DEFAULT = "rgba(80,120,160,0.25)";
const COLOR_NODE_EXECUTING_FILL = "#1a3860";
const COLOR_NODE_EXECUTING_STROKE = "#ff9040";
const COLOR_NODE_READY_FILL = "#184868";
const COLOR_NODE_READY_STROKE = "#60d8ff";
const COLOR_NODE_COMPLETED_FILL = "#1a4030";
const COLOR_NODE_COMPLETED_STROKE = "#60cc80";
const COLOR_NODE_PENDING_FILL = "#101828";
const COLOR_NODE_PENDING_STROKE = "rgba(80,120,160,0.4)";
const COLOR_TEXT_EXECUTING = "#ffb060";
const COLOR_TEXT_READY = "#b0e8ff";
const COLOR_TEXT_COMPLETED = "#90dda0";
const COLOR_TEXT_PENDING = "rgba(160,190,220,0.6)";
const COLOR_EXECUTOR_LABEL = "#ff9040";
const COLOR_PROGRESS_BG = "rgba(40,60,80,0.5)";
const COLOR_PROGRESS_FILL = "#60cc80";
const COLOR_TITLE = "rgba(160,190,220,0.6)";
const COLOR_PHASE_PARTITIONING = "#f5d060";
const COLOR_FRAME = "#4a7090";

const GLOW_BLUR = 50;

// Phase label map
const PHASE_LABELS: Record<string, string> = {
  partitioning: "STATIC SCHEDULER — PARTITIONING DAG",
  "invoking-leaves": "INVOKING LEAF EXECUTORS",
  executing: "DECENTRALIZED EXECUTION",
  completed: "DAG COMPLETE ✓",
  resetting: "RESETTING…",
};

// ---------------------------------------------------------------------------
// DagBoard — owns the canvas, texture, and Three.js mesh
// ---------------------------------------------------------------------------

export interface DagBoard {
  mesh: THREE.Mesh;
  frameMesh: THREE.LineSegments;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  config: DagBoardConfig;
  nodePos: Map<string, { px: number; py: number }>;
}

export function buildDagBoard(
  config: DagBoardConfig,
  scene: THREE.Scene,
): DagBoard {
  const canvas = document.createElement("canvas");
  canvas.width = DAG_RESOLUTION;
  canvas.height = Math.round(DAG_RESOLUTION * (config.height / config.width));
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const geo = new THREE.PlaneGeometry(config.width, config.height);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...config.position);
  if (config.rotation) mesh.rotation.set(...config.rotation);
  scene.add(mesh);

  const frameGeo = new THREE.EdgesGeometry(geo);
  const frameMat = new THREE.LineBasicMaterial({
    color: COLOR_FRAME,
    transparent: true,
    opacity: 0.6,
  });
  const frameMesh = new THREE.LineSegments(frameGeo, frameMat);
  frameMesh.position.copy(mesh.position);
  frameMesh.rotation.copy(mesh.rotation);
  scene.add(frameMesh);

  const innerW = canvas.width - PADDING * 2;
  const innerH = canvas.height - PADDING * 2;
  const nodePos = new Map<string, { px: number; py: number }>();
  for (const n of config.nodes) {
    nodePos.set(n.id, {
      px: PADDING + n.x * innerW,
      py: PADDING + n.y * innerH,
    });
  }

  return { mesh, frameMesh, canvas, ctx, texture, config, nodePos };
}

// ---------------------------------------------------------------------------
// Canvas rendering — reads simulator snapshot, draws the DAG state
// ---------------------------------------------------------------------------

export function renderDagCanvas(
  board: DagBoard,
  snapshot: SimulatorSnapshot,
): void {
  const { ctx, canvas, config, nodePos } = board;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, w, h);

  drawEdges(ctx, config, nodePos, snapshot);
  drawNodes(ctx, config, nodePos, snapshot);
  drawTitle(ctx, snapshot);
  drawProgressBar(ctx, w, snapshot);
  drawPhaseLabel(ctx, w, h, snapshot);

  board.texture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Drawing helpers
// ---------------------------------------------------------------------------

function drawEdges(
  ctx: CanvasRenderingContext2D,
  config: DagBoardConfig,
  nodePos: Map<string, { px: number; py: number }>,
  snapshot: SimulatorSnapshot,
): void {
  for (const e of config.edges) {
    const from = nodePos.get(e.from)!;
    const to = nodePos.get(e.to)!;
    const edgeKey = `${e.from}->${e.to}`;
    const isActive = snapshot.activeEdges.has(edgeKey);
    const fromNode = snapshot.nodes.get(e.from);
    const fromDone = fromNode?.status === "completed";

    ctx.beginPath();
    ctx.moveTo(from.px, from.py);
    ctx.lineTo(to.px, to.py);
    ctx.strokeStyle = isActive
      ? COLOR_EDGE_ACTIVE
      : fromDone
        ? COLOR_EDGE_COMPLETED
        : COLOR_EDGE_DEFAULT;
    ctx.lineWidth = isActive
      ? EDGE_WIDTH_ACTIVE
      : fromDone
        ? EDGE_WIDTH_COMPLETED
        : EDGE_WIDTH_DEFAULT;
    ctx.stroke();

    if (isActive) {
      const mx = (from.px + to.px) / 2;
      const my = (from.py + to.py) / 2;
      ctx.beginPath();
      ctx.arc(mx, my, 10, 0, Math.PI * 2);
      ctx.fillStyle = COLOR_EDGE_ACTIVE;
      ctx.fill();
    }
  }
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  config: DagBoardConfig,
  nodePos: Map<string, { px: number; py: number }>,
  snapshot: SimulatorSnapshot,
): void {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const n of config.nodes) {
    const pos = nodePos.get(n.id)!;
    const nodeState = snapshot.nodes.get(n.id);
    const status = nodeState?.status ?? "pending";

    ctx.beginPath();
    ctx.arc(pos.px, pos.py, NODE_RADIUS, 0, Math.PI * 2);

    const style = nodeStyle(status, nodeState?.assignedExecutor != null);
    ctx.fillStyle = style.fill;
    ctx.fill();
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = style.lineWidth;
    ctx.stroke();

    if (style.glow) {
      ctx.shadowColor = style.stroke;
      ctx.shadowBlur = GLOW_BLUR;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.font = FONT_NODE_LABEL;
    ctx.fillStyle = style.textColor;
    ctx.fillText(n.label, pos.px, pos.py - 60);

    const kvValue = snapshot.kvStore.values.get(n.id);
    const displayValue =
      kvValue !== undefined
        ? kvValue
        : n.inputValue !== undefined
          ? n.inputValue
          : undefined;
    if (displayValue !== undefined) {
      ctx.font = FONT_NODE_VALUE;
      ctx.fillStyle =
        kvValue !== undefined ? "#90dda0" : "rgba(160,190,220,0.5)";
      const formatted = Number.isInteger(displayValue)
        ? String(displayValue)
        : displayValue.toFixed(2);
      ctx.fillText(`= ${formatted}`, pos.px, pos.py + 140);
    }

    if (nodeState?.assignedExecutor) {
      ctx.font = FONT_EXECUTOR_LABEL;
      ctx.fillStyle = COLOR_EXECUTOR_LABEL;
      ctx.fillText(
        `← ${nodeState.assignedExecutor}`,
        pos.px,
        pos.py + NODE_RADIUS + EXECUTOR_LABEL_OFFSET,
      );
    }
  }
}

interface NodeVisualStyle {
  fill: string;
  stroke: string;
  lineWidth: number;
  glow: boolean;
  textColor: string;
}

function nodeStyle(status: string, hasExecutor: boolean): NodeVisualStyle {
  if (status === "executing" && hasExecutor) {
    return {
      fill: COLOR_NODE_EXECUTING_FILL,
      stroke: COLOR_NODE_EXECUTING_STROKE,
      lineWidth: NODE_STROKE_ACTIVE,
      glow: true,
      textColor: COLOR_TEXT_EXECUTING,
    };
  }
  if (status === "executing" || status === "ready") {
    return {
      fill: COLOR_NODE_READY_FILL,
      stroke: COLOR_NODE_READY_STROKE,
      lineWidth: NODE_STROKE_ACTIVE,
      glow: true,
      textColor: COLOR_TEXT_READY,
    };
  }
  if (status === "completed") {
    return {
      fill: COLOR_NODE_COMPLETED_FILL,
      stroke: COLOR_NODE_COMPLETED_STROKE,
      lineWidth: NODE_STROKE_COMPLETED,
      glow: false,
      textColor: COLOR_TEXT_COMPLETED,
    };
  }
  return {
    fill: COLOR_NODE_PENDING_FILL,
    stroke: COLOR_NODE_PENDING_STROKE,
    lineWidth: NODE_STROKE_DEFAULT,
    glow: false,
    textColor: COLOR_TEXT_PENDING,
  };
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  snapshot: SimulatorSnapshot,
): void {
  ctx.font = FONT_TITLE;
  ctx.fillStyle = COLOR_TITLE;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("DAG EXECUTION", PADDING, PADDING - 100);

  const executorCount = snapshot.executors.filter(
    (e) => e.phase !== "terminated",
  ).length;
  ctx.font = FONT_PROGRESS;
  ctx.fillStyle = "rgba(160,190,220,0.4)";
  ctx.textAlign = "left";
  ctx.fillText(
    `${executorCount} active executor${executorCount !== 1 ? "s" : ""}`,
    PADDING,
    PADDING + 60,
  );
}

function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  snapshot: SimulatorSnapshot,
): void {
  const pct = snapshot.completedFraction;
  const barX = canvasWidth - PADDING - PROGRESS_BAR_WIDTH;
  const barY = PADDING - PROGRESS_BAR_HEIGHT;

  // Percentage label above the bar
  ctx.font = FONT_PROGRESS;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(160,190,220,0.6)";
  ctx.fillText(`${Math.round(pct * 100)}%`, canvasWidth - PADDING, barY - 30);

  // Background bar
  ctx.fillStyle = COLOR_PROGRESS_BG;
  ctx.fillRect(barX, barY, PROGRESS_BAR_WIDTH, PROGRESS_BAR_HEIGHT);
  // Fill bar
  ctx.fillStyle = COLOR_PROGRESS_FILL;
  ctx.fillRect(barX, barY, PROGRESS_BAR_WIDTH * pct, PROGRESS_BAR_HEIGHT);
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  snapshot: SimulatorSnapshot,
): void {
  const label = PHASE_LABELS[snapshot.phase] ?? "";
  if (!label) return;

  const isPreExecution =
    snapshot.phase === "partitioning" || snapshot.phase === "invoking-leaves";

  ctx.font = FONT_PHASE;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = isPreExecution ? COLOR_PHASE_PARTITIONING : COLOR_TITLE;
  ctx.fillText(label, canvasWidth / 2, canvasHeight - PADDING + 60);
}
