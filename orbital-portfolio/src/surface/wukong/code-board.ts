import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CodeBoard {
  mesh: THREE.Mesh;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CODE_BOARD_WIDTH = 4096;
const CODE_BOARD_HEIGHT = 6400;
const CODE_BOARD_BG = "rgba(12, 14, 22, 0.94)";
const CODE_BOARD_FRAME_COLOR = "#4a6080";

const FONT_TITLE = "bold 210px monospace";
const FONT_CODE = "185px monospace";
const LINE_HEIGHT = 222;
const LEFT_MARGIN = 250;
const TOP_MARGIN = 530;

// Syntax highlighting colors
const COLOR_KEYWORD = "#c586c0";
const COLOR_DECORATOR = "#dcdcaa";
const COLOR_FUNCTION = "#dcdcaa";
const COLOR_STRING = "#ce9178";
const COLOR_NUMBER = "#b5cea8";
const COLOR_COMMENT = "#6a9955";
const COLOR_PLAIN = "#d4d4d4";
const COLOR_VARIABLE = "#9cdcfe";
const COLOR_BUILTIN = "#4ec9b0";
const COLOR_TITLE_COLOR = "rgba(160,190,220,0.6)";

// ---------------------------------------------------------------------------
// Dask code for the Wukong DAG
// ---------------------------------------------------------------------------

interface CodeToken {
  text: string;
  color: string;
}

type CodeLine = CodeToken[];

const CODE_LINES: CodeLine[] = [
  [{ text: "import", color: COLOR_KEYWORD }, { text: " dask", color: COLOR_PLAIN }],
  [],
  [{ text: "@", color: COLOR_DECORATOR }, { text: "dask.delayed", color: COLOR_DECORATOR }],
  [{ text: "def", color: COLOR_KEYWORD }, { text: " incr", color: COLOR_FUNCTION }, { text: "(x): ", color: COLOR_PLAIN }, { text: "return", color: COLOR_KEYWORD }, { text: " x + ", color: COLOR_PLAIN }, { text: "1", color: COLOR_NUMBER }],
  [],
  [{ text: "@", color: COLOR_DECORATOR }, { text: "dask.delayed", color: COLOR_DECORATOR }],
  [{ text: "def", color: COLOR_KEYWORD }, { text: " decr", color: COLOR_FUNCTION }, { text: "(x): ", color: COLOR_PLAIN }, { text: "return", color: COLOR_KEYWORD }, { text: " x - ", color: COLOR_PLAIN }, { text: "1", color: COLOR_NUMBER }],
  [],
  [{ text: "@", color: COLOR_DECORATOR }, { text: "dask.delayed", color: COLOR_DECORATOR }],
  [{ text: "def", color: COLOR_KEYWORD }, { text: " abs_", color: COLOR_FUNCTION }, { text: "(x): ", color: COLOR_PLAIN }, { text: "return", color: COLOR_KEYWORD }, { text: " abs(x)", color: COLOR_PLAIN }],
  [],
  [{ text: "@", color: COLOR_DECORATOR }, { text: "dask.delayed", color: COLOR_DECORATOR }],
  [{ text: "def", color: COLOR_KEYWORD }, { text: " add", color: COLOR_FUNCTION }, { text: "(a, b): ", color: COLOR_PLAIN }, { text: "return", color: COLOR_KEYWORD }, { text: " a + b", color: COLOR_PLAIN }],
  [],
  [{ text: "@", color: COLOR_DECORATOR }, { text: "dask.delayed", color: COLOR_DECORATOR }],
  [{ text: "def", color: COLOR_KEYWORD }, { text: " mult", color: COLOR_FUNCTION }, { text: "(a, b): ", color: COLOR_PLAIN }, { text: "return", color: COLOR_KEYWORD }, { text: " a * b", color: COLOR_PLAIN }],
  [],
  [{ text: "A", color: COLOR_VARIABLE }, { text: ", ", color: COLOR_PLAIN }, { text: "B", color: COLOR_VARIABLE }, { text: ", ", color: COLOR_PLAIN }, { text: "C", color: COLOR_VARIABLE }, { text: " = ", color: COLOR_PLAIN }, { text: "7", color: COLOR_NUMBER }, { text: ", ", color: COLOR_PLAIN }, { text: "-3", color: COLOR_NUMBER }, { text: ", ", color: COLOR_PLAIN }, { text: "5", color: COLOR_NUMBER }],
  [{ text: "D", color: COLOR_VARIABLE }, { text: " = incr(", color: COLOR_PLAIN }, { text: "A", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [{ text: "E", color: COLOR_VARIABLE }, { text: " = abs_(", color: COLOR_PLAIN }, { text: "B", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [{ text: "F", color: COLOR_VARIABLE }, { text: " = decr(", color: COLOR_PLAIN }, { text: "C", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [{ text: "G", color: COLOR_VARIABLE }, { text: " = incr(", color: COLOR_PLAIN }, { text: "D", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [{ text: "H", color: COLOR_VARIABLE }, { text: " = incr(", color: COLOR_PLAIN }, { text: "E", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [{ text: "I", color: COLOR_VARIABLE }, { text: " = abs_(", color: COLOR_PLAIN }, { text: "F", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [{ text: "J", color: COLOR_VARIABLE }, { text: " = add(", color: COLOR_PLAIN }, { text: "G", color: COLOR_VARIABLE }, { text: ", ", color: COLOR_PLAIN }, { text: "H", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [{ text: "K", color: COLOR_VARIABLE }, { text: " = mult(", color: COLOR_PLAIN }, { text: "H", color: COLOR_VARIABLE }, { text: ", ", color: COLOR_PLAIN }, { text: "I", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [{ text: "L", color: COLOR_VARIABLE }, { text: " = add(", color: COLOR_PLAIN }, { text: "J", color: COLOR_VARIABLE }, { text: ", ", color: COLOR_PLAIN }, { text: "K", color: COLOR_VARIABLE }, { text: ")", color: COLOR_PLAIN }],
  [],
  [{ text: "result", color: COLOR_VARIABLE }, { text: " = ", color: COLOR_PLAIN }, { text: "L", color: COLOR_VARIABLE }, { text: ".compute()", color: COLOR_PLAIN }, { text: "  # 29", color: COLOR_COMMENT }],
];

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function buildCodeBoard(
  dagBoardPos: [number, number, number],
  scene: THREE.Scene,
): CodeBoard {
  const canvas = document.createElement("canvas");
  canvas.width = CODE_BOARD_WIDTH;
  canvas.height = CODE_BOARD_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const geo = new THREE.PlaneGeometry(18, 28);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(dagBoardPos[0] - 22, dagBoardPos[1], dagBoardPos[2] + 2);
  mesh.rotation.set(0.15, 0.25, 0);
  scene.add(mesh);

  renderCodeCanvas(ctx, canvas.width, canvas.height);
  texture.needsUpdate = true;

  return { mesh, canvas, ctx, texture };
}

// ---------------------------------------------------------------------------
// Render (static — only drawn once)
// ---------------------------------------------------------------------------

function renderCodeCanvas(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  ctx.fillStyle = CODE_BOARD_BG;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = CODE_BOARD_FRAME_COLOR;
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  ctx.font = FONT_TITLE;
  ctx.fillStyle = COLOR_TITLE_COLOR;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("DASK TASK GRAPH", LEFT_MARGIN, 120);

  ctx.font = "bold 140px monospace";
  ctx.fillStyle = "rgba(160,190,220,0.3)";
  ctx.fillText("Python · dask.delayed", LEFT_MARGIN, 310);

  ctx.textBaseline = "top";
  let y = TOP_MARGIN;

  for (const line of CODE_LINES) {
    if (line.length === 0) {
      y += LINE_HEIGHT * 0.5;
      continue;
    }

    let x = LEFT_MARGIN;
    ctx.font = FONT_CODE;
    for (const token of line) {
      ctx.fillStyle = token.color;
      ctx.fillText(token.text, x, y);
      x += ctx.measureText(token.text).width;
    }
    y += LINE_HEIGHT;
  }
}
