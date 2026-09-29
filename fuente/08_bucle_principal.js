
// =====================================================================
//  BUCLE PRINCIPAL: física a paso fijo (mecanismos 1080 Hz, partículas 180 Hz)
// =====================================================================
applyTrans(); buildExplode(); setMode('manual');
const clock = new THREE.Clock();
let acc = 0;
const DTP = 1 / 180, SUB = 6;
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  explodeUndo();
  const paused = EXPL.u > 0.02 || EXPL.target > 0; // en despiece la física se congela
  if (!paused) {
    acc += dt; let n = 0;
    while (acc >= DTP && n < 12) { for (let k = 0; k < SUB; k++) { stepAuto(DTP / SUB); stepMech(DTP / SUB); } stepParticles(DTP); acc -= DTP; n++; }
    if (n >= 12) acc = 0;
    heapRelax(2);
  } else acc = 0;
  if (camTween) { camTween.t = Math.min(1, camTween.t + dt / camTween.d); const u = smooth(0, 1, camTween.t); camera.position.lerpVectors(camTween.p0, camTween.p1, u); controls.target.lerpVectors(camTween.t0, camTween.t1, u); if (camTween.t >= 1) camTween = null; }
  updateVisuals(dt);
  pInst.visible = EXPL.u < 0.02;
  explodeApply(dt);
  updateAudio(); updateUI(dt); updateCallouts();
  controls.update();
  renderer.render(scene, camera);
}
frame();
setTimeout(() => { const l = $('loading'); l.style.opacity = 0; setTimeout(() => l.remove(), 600); }, 150);
window.__recoevo = { S, P, K, T, D, HP, SAW, SACKS, EXPL, bag, focusPart, clearGhost, hatch, toggleHatch, dropPortion, addDays, actLid, actLatch, actDoor, actDrawer, actBag, autoSack, grabBag, scaleReading, sealed, heapUncovered, setMode, G0, THREE, openLid, closeLid, autoRefill, scene, camera, renderer, controls };
