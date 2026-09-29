
// =====================================================================
//  CONSTRUCCIÓN — TRANSMISIÓN, COMPUERTA, PEDALES, SEGUROS, INDICADOR
// =====================================================================
// Fase de engrane: devuelve el ángulo inicial para que un diente de la rueda 1 quede
// enfrentado a un hueco de la rueda 2 sobre la línea de centros.
// Con extrudeX, un punto de la forma a ángulo a queda en (z=-cos a, y=sin a) y girar +x aumenta a.
const shapeAngle = (dz, dy) => Math.atan2(dy, -dz);
const TOOTH0 = 0.43; // fracción de paso donde está el centro del diente en gearShape
function meshPhase(N1, N2, c1, c2) {
  const au = shapeAngle(c2.z - c1.z, c2.y - c1.y);
  const p1 = au - TOOTH0 / N1 * TAU;
  const p2 = (au + Math.PI) - (TOOTH0 + 0.5) / N2 * TAU;
  return [p1, p2];
}
const TR = {}; // piezas móviles de la transmisión
{
  const R = D.roll, xs = 0.2, xC = 0.214, xFly = 0.236, xSp = 0.252;
  const cF = { y: R.y, z: R.z }, cR = { y: R.y, z: -R.z }, cB = { y: T.yB, z: T.zB }, cA = { y: T.yA, z: T.zA };
  // engranajes de sincronización 1:1 (24 dientes)
  const sync = gearGeo(R.z, 24, 0.008, 0.0045, 0);
  TR.syncF = mesh(sync, M.steel); TR.syncR = mesh(sync, M.steel);
  TR.syncF.position.set(xs, R.y, R.z); TR.syncR.position.set(xs, R.y, -R.z);
  [TR.syncF, TR.syncR].forEach(m => machine.add(tag(m, info('sincro'))));
  [TR.phF, TR.phR] = meshPhase(24, 24, cF, cR);
  // corona del reductor (50 dientes) en el eje del rodillo delantero + piñón (10) en el eje del volante
  TR.gearC = mesh(gearGeo(T.RC, 50, 0.009, 0.0045, 5), M.brass); TR.gearC.position.set(xC, R.y, R.z); machine.add(tag(TR.gearC, info('corona')));
  TR.pinB = mesh(gearGeo(T.rPB, 10, 0.011, 0.004), M.steel); TR.pinB.position.set(xC, T.yB, T.zB); machine.add(tag(TR.pinB, info('pinonB')));
  [TR.phPB, TR.phC] = meshPhase(10, 50, cB, cF);
  // eje del volante (B) y volante de inercia
  machine.add(tag(cylX(0.0055, 0.06, M.steel, 16, 0.227, T.yB, T.zB), info('ejeB')));
  {
    const fw = new THREE.Group(); fw.position.set(xFly, T.yB, T.zB);
    const rimG = new THREE.TorusGeometry(0.063, 0.008, 12, 64); rimG.rotateY(Math.PI / 2);
    fw.add(mesh(rimG, M.castIron));
    fw.add(cylX(0.058, 0.004, M.castIron, 64));
    fw.add(cylX(0.013, 0.02, M.castIron, 24));
    const mark = box(0.0025, 0.02, 0.004, M.orange, 0, 0.004, 0.045, 0); fw.add(mark); // marca para ver el giro
    tag(fw, info('volante')); machine.add(fw); TR.fly = fw;
  }
  // zapata de freno (actúa sobre la llanta del volante al soltar el gancho)
  TR.brake = new THREE.Group(); TR.brake.position.set(xFly, T.yB + 0.078, T.zB);
  TR.brake.add(box(0.012, 0.006, 0.04, M.rubber, 0.002, 0, 0, 0), box(0.004, 0.03, 0.01, M.steel, 0, 0.008, 0.015, 0));
  machine.add(tag(TR.brake, info('freno')));
  { const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0.03, 0.596, 0.198), new THREE.Vector3(0.12, 0.58, 0.19), new THREE.Vector3(0.186, 0.56, 0.12), new THREE.Vector3(0.2, 0.53, 0.09), new THREE.Vector3(0.236, 0.51, T.zB + 0.01)]);
    machine.add(tag(mesh(new THREE.TubeGeometry(c, 40, 0.0022, 8), M.blackSteel), info('cableFreno'))); }
  // piñones de cadena 24 / 8 dientes y cadena de 1/2"
  TR.spB = mesh(sprocketGeo(T.rB, 8, 0.004), M.blackSteel); TR.spB.position.set(xSp, T.yB, T.zB); machine.add(tag(TR.spB, info('pinonCadena')));
  TR.spA = mesh(sprocketGeo(T.RA, 24, 0.004), M.blackSteel); TR.spA.position.set(xSp, T.yA, T.zA); machine.add(tag(TR.spA, info('catalina')));
  machine.add(tag(cylX(0.0055, 0.07, M.steel, 16, 0.225, T.yA, T.zA), info('ejeA')));
  // piñón de la cremallera con rueda libre (buje de bronce con trinquetes)
  TR.pinA = mesh(gearGeo(T.rPin, 10, 0.012, 0.004), M.steel); TR.pinA.position.set(xC, T.yA, T.zA); machine.add(tag(TR.pinA, info('ruedaLibre')));
  { // rueda de trinquete fija al eje A (gira con la cadena) + 2 uñas con resorte montadas en el piñón
    const rs = new THREE.Shape(), n = 12, r0 = 0.0085, r1 = 0.0112;
    for (let i = 0; i < n; i++) { const a0 = i / n * TAU, a1 = (i + 1) / n * TAU; const p0 = [Math.cos(a0) * r0, Math.sin(a0) * r0], p1 = [Math.cos(a1 - 0.02) * r1, Math.sin(a1 - 0.02) * r1], p2 = [Math.cos(a1) * r0, Math.sin(a1) * r0]; i ? rs.lineTo(...p0) : rs.moveTo(...p0); rs.lineTo(...p1); rs.lineTo(...p2); }
    const hh = new THREE.Path(); hh.absarc(0, 0, 0.0045, 0, TAU, true); rs.holes.push(hh);
    TR.ratchet = mesh(extrudeX(rs, 0.006, 0.0003), M.zinc); TR.ratchet.position.set(xC + 0.011, T.yA, T.zA); machine.add(tag(TR.ratchet, info('trinqueteRueda')));
    TR.pawls = new THREE.Group(); TR.pawls.position.set(xC + 0.011, T.yA, T.zA);
    const ring = new THREE.TorusGeometry(0.0155, 0.0018, 8, 40); ring.rotateY(Math.PI / 2); TR.pawls.add(mesh(ring, M.brass));
    TR.pawlArms = [0, Math.PI].map(a => { const pg = new THREE.Group(); pg.rotation.x = a; const arm = box(0.005, 0.0022, 0.009, M.red, 0.0006, 0, 0.0128, -0.003); pg.add(arm); TR.pawls.add(pg); return arm; });
    TR.pawls.add(box(0.004, 0.028, 0.004, M.brass, 0.001, -0.005, 0, 0));
    machine.add(tag(TR.pawls, info('ruedaLibre')));
  }
  // soporte de ejes (platina en el carter)
  for (const y of [T.yA, T.yB]) { machine.add(tag(box(0.006, 0.03, 0.03, M.blackSteel, 0.003, D.carter.x1 - 0.006, y, T.zA), info('platina'))); machine.add(tag(cylX(0.009, 0.008, M.brass, 20, D.carter.x1 - 0.011, y, T.zA), info('bocin'))); }
  // cadena: recorrido cerrado alrededor de los dos piñones
  {
    const r1 = T.RA, r2 = T.rB, dist = T.yB - T.yA, beta = Math.asin((r1 - r2) / dist);
    // puntos en el plano (z, y). Parámetro s en metros.
    const segs = [];
    const arc = (cy, r, a0, a1) => ({ L: Math.abs(a1 - a0) * r, p: (t) => { const a = a0 + (a1 - a0) * t; return [T.zA + Math.cos(a) * r, cy + Math.sin(a) * r, a1 > a0 ? a + Math.PI / 2 : a - Math.PI / 2]; } });
    const line = (p, q) => ({ L: Math.hypot(q[0] - p[0], q[1] - p[1]), p: (t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t), Math.atan2(q[1] - p[1], q[0] - p[0])] });
    // lado frontal (+z) sube, atrás baja (giro positivo de las ruedas)
    const aF = beta, aB = Math.PI - beta;
    const pA1 = [T.zA + Math.cos(aF) * r1, T.yA + Math.sin(aF) * r1], pB1 = [T.zA + Math.cos(aF) * r2, T.yB + Math.sin(aF) * r2];
    const pB2 = [T.zA + Math.cos(aB) * r2, T.yB + Math.sin(aB) * r2], pA2 = [T.zA + Math.cos(aB) * r1, T.yA + Math.sin(aB) * r1];
    segs.push(line(pA1, pB1), arc(T.yB, r2, aF, aB), line(pB2, pA2), arc(T.yA, r1, aB, aF + TAU));
    const total = segs.reduce((a, s) => a + s.L, 0);
    TR.chainAt = (s) => { s = ((s % total) + total) % total; for (const sg of segs) { if (s <= sg.L) return sg.p(s / sg.L); s -= sg.L; } return segs[0].p(0); };
    TR.chainLen = total;
    const n = Math.round(total / 0.0127); TR.chainPitch = total / n;
    const lg = new RoundedBoxGeometry(0.0085, 0.0048, 0.0138, 2, 0.0018);
    TR.chain = new THREE.InstancedMesh(lg, M.chain, n); TR.chain.castShadow = true; TR.chain.frustumCulled = false; machine.add(tag(TR.chain, info('cadena')));
    TR.chainPins = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0019, 0.0019, 0.0105, 8).rotateZ(Math.PI / 2), M.zinc, n); TR.chainPins.frustumCulled = false; machine.add(tag(TR.chainPins, info('cadena')));
    TR.chainN = n; TR.chainX = xSp;
  }
  // ---- PEDAL DERECHO: palanca con pivote atrás; se pisa adelante ----
  TR.pedR = new THREE.Group(); TR.pedR.position.set(T.xR, T.pivY, T.pivZ); machine.add(TR.pedR);
  {
    const arm = box(0.012, 0.012, T.armPad - 0.03, M.blackSteel, 0.002, 0, 0, (T.armPad - 0.03) / 2); TR.pedR.add(tag(arm, info('pedalR')));
    const pad = new THREE.Group(); pad.position.set(-0.002, 0.006, T.armPad);
    pad.add(box(0.07, 0.012, 0.085, M.rubber, 0.004, 0, 0, 0));
    for (let i = 0; i < 6; i++) pad.add(box(0.064, 0.003, 0.006, M.rubber, 0.001, 0, 0.007, -0.034 + i * 0.0136));
    TR.pedR.add(tag(pad, info('pedalR')));
    TR.pedR.add(tag(cylX(0.009, 0.03, M.brass, 20, 0, 0, 0), info('pedalR')));
    machine.add(tag(box(0.03, 0.02, 0.02, M.blackSteel, 0.002, T.xR, T.pivY - 0.004, T.pivZ), info('pedalR')));
  }
  // cremallera vertical (sube y baja con el pedal) y su guía
  TR.rack = new THREE.Group(); machine.add(TR.rack);
  {
    const Lr = 0.17; TR.rack.add(box(0.01, Lr, 0.006, M.steel, 0.001, 0, Lr / 2, 0.0054));
    const pitch = TAU * T.rPin / 10; TR.rackPitch = pitch;
    const tg = [];
    for (let y = 0.004; y < Lr; y += pitch) { const tt = new THREE.BoxGeometry(0.01, pitch * 0.45, 0.0048); tt.translate(0, y, 0); tg.push(tt); }
    TR.rack.add(mesh(mergeGeometries(tg), M.steel));
    tag(TR.rack, info('cremallera'));
    machine.add(tag(box(0.018, 0.02, 0.016, M.blackSteel, 0.002, 0.214, 0.235, T.zRack + 0.004), info('cremallera')));
    TR.rackLink = rod(0.0025, M.zinc); machine.add(tag(TR.rackLink, info('cremallera')));
  }
  // resorte de retorno (tracción) y fuelle de extracción
  { const ts = mesh(springGeo(0.011, 0.0014, 6), M.zinc); ts.scale.y = 0.02; ts.rotation.z = -Math.PI / 2; ts.position.set(T.xR + 0.008, T.pivY, T.pivZ); machine.add(tag(ts, info('retorno'))); TR.retSpring = ts;
    TR.retLeg = rod(0.0014, M.zinc); machine.add(tag(TR.retLeg, info('retorno'))); }
  {
    const pts = []; for (let i = 0; i <= 14; i++) pts.push(new THREE.Vector2(i % 2 ? 0.02 : 0.016, i / 14));
    TR.bellows = mesh(new THREE.LatheGeometry(pts, 28), M.rubber); machine.add(tag(TR.bellows, info('fuelle')));
    machine.add(tag(box(0.05, 0.004, 0.05, M.blackSteel, 0.001, T.xR, 0.112, -0.05), info('fuelle')));
    const hose = new THREE.CatmullRomCurve3([new THREE.Vector3(T.xR, 0.114, -0.05), new THREE.Vector3(T.xR, 0.2, -0.12), new THREE.Vector3(0.21, 0.36, -0.178), new THREE.Vector3(0.12, 0.395, -0.176), new THREE.Vector3(0.07, 0.4, -0.174)]);
    machine.add(tag(mesh(new THREE.TubeGeometry(hose, 40, 0.005, 10), M.rubber), info('manguera')));
    machine.add(tag(box(0.05, 0.03, 0.035, M.ppDark, 0.004, 0.075, 0.4, -0.174), info('colector')));
  }
  // pasador rojo del seguro infantil (entra debajo de la palanca del pedal)
  TR.lockR = cylX(0.0045, 0.03, M.red, 16, 0, 0, 0); machine.add(tag(TR.lockR, info('seguroR')));
  machine.add(tag(box(0.012, 0.02, 0.02, M.blackSteel, 0.002, 0.196, 0.073, 0.178), info('seguroR')));

}
// ---------- PEDAL IZQUIERDO (aserrín) ----------
{
  TR.pedL = new THREE.Group(); TR.pedL.position.set(T.xL, T.pivY, T.pivZ); machine.add(TR.pedL);
  TR.pedL.add(tag(box(0.012, 0.012, T.armPad - 0.03, M.blackSteel, 0.002, 0, 0, (T.armPad - 0.03) / 2), info('pedalL')));
  const pad = new THREE.Group(); pad.position.set(0.002, 0.006, T.armPad);
  pad.add(box(0.05, 0.012, 0.085, M.rubber, 0.004, 0, 0, 0));
  for (let i = 0; i < 6; i++) pad.add(box(0.044, 0.003, 0.006, M.rubber, 0.001, 0, 0.007, -0.034 + i * 0.0136));
  pad.add(box(0.05, 0.004, 0.02, M.wood, 0.001, 0, 0.004, 0.036));
  TR.pedL.add(tag(pad, info('pedalL')));
  TR.pedL.add(tag(cylX(0.009, 0.03, M.brass, 20), info('pedalL')));
  { const ts = mesh(springGeo(0.011, 0.0014, 6), M.zinc); ts.scale.y = 0.02; ts.rotation.z = Math.PI / 2; ts.position.set(T.xL - 0.008, T.pivY, T.pivZ); machine.add(tag(ts, info('retornoL'))); TR.retL = ts; TR.retLegL = rod(0.0014, M.zinc); machine.add(tag(TR.retLegL, info('retornoL'))); }
  TR.doorPlg = [-1, 1].map(s => { const m = cylZ(0.004, 0.016, M.red, 12, s * 0.176, 0.075, 0.176); machine.add(tag(m, info('pulsadorPuerta'))); return m; });
  TR.lockD = cylX(0.0045, 0.03, M.red, 16); machine.add(tag(TR.lockD, info('seguroPuerta')));
  TR.lockDLink = rod(0.0016, M.red); machine.add(tag(TR.lockDLink, info('pulsadorPuerta')));
  TR.lockLLink = rod(0.0016, M.red); machine.add(tag(TR.lockLLink, info('pulsadorPuerta')));
  TR.lockL = cylX(0.0045, 0.028, M.red, 16); machine.add(tag(TR.lockL, info('seguroL')));
}
// ---------- SISTEMA ROJO: seguro infantil (tapa → pulsador → varilla → escuadra → pasador del pedal) ----------
const SAFE = {};
{
  const x = 0.183, z = 0.186;
  SAFE.plunger = cylY(0.004, 0.014, M.red, 12, 0.165, D.frameTop - 0.019, 0.183); machine.add(tag(SAFE.plunger, info('pulsador')));
  SAFE.arm = box(0.02, 0.004, 0.006, M.red, 0.001, 0.174, D.frameTop - 0.026, 0.184); machine.add(tag(SAFE.arm, info('varillaSeguro')));
  SAFE.rod = rod(0.0022, M.red); machine.add(tag(SAFE.rod, info('varillaSeguro')));
  for (const y of [0.55, 0.42, 0.28, 0.15]) machine.add(tag(box(0.01, 0.006, 0.012, M.blackSteel, 0.001, x + 0.003, y, z), info('guiaSeguro')));
  SAFE.crank = new THREE.Group(); SAFE.crank.position.set(0.185, 0.08, 0.178);
  SAFE.crank.add(box(0.004, 0.022, 0.006, M.red, 0.001, 0, 0.011, 0), box(0.018, 0.004, 0.006, M.red, 0.001, 0.009, 0, 0), cylZ(0.003, 0.012, M.steel, 10));
  machine.add(tag(SAFE.crank, info('escuadra')));
}
// ---------- SISTEMA AZUL: báscula de resortes con flecha y lámina de colores (sin engranajes) ----------
// bandeja (baja 1 mm por kg) → alambre → palanca en L estampada (brazo corto 9 mm) cuyo brazo largo ES la flecha → lámina impresa en abanico
const gauge = { P: new THREE.Vector3(0.170, 0.33, 0), a0: 85 * Math.PI / 180, sweep: 80 * Math.PI / 180, arm: 0.009, full: 12.5, zB: 0.172 };
{
  const P = gauge.P, ang = (kg) => -Math.PI / 2 - gauge.a0 + kg / gauge.full * gauge.sweep; // ángulo en la lámina (lienzo)
  const face = canvasTex(1024, 1024, (x, W, H) => {
    const cx = W / 2, cy = H / 2, R = W / 2;
    const band = (a, b, c) => { x.fillStyle = c; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R * 0.99, ang(a), ang(b)); x.closePath(); x.fill(); };
    x.fillStyle = '#f4f4ef'; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R, ang(-0.8), ang(13.3)); x.closePath(); x.fill();
    band(0, 7, '#3f9a4c'); band(7, 10.2, '#e0b02f'); band(10.2, 12.5, '#d2412f');
    x.fillStyle = '#f4f4ef'; x.beginPath(); x.arc(cx, cy, R * 0.56, 0, TAU); x.fill();
    x.strokeStyle = '#fff'; x.fillStyle = '#222'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let k = 0; k <= 12; k++) { const a = ang(k); x.lineWidth = 6; x.beginPath(); x.moveTo(cx + Math.cos(a) * R * 0.98, cy + Math.sin(a) * R * 0.98); x.lineTo(cx + Math.cos(a) * R * (k % 2 ? 0.9 : 0.84), cy + Math.sin(a) * R * (k % 2 ? 0.9 : 0.84)); x.stroke(); if (k % 2 === 0) { x.font = '700 62px Segoe UI, Arial'; x.fillText(k, cx + Math.cos(a) * R * 0.66, cy + Math.sin(a) * R * 0.66); } }
    x.font = '800 44px Segoe UI, Arial'; x.fillStyle = '#fff'; const av = ang(11.35); x.save(); x.translate(cx + Math.cos(av) * R * 0.91, cy + Math.sin(av) * R * 0.91); x.rotate(av + Math.PI / 2); x.fillText('VACIAR', 0, 0); x.restore();
    x.fillStyle = '#555'; x.font = '600 46px Segoe UI, Arial'; x.fillText('kg', cx, cy - R * 0.38);
  });
  const th0 = Math.PI / 2 + gauge.a0 - gauge.sweep - 0.09, thL = gauge.sweep + 0.18;
  const fan = mesh(new THREE.CircleGeometry(0.068, 48, th0, thL), new THREE.MeshStandardMaterial({ map: face, roughness: 0.55 }), false); fan.position.set(P.x, P.y, D.DP / 2 - 0.0045); machine.add(tag(fan, info('lamina')));
  const cover = mesh(new THREE.CircleGeometry(0.068, 48, th0, thL), M.pc, false); cover.position.set(P.x, P.y, D.DP / 2 + 0.0006); machine.add(tag(cover, info('lamina')));
  // flecha = brazo largo de la palanca (62 mm)
  gauge.arrow = new THREE.Group(); gauge.arrow.position.set(P.x, P.y, D.DP / 2 - 0.0028);
  const tri = new THREE.Shape(); tri.moveTo(-0.004, 0.052); tri.lineTo(0, 0.064); tri.lineTo(0.004, 0.052); tri.lineTo(-0.004, 0.052);
  gauge.arrow.add(box(0.0024, 0.054, 0.0012, M.red, 0.0005, 0, 0.026, 0), mesh(new THREE.ShapeGeometry(tri), M.red, false), cylZ(0.004, 0.0025, M.blackSteel, 16));
  machine.add(tag(gauge.arrow, info('flecha')));
  // eje (remache) y brazo corto de 9 mm donde tira el alambre
  machine.add(tag(cylZ(0.0018, D.DP / 2 - gauge.zB, M.steel, 10, P.x, P.y, (D.DP / 2 + gauge.zB) / 2), info('flecha')));
  gauge.inArm = new THREE.Group(); gauge.inArm.position.set(P.x, P.y, gauge.zB); gauge.inArm.add(box(0.013, 0.004, 0.003, M.blue, 0.0008, 0.0045, 0, 0), box(0.004, 0.022, 0.003, M.blue, 0.0008, 0, -0.011, 0));
  machine.add(tag(gauge.inArm, info('palanca')));
  machine.add(tag(box(0.012, 0.03, 0.004, M.blackSteel, 0.001, P.x - 0.012, P.y - 0.006, gauge.zB - 0.004), info('palanca')));
  gauge.push = rod(0.0016, M.blue); machine.add(tag(gauge.push, info('varillaPeso')));
  // la palanca, al pasar el rojo, empuja con su brazo de abajo el trinquete que traba la puerta
  gauge.pawl = new THREE.Group(); gauge.pawl.position.set(0.15, 0.304, 0.172);
  gauge.pawl.add(box(0.014, 0.004, 0.022, M.steel, 0.001, 0, 0, 0.004), box(0.014, 0.008, 0.004, M.steel, 0.001, 0, -0.005, 0.013), cylX(0.0025, 0.018, M.brass, 10));
  machine.add(tag(gauge.pawl, info('trinquete')));
  gauge.tripRod = rod(0.0014, M.blue); machine.add(tag(gauge.tripRod, info('trinquete')));
}
// ---------- DOSIFICADOR DE ASERRÍN EN U (pedal izquierdo → cable → placa de celdas en U) ----------
// El depósito rodea la cámara por atrás y por los dos lados: es el hueco que ya deja el cuerpo rotomoldeado.
const SAW = { cap: 1000, y0: 0.30, y1: 0.626, plateY: 0.2975, travel: 0.015, dose: 6 };
SAW.boxes = [
  { x0: -0.184, x1: 0.184, z0: -0.147, z1: -0.1225, n: 'atrás' },
  { x0: -0.184, x1: -0.1235, z0: -0.1225, z1: 0.115, n: 'izquierda' },
  { x0: 0.1235, x1: 0.184, z0: -0.1225, z1: 0.115, n: 'derecha' },
];
{
  const H = SAW.y1 - SAW.y0, yc = (SAW.y0 + SAW.y1) / 2; SAW.fills = [];
  for (const b of SAW.boxes) {
    const w = b.x1 - b.x0, d = b.z1 - b.z0, xc = (b.x0 + b.x1) / 2, zc = (b.z0 + b.z1) / 2;
    const ws = [box(w, H, 0.0015, M.ppClear, 0, xc, yc, b.z0), box(w, H, 0.0015, M.ppClear, 0, xc, yc, b.z1), box(0.0015, H, d, M.ppClear, 0, b.x0, yc, zc), box(0.0015, H, d, M.ppClear, 0, b.x1, yc, zc)];
    ws.forEach(m => { m.castShadow = false; machine.add(tag(m, info('deposito'))); });
    const f = box(w - 0.004, 1, d - 0.004, M.wood, 0.001, xc, 0, zc); f.castShadow = false; machine.add(tag(f, info('aserrinDep'))); SAW.fills.push(f);
  }
  // camisas por donde los ejes de los rodillos atraviesan los depósitos laterales
  for (const sx of [-1, 1]) for (const z of [D.roll.z, -D.roll.z]) machine.add(tag(cylX(0.012, 0.06, M.ppDark, 16, sx * 0.154, D.roll.y, z), info('camisa')));
  // placa dosificadora en U con celdas (se desliza 15 mm hacia el frente)
  SAW.plate = new THREE.Group(); machine.add(SAW.plate);
  const pm = M.zinc, cells = [];
  SAW.plate.add(box(0.37, 0.002, 0.03, pm, 0.0006, 0, SAW.plateY, -0.1335), box(0.066, 0.002, 0.24, pm, 0.0006, -0.154, SAW.plateY, -0.005), box(0.066, 0.002, 0.24, pm, 0.0006, 0.154, SAW.plateY, -0.005));
  for (let x = -0.15; x <= 0.1501; x += 0.03) cells.push([x, -0.1335]);
  for (let z = -0.105; z <= 0.1051; z += 0.03) { cells.push([-0.154, z]); cells.push([0.154, z]); }
  const cg = []; for (const [x, z] of cells) { const g1 = new THREE.CylinderGeometry(0.0075, 0.0075, 0.0025, 16); g1.translate(x, SAW.plateY, z); cg.push(g1); }
  SAW.plate.add(mesh(mergeGeometries(cg), M.wood)); SAW.cells = cells;
  SAW.plate.add(box(0.01, 0.004, 0.02, M.steel, 0.001, -0.178, SAW.plateY + 0.002, 0.115));
  tag(SAW.plate, info('placaDosif'));
  // ranuras del piso con labios que lanzan la dosis hacia el centro
  for (const [x, z, w, d] of [[0, -0.1335, 0.33, 0.012], [-0.154, -0.005, 0.012, 0.23], [0.154, -0.005, 0.012, 0.23]]) machine.add(tag(box(w, 0.0015, d, M.blackSteel, 0, x, 0.2915, z), info('ranuraAserrin')));
  SAW.spring = mesh(springGeo(0.004, 0.0008, 12), M.zinc); SAW.spring.rotation.x = -Math.PI / 2; machine.add(tag(SAW.spring, info('retornoPlaca')));
  // cable desde el pedal izquierdo, polea y guía
  SAW.pulley = cylX(0.011, 0.006, M.brass, 24, -0.205, 0.30, 0.172); machine.add(tag(SAW.pulley, info('polea')));
  SAW.cableV = rod(0.0012, M.blackSteel); SAW.cableH = rod(0.0012, M.blackSteel); machine.add(tag(SAW.cableV, info('cable')), tag(SAW.cableH, info('cable')));
}
// ---------- COLUMNA DE OLORES: puerto → carbón activado → fuelle → válvula de una vía ----------
{
  machine.add(tag(box(0.12, 0.06, 0.045, M.carbon, 0.004, 0, 0.43, -0.174), info('carbon')));
  const lbl = canvasTex(256, 128, (x, W, H) => { x.fillStyle = '#1b1c1d'; x.fillRect(0, 0, W, H); x.fillStyle = '#9fd3a6'; x.font = '600 26px Segoe UI'; x.fillText('CARBÓN ACTIVADO', 14, 50); x.fillStyle = '#ccc'; x.font = '22px Segoe UI'; x.fillText('250 g · cambio c/6 meses', 14, 92); });
  const lm = mesh(new THREE.PlaneGeometry(0.1, 0.05), new THREE.MeshStandardMaterial({ map: lbl }), false); lm.position.set(0, 0.43, -0.1512); machine.add(tag(lm, info('carbon')));
  machine.add(tag(cylZ(0.016, 0.012, M.ppDark, 24, 0, 0.62, -D.DP / 2 - 0.004), info('valvula')));
  const flap = cylZ(0.011, 0.002, M.epdm, 24, 0, 0.62, -D.DP / 2 - 0.011); machine.add(tag(flap, info('valvula'))); SAW.valveFlap = flap;
  // rejilla de aspiración atrás del compartimento del cajón, justo encima de la bolsa (ahí se junta el olor)
  { const gr = canvasTex(256, 128, (x, W, H) => { x.fillStyle = '#252d28'; x.fillRect(0, 0, W, H); x.fillStyle = '#0c0f0d'; for (let i = 0; i < 9; i++) x.fillRect(14 + i * 26, 18, 14, H - 36); });
    const g1 = mesh(new THREE.PlaneGeometry(0.12, 0.022), new THREE.MeshStandardMaterial({ map: gr, roughness: 0.7 }), false); g1.position.set(0, 0.279, -0.1455); machine.add(tag(g1, info('puerto')));
    machine.add(tag(box(0.13, 0.03, 0.02, M.ppDark, 0.003, 0, 0.279, -0.157), info('puerto'))); }
  const duct1 = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.279, -0.165), new THREE.Vector3(0, 0.3, -0.174), new THREE.Vector3(0, 0.35, -0.175), new THREE.Vector3(0, 0.398, -0.174)]);
  machine.add(tag(mesh(new THREE.TubeGeometry(duct1, 30, 0.008, 10), M.ppDark), info('ductoOlor')));
  const duct2 = new THREE.CatmullRomCurve3([new THREE.Vector3(0.02, 0.46, -0.176), new THREE.Vector3(0.01, 0.54, -0.18), new THREE.Vector3(0, 0.605, -0.19), new THREE.Vector3(0, 0.62, -0.2)]);
  machine.add(tag(mesh(new THREE.TubeGeometry(duct2, 20, 0.009, 10), M.ppDark), info('valvula')));
}
// ---------- Rótulos de los pedales y del carter ----------
{
  const decal = (w, h, draw, x, y, z, rx = -Math.PI / 2, ry = 0) => {
    const t = canvasTex(Math.round(w * 4000), Math.round(h * 4000), draw);
    const m = mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, transparent: true, depthWrite: false, roughness: 0.6 }), false);
    m.rotation.set(rx, ry, 0); m.position.set(x, y, z); machine.add(m); return m;
  };
  const lbl = (txt, sub, col) => (x, W, H) => { x.clearRect(0, 0, W, H); x.fillStyle = col; x.font = `700 ${Math.min(H * 0.42, W / txt.length * 1.5)}px Segoe UI, Arial`; x.textAlign = 'center'; x.fillText(txt, W / 2, H * 0.5); x.fillStyle = 'rgba(244,248,241,.8)'; x.font = `${H * 0.26}px Segoe UI, Arial`; x.fillText(sub, W / 2, H * 0.88); };
  decal(0.066, 0.019, lbl('TRITURAR', 'pedal derecho', '#f4f8f1'), 0.226, 0.135, D.DP / 2 + 0.0008, 0);
  decal(0.042, 0.019, lbl('ASERRÍN', 'pedal izq.', '#f1d9a8'), -0.212, 0.135, D.DP / 2 + 0.0008, 0);
  // rejilla de ventilación y advertencia en la tapa del carter
  decal(0.16, 0.06, (x, W, H) => { x.clearRect(0, 0, W, H); x.fillStyle = '#e0b02f'; x.beginPath(); x.moveTo(70, 20); x.lineTo(130, 125); x.lineTo(10, 125); x.closePath(); x.fill(); x.fillStyle = '#222'; x.font = '700 70px Arial'; x.fillText('!', 58, 115);
    x.fillStyle = 'rgba(244,248,241,.92)'; x.font = '600 34px Segoe UI, Arial'; x.fillText('Transmisión a pedal', 160, 62); x.font = '28px Segoe UI, Arial'; x.fillText('No introducir los dedos', 160, 108); }, D.carter.x1 + 0.0008, 0.2, 0.1, 0, Math.PI / 2);
}
