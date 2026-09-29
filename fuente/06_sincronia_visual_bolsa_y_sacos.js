
// =====================================================================
//  SINCRONÍA VISUAL: cada pieza toma su posición del estado físico
// =====================================================================
const _pa = new THREE.Vector3(), _pb = new THREE.Vector3(), _pc = new THREE.Vector3(), _pd = new THREE.Vector3();
const alphaOf = (s) => Math.asin(clamp((T.restH - s) / T.armPad, -1, 1)); // ángulo de la palanca del pedal
const leverY = (a, z) => T.pivY + (z - T.pivZ) * Math.sin(a);
TR.phA = 0.18;
const xTare = () => (D.tray.m + tareKg) * g / K.kTray;
function updateVisuals(dt) {
  // --- tapa y gancho ---
  lid.pivot.rotation.x = -S.th;
  latch.pivot.rotation.x = -1.9 * (1 - S.lat);
  latchAttach(S.lat, _pa);
  if (S.engaged) unaPos(S.th, _pb); else _pb.copy(_pa).add(_pc.set(0, S.lat > 0.5 ? 0.058 : 0.04, S.lat > 0.5 ? 0.01 : 0.035));
  rodBetween(latch.bailL, _pc.set(-0.018, _pa.y, _pa.z), _pd.set(-0.018, _pb.y, _pb.z));
  rodBetween(latch.bailR, _pc.set(0.018, _pa.y, _pa.z), _pd.set(0.018, _pb.y, _pb.z));
  rodBetween(latch.bailT, _pc.set(-0.019, _pb.y, _pb.z), _pd.set(0.019, _pb.y, _pb.z));
  // --- sistema rojo: el pulsador baja 4 mm solo con la tapa apretada ---
  const dep = sealed() ? 0.004 : (S.th < K.thSeat + 0.003 ? 0.0012 : 0);
  SAFE.plunger.position.y = D.frameTop - 0.019 - dep; SAFE.arm.position.y = D.frameTop - 0.026 - dep;
  rodBetween(SAFE.rod, _pa.set(0.183, 0.1, 0.186), _pb.set(0.183, D.frameTop - 0.026 - dep, 0.186));
  SAFE.crank.rotation.z = -0.35 * (1 - S.lockR);
  TR.lockR.position.set(lerp(0.196, 0.229, S.lockR), 0.0745, 0.175);
  // --- pedal derecho, cremallera, resorte, fuelle ---
  const aR = alphaOf(S.sR); TR.pedR.rotation.x = -aR;
  const yAtt = leverY(aR, T.zRack);
  TR.rack.position.set(0.214, yAtt + 0.012, T.zRack);
  rodBetween(TR.rackLink, _pa.set(T.xR - 0.006, yAtt, T.zRack), _pb.set(0.214, yAtt + 0.014, T.zRack));
  rodBetween(TR.retLeg, _pa.set(T.xR + 0.012, T.pivY + 0.011, T.pivZ), _pb.set(T.xR + 0.006, leverY(aR, T.pivZ + 0.05) + 0.006, T.pivZ + 0.05));
  TR.lockD.position.set(lerp(0.196, 0.229, S.lockD), 0.0775, 0.19);
  TR.doorPlg.forEach(m => m.position.z = 0.176 + 0.008 * S.lockD);
  rodBetween(TR.lockDLink, _pa.set(0.176, 0.075, 0.178 + 0.008 * S.lockD), _pb.set(0.19, 0.0775, 0.19));
  rodBetween(TR.lockLLink, _pa.set(-0.176, 0.075, 0.178 + 0.008 * S.lockD), _pb.set(-0.19, 0.0745, 0.175));
  const yBl = leverY(aR, -0.05) + 0.006; TR.bellows.position.set(T.xR, yBl, -0.05); TR.bellows.scale.y = 0.110 - yBl;
  SAW.valveFlap.position.z = -D.DP / 2 - 0.011 - (S.vR < -0.02 ? 0.003 : 0); // la membrana se abre cuando el fuelle expulsa
  // --- tren de engranajes y cadena ---
  const rC = S.thB / T.red;
  TR.pinA.rotation.x = TR.phA + S.thPin; TR.ratchet.rotation.x = S.thB / 3; TR.pawls.rotation.x = S.thPin;
  { const pitch = TAU / 12, rel = (((S.thPin - S.thB / 3) % pitch) + pitch) % pitch; TR.pawlArms.forEach(a => a.rotation.x = S.engagedFW ? 0 : 0.3 * rel / pitch); }
  TR.spA.rotation.x = S.thB / 3; TR.spB.rotation.x = S.thB; TR.fly.rotation.x = S.thB;
  TR.pinB.rotation.x = TR.phPB + S.thB; TR.gearC.rotation.x = TR.phC - rC;
  rollF.rotation.x = -rC; rollR.rotation.x = rC;
  TR.syncF.rotation.x = TR.phF - rC; TR.syncR.rotation.x = TR.phR + rC;
  TR.brake.position.y = T.yB + (S.lat < 0.85 ? 0.0745 : 0.079);
  const s0 = -S.thB * (8 * 0.0127 / TAU);
  for (let i = 0; i < TR.chainN; i++) {
    let [z, y, a] = TR.chainAt(s0 + i * TR.chainPitch);
    _q.setFromAxisAngle(_p3.set(1, 0, 0), -a); _m4.compose(_pa.set(TR.chainX + (i % 2 ? 0.0012 : -0.0012), y, z), _q, _s3.set(i % 2 ? 1 : 0.8, 1, 1)); TR.chain.setMatrixAt(i, _m4);
    [z, y] = TR.chainAt(s0 + (i + 0.5) * TR.chainPitch); _m4.compose(_pa.set(TR.chainX, y, z), _q.identity(), _s3.set(1, 1, 1)); TR.chainPins.setMatrixAt(i, _m4);
  }
  TR.chain.instanceMatrix.needsUpdate = true; TR.chainPins.instanceMatrix.needsUpdate = true;
  // --- pedal izquierdo → cable → placa dosificadora de aserrín ---
  const aL = alphaOf(S.sL); TR.pedL.rotation.x = -aL;
  rodBetween(TR.retLegL, _pa.set(T.xL - 0.012, T.pivY + 0.011, T.pivZ), _pb.set(T.xL - 0.006, leverY(aL, T.pivZ + 0.05) + 0.006, T.pivZ + 0.05));
  TR.lockL.position.set(lerp(-0.196, -0.215, S.lockL), 0.0745, 0.175);
  SAW.plate.position.z = S.saw * SAW.travel;
  const yc = leverY(aL, 0.15) + 0.004;
  rodBetween(SAW.cableV, _pa.set(-0.2, yc, 0.183), _pb.set(-0.2, 0.30, 0.183));
  rodBetween(SAW.cableH, _pa.set(-0.2, 0.311, 0.172), _pb.set(-0.178, SAW.plateY + 0.002, 0.125 + S.saw * SAW.travel));
  SAW.spring.position.set(-0.17, SAW.plateY + 0.002, -0.147 + S.saw * SAW.travel); SAW.spring.scale.y = 0.03 + (1 - S.saw) * 0.0;
  const lvl = clamp(S.sawG / SAW.cap, 0, 1), fh = Math.max(0.001, lvl * (SAW.y1 - SAW.y0 - 0.01));
  SAW.fills.forEach(f => { f.scale.y = fh; f.position.y = SAW.y0 + 0.002 + fh / 2; f.visible = lvl > 0.005; });
  { // tapa del aserrín: gira sobre su borde trasero (resorte-amortiguador hacia el ángulo pedido); no puede atravesar la tapa principal
    const lim = S.th > 1.2 ? 1.35 : 0; const tgt = Math.min(hatch.aT, lim);
    hatch.w += (40 * (tgt - hatch.a) - 9 * hatch.w) * dt; hatch.a = clamp(hatch.a + hatch.w * dt, 0, 1.35); if (hatch.a <= 0 && hatch.w < 0) hatch.w = 0;
    if (S.th < 1.2 && hatch.a > 0.02) { S.th = Math.max(S.th, 1.2); } // la tapa principal choca con la de recarga: no puede cerrarse encima
    hatch.grp.rotation.x = -hatch.a;
    if (hatch.pour > 0) { hatch.pour -= dt; S.sawG = Math.min(SAW.cap, S.sawG + (SAW.cap / 1.6) * dt); if (Math.random() < 0.9) for (let k = 0; k < 3; k++) { const side = Math.floor(Math.random() * 3); const x = side === 0 ? (Math.random() - 0.5) * 0.3 : (side === 1 ? -0.154 : 0.154), z = side === 0 ? -0.135 : -0.1 + Math.random() * 0.2; const p = spawn('aserrin', x, 0.78 + Math.random() * 0.05, z, 0.003, 0, 0, 0, -0.5, 0); if (p) p.refill = true; } }
  }
  // --- puerta, cajón, báscula ---
  door.pivot.rotation.x = S.de;
  const tt = trayTop(); tray.grp.position.y = tt - 0.003;
  tray.springs.forEach(s => s.scale.y = (tt - 0.006) - D.baseTop);
  drawer.grp.position.set(0, drawerY(S.e), D.dr.z0 + D.dr.d / 2 + S.e);
  // --- sistema azul: bandeja → alambre → palanca en L cuyo brazo largo es la flecha ---
  const dRel = Math.max(-0.001, S.x - xTare());                  // cuánto bajó la bandeja por el contenido (1 mm por kg)
  const th = clamp(dRel / gauge.arm, -0.02, gauge.sweep * 1.03);  // giro de la palanca: el alambre tira del brazo de 9 mm
  gauge.arrow.rotation.z = gauge.a0 - th; gauge.inArm.rotation.z = -th;
  rodBetween(gauge.push, _pa.set(0.179, tt + 0.002, 0.165), _pb.set(gauge.P.x + gauge.arm * Math.cos(-th), gauge.P.y + gauge.arm * Math.sin(-th), gauge.zB));
  const lowEnd = _pc.set(gauge.P.x + 0.022 * Math.sin(th), gauge.P.y - 0.022 * Math.cos(th), gauge.zB);
  rodBetween(gauge.tripRod, lowEnd, _pd.set(0.154, 0.31, 0.176));
  gauge.pawl.rotation.x = S.doorLatched ? 0 : -0.5;
  updateBag(dt); updateSacks(dt);
  heapUpdateMesh();
  drawParticles();
  updateSeals();
  updateOdor(dt);
}
// ---------- Bolsa: se cierra con su cordón al tomarla ----------
function bagShape(c, lift) {
  const pos = bag.side.geometry.attributes.position, b = bag.side.userData.base;
  for (let i = 0; i < pos.count; i++) {
    const x = b[i * 3], y = b[i * 3 + 1], z = b[i * 3 + 2], f = (y - 0.006) / bag.bh, k = f > 0.5 ? (f - 0.5) / 0.5 : 0, sq = 1 - c * k * 0.93;
    pos.setXYZ(i, x * sq, y + c * 0.07 * k * k, z * sq);
  }
  pos.needsUpdate = true; bag.side.geometry.computeVertexNormals();
  bag.rim.scale.set(1 - c * 0.93, 1, 1 - c * 0.93); bag.rim.position.y = D.dr.h + 0.001 + c * 0.07;
  bag.cord.scale.copy(bag.rim.scale); bag.cord.position.y = D.dr.h - 0.004 + c * 0.07;
  bag.grp.position.y = lift;
}
function updateBag(dt) {
  if (bag.state === 'inserting') {
    bag.t += dt; bag.grp.visible = true; const d = 1 - smooth(0, 1.1, bag.t);
    bagShape(d * 0.7, d * 0.3);
    if (bag.t > 1.15) { bag.state = 'in'; bagShape(0, 0); toast('Bolsa nueva puesta: el borde elástico encaja en la ranura del reborde del cajón.'); }
  }
}
// ---------- Sacos llenos: se toman con la mano y caen al piso con gravedad ----------
const SACKS = [];
const M_SACK = new THREE.MeshPhysicalMaterial({ color: 0x4a7a31, roughness: 0.5, bumpMap: wrinkle, bumpScale: 1.4, clearcoat: 0.4, clearcoatRoughness: 0.3, sheen: 0.15, sheenColor: 0xcfe8b0 });
function sackGeo(fill, cinch) { // saco de 20 L: base plana, hombros redondos y cuello fruncido por el cordón
  const H = 0.16 + 0.17 * fill, R0 = 0.13 + 0.025 * fill, pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24; let r;
    if (t < 0.08) r = R0 * (0.82 + 0.18 * Math.sin(t / 0.08 * Math.PI / 2));
    else if (t < 0.62) r = R0 * (1 - 0.04 * Math.sin((t - 0.08) / 0.54 * Math.PI));
    else if (t < 0.9) { const u = (t - 0.62) / 0.28; r = lerp(R0, 0.022, Math.pow(u, 0.8 + 0.6 * cinch)); }
    else r = lerp(0.022, 0.03, (t - 0.9) / 0.1);
    pts.push(new THREE.Vector2(Math.max(0.012, r), t * H));
  }
  const g2 = new THREE.LatheGeometry(pts, 40), pos = g2.attributes.position, uv = g2.attributes.uv;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), t = y / H, a = Math.atan2(z, x); const fold = 1 + (0.07 * Math.sin(a * 9) + 0.03 * Math.sin(a * 17 + 1)) * smooth(0.55, 0.9, t) + 0.015 * Math.sin(a * 5 + t * 9) * (1 - t); pos.setXYZ(i, x * fold, y, z * fold); uv.setXY(i, uv.getX(i) * 5, uv.getY(i) * 2.5); }
  g2.computeVertexNormals(); return [g2, H];
}
function grabBag(hitPoint) {
  if (bag.state !== 'in' || S.e < 0.24) return null;
  const fill = clamp(S.bagMass / 11, 0.05, 1), [geo, H] = sackGeo(fill, 1);
  const grp = new THREE.Group(), m = mesh(geo, M_SACK); grp.add(m);
  const knot = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.004, 8, 16), M.cord); knot.position.y = H + 0.01; knot.rotation.x = Math.PI / 2; grp.add(knot);
  const cords = [0, 1].map(k => { const c = rod(0.0015, M.cord); c.position.set(k ? 0.012 : -0.012, H + 0.03, 0); c.scale.y = 0.05; c.rotation.z = k ? -0.5 : 0.5; grp.add(c); return c; });
  drawer.grp.getWorldPosition(_pa); grp.position.set(_pa.x, _pa.y + 0.02, _pa.z);
  const sk = { grp, x: _pa.x, y: _pa.y + 0.02, z: _pa.z, vx: 0, vy: 0, vz: 0, held: true, m: S.bagMass, H, R: 0.14 + 0.025 * fill, tx: _pa.x, ty: _pa.y + 0.25, tz: _pa.z };
  tag(grp, info('saco')); grp.traverse(o => { if (o.isMesh) o.userData.sack = sk; }); machine.add(grp); SACKS.push(sk);
  toast(`Tiras del cordón: la bolsa se cierra sola y la levantas (${fmt(S.bagMass)} kg). Suéltala en el piso, al lado del equipo.`);
  heapReset(); bag.state = 'none'; bag.grp.visible = false; audioInit(); blip(420, 0.08, 0.08, 'triangle');
  return sk;
}
function updateSacks(dt) {
  const mbx0 = D.chanL.x0 - 0.005, mbx1 = D.carter.x1 + 0.005, mbz0 = -D.DP / 2 - 0.02;
  for (const s of SACKS) {
    if (s.held) { const k = 60, c = 12; s.vx += (k * (s.tx - s.x) - c * s.vx) * dt; s.vy += (k * (s.ty - s.y) - c * s.vy) * dt; s.vz += (k * (s.tz - s.z) - c * s.vz) * dt; }
    else s.vy -= g * dt;
    s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
    if (s.y < 0) { if (s.vy < -1) thud(Math.min(0.5, -s.vy * 0.15), 70); s.y = 0; s.vy = Math.max(0, -s.vy * 0.15); s.vx *= 0.8; s.vz *= 0.8; }
    // no atraviesa el equipo: se empuja fuera de su huella (incluye puerta y cajón abiertos)
    const mbz1 = D.DP / 2 + Math.max(0.03, S.de > 0.3 ? 0.27 : 0, S.e + 0.02);
    if (s.y < 0.66) {
      const px0 = s.x + s.R - mbx0, px1 = mbx1 - (s.x - s.R), pz0 = s.z + s.R - mbz0, pz1 = mbz1 - (s.z - s.R);
      if (px0 > 0 && px1 > 0 && pz0 > 0 && pz1 > 0) { const m = Math.min(px0, px1, pz0, pz1); if (m === px0) { s.x -= px0; s.vx = Math.min(0, s.vx); } else if (m === px1) { s.x += px1; s.vx = Math.max(0, s.vx); } else if (m === pz0) { s.z -= pz0; s.vz = Math.min(0, s.vz); } else { s.z += pz1; s.vz = Math.max(0, s.vz); } }
    }
    for (const o of SACKS) if (o !== s) { const dx = s.x - o.x, dz = s.z - o.z, d = Math.hypot(dx, dz), rr = s.R + o.R; if (d < rr && d > 1e-4 && Math.abs(s.y - o.y) < 0.2) { const p = (rr - d) / 2; s.x += dx / d * p; s.z += dz / d * p; o.x -= dx / d * p; o.z -= dz / d * p; } }
    s.grp.position.set(s.x, s.y, s.z); s.grp.rotation.set(clamp(s.vz * 0.4, -0.4, 0.4), 0, clamp(-s.vx * 0.4, -0.4, 0.4));
  }
}
// ---------- Sellos (resaltado) ----------
const VIEW = { seals: false };
const cG = new THREE.Color(0x1d8a3a), cA = new THREE.Color(0xb07a10), cRd = new THREE.Color(0xb3261e), cK = new THREE.Color(0);
const epdmLid = M.epdm.clone(), epdmDoor = M.epdm.clone();
lid.seal.material = epdmLid; door.pivot.traverse(o => { if (o.isMesh && o.material === M.epdm) o.material = epdmDoor; });
function updateSeals() {
  const on = VIEW.seals;
  epdmLid.emissive.copy(!on ? cK : sealed() ? cG : S.th < K.thSeat + 0.003 ? cA : cRd);
  epdmDoor.emissive.copy(!on ? cK : S.de < 0.01 ? cG : cRd);
}
