import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { bakeTextures, bakeNebula } from './bake-textures.mjs';

// Bake procedural textures into a JS module, then bundle everything into a
// single HTML file — no external scripts, stylesheets or images. This makes
// the 3D portfolio deployable as one file with zero runtime dependencies.
await writeFile('src/generated-textures.js', `export default ${JSON.stringify(bakeTextures())};\n`);
const result = await build({
  entryPoints: ['src/main.ts'], bundle: true, minify: true,
  write: false, format: 'iife', target: ['es2020'], legalComments: 'inline'
});
const template = (await readFile('src/template.html', 'utf8')).replace('/* NEBULA_IMAGE */', () => `url("${bakeNebula()}")`);
// Escape </script inside the bundled JS to prevent the browser from
// interpreting it as the end of the inline <script> tag.
const script = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', template.replace('<!-- APP_SCRIPT -->', () => `<script>${script}</script>`));
console.log(`Built dist/index.html (${Math.round((template.length + script.length) / 1024)} KiB). No external runtime dependencies.`);
