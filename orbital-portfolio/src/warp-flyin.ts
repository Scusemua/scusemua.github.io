import * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { TweenState } from "./state.js";

export interface WarpFlyInOptions {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  initialCamera: THREE.Vector3;
  initialTarget: THREE.Vector3;
  isMobile: boolean;
  setTween(tween: TweenState): void;
}

// The fly-in uses a 2D canvas overlay rather than 3D objects because hundreds
// of individual star streaks would bloat the scene graph and compete with the
// main toon-shaded render pass for draw calls.
export function startWarpFlyIn(options: WarpFlyInOptions): void {
  const { camera, controls, initialCamera, initialTarget, isMobile, setTween } = options;

  const config = {
    cameraOffset:    new THREE.Vector3(0, 55, isMobile ? 300 : 250),
    targetOffset:    new THREE.Vector3(0, 30, isMobile ? 140 : 110),
    tweenDuration:   isMobile ? 1800 : 1600,
    starCount:       isMobile ? 40 : 100,
    starMinRadius:   0.5,
    starMaxRadius:   isMobile ? 1.5 : 2.0,
    starMinSpeed:    0.5,
    starMaxSpeed:    1.0,
    persistChance:   1.0,
    warpDuration:    isMobile ? 1200 : 1400,
    lingerDuration:  1200,
    moveMultiplier:  isMobile ? 12 : 18,
    streakLength:    isMobile ? 25 : 40,
    fadeStart:        0.7,
    ambientAlpha:     0.15,
    respawnSpread:   isMobile ? 60 : 100,
    brightnessBase:   0.4,
  };

  const flyInFrom = initialCamera.clone().add(config.cameraOffset);
  camera.position.copy(flyInFrom);
  controls.update();

  setTween({
    started: performance.now(),
    fromCamera: flyInFrom,
    fromTarget: controls.target.clone().add(config.targetOffset),
    toCamera: initialCamera.clone(),
    toTarget: initialTarget.clone(),
    duration: config.tweenDuration,
    // Cubic ease-out: dramatic deceleration as the camera arrives, giving the
    // impression of a ship dropping out of warp speed.
    ease: (t: number) => 1 - Math.pow(1 - t, 3),
  });

  const warpCanvas = document.createElement("canvas");
  warpCanvas.style.cssText = "position:fixed;inset:0;z-index:1000;pointer-events:none;";
  warpCanvas.width = innerWidth;
  warpCanvas.height = innerHeight;
  document.body.appendChild(warpCanvas);
  const wctx = warpCanvas.getContext("2d")!;
  const cx = warpCanvas.width / 2, cy = warpCanvas.height / 2;

  const warpStars: { x: number; y: number; r: number; speed: number; persist: boolean }[] = [];
  for (let i = 0; i < config.starCount; i++) {
    warpStars.push({
      x: Math.random() * warpCanvas.width,
      y: Math.random() * warpCanvas.height,
      r: config.starMinRadius + Math.random() * (config.starMaxRadius - config.starMinRadius),
      speed: config.starMinSpeed + Math.random() * (config.starMaxSpeed - config.starMinSpeed),
      persist: Math.random() < config.persistChance,
    });
  }

  const warpStart = performance.now();
  let lingerStart = 0;

  function animateWarp(): void {
    const elapsed = performance.now() - warpStart;
    const t = Math.min(elapsed / config.warpDuration, 1);
    const warpSpeed = Math.max(0, 1 - t * t);
    const warpDone = t >= 1;
    if (warpDone && lingerStart === 0) lingerStart = performance.now();
    const lingerT = lingerStart > 0 ? Math.min((performance.now() - lingerStart) / config.lingerDuration, 1) : 0;
    const fadeOpacity = t < config.fadeStart ? 1 : 1 - (t - config.fadeStart) / (1 - config.fadeStart);
    wctx.clearRect(0, 0, warpCanvas.width, warpCanvas.height);
    let anyVisible = false;
    for (const star of warpStars) {
      // Persistent stars fade slowly after warp ends to create ambient
      // twinkle during the camera fly-in, bridging the gap between the
      // warp effect and the 3D starfield appearing underneath.
      let alpha: number;
      if (star.persist) {
        if (warpDone) alpha = config.ambientAlpha * (1 - lingerT);
        else alpha = Math.max(config.ambientAlpha, fadeOpacity);
      } else {
        alpha = warpDone ? 0 : fadeOpacity;
      }
      if (alpha <= 0.001) continue;
      anyVisible = true;
      const angle = Math.atan2(star.y - cy, star.x - cx);
      if (!warpDone) {
        const move = warpSpeed * config.moveMultiplier * star.speed;
        star.x += move * Math.cos(angle);
        star.y += move * Math.sin(angle);
        if (star.x > warpCanvas.width || star.x < 0 || star.y > warpCanvas.height || star.y < 0) {
          star.x = cx + (Math.random() - 0.5) * config.respawnSpread;
          star.y = cy + (Math.random() - 0.5) * config.respawnSpread;
        }
      }
      const dist = Math.sqrt((star.x - cx) ** 2 + (star.y - cy) ** 2);
      const lineLen = warpSpeed * config.streakLength * star.speed * (dist / (warpCanvas.width * 0.5));
      const brightness = Math.min(1, config.brightnessBase + dist / (warpCanvas.width * config.brightnessBase));
      const col = `rgba(${180 + Math.round(75 * brightness)},${200 + Math.round(55 * brightness)},255,${brightness * alpha})`;
      if (lineLen > star.r * 1.5) {
        const tailX = star.x - lineLen * Math.cos(angle);
        const tailY = star.y - lineLen * Math.sin(angle);
        wctx.beginPath();
        wctx.moveTo(tailX, tailY);
        wctx.lineTo(star.x, star.y);
        wctx.strokeStyle = col;
        wctx.lineWidth = star.r * (1 + warpSpeed);
        wctx.stroke();
      } else {
        wctx.beginPath();
        wctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        wctx.fillStyle = col;
        wctx.fill();
      }
    }
    if (!anyVisible) { warpCanvas.remove(); return; }
    requestAnimationFrame(animateWarp);
  }
  requestAnimationFrame(animateWarp);
}
