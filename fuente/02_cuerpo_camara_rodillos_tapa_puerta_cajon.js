
// =====================================================================
//  CONSTRUCCIÓN — CUERPO, CÁMARA, RODILLOS, TAPA, PUERTA, CAJÓN, BOLSA
// =====================================================================
const machine = new THREE.Group(); scene.add(machine);
const casing = new THREE.Group(); machine.add(casing);
const I = {}; // fichas de información (se completan en p7)
const info = (k) => (I[k] ||= { name: k, desc: '', key: k });

// ---------- Base y patas ----------
{
  const x0 = D.chanL.x0, x1 = D.carter.x1, w = x1 - x0;
  casing.add(tag(box(w, 0.02, D.DP, M.ppDark, 0.006, (x0 + x1) / 2, 0.025, 0), info('base')));
  [[x0 + 0.03, -0.17], [x1 - 0.03, -0.17], [x0 + 0.03, 0.17], [x1 - 0.03, 0.17]].forEach(([x, z]) => machine.add(tag(cylY(0.018, 0.015, M.rubber, 24, x, 0.0075, z), info('patas'))));
}
// ---------- Paredes del cuerpo (PP 3 mm) ----------
{
  const y0 = D.baseTop, y1 = D.frameTop - 0.012, h = y1 - y0, yc = (y0 + y1) / 2, t = D.t;
  casing.add(tag(box(t, h, D.DP, M.pp, 0, -D.W / 2 + t / 2, yc, 0), info('paredIzq')), tag(box(t, h, D.DP, M.pp, 0, D.W / 2 - t / 2, yc, 0), info('paredDer')), tag(box(D.W, h, t, M.pp, 0, 0, yc, -D.DP / 2 + t / 2), info('paredAtras')));
  { const s = new THREE.Shape(); s.moveTo(-D.W / 2, 0.302); s.lineTo(D.W / 2, 0.302); s.lineTo(D.W / 2, y1); s.lineTo(-D.W / 2, y1); s.lineTo(-D.W / 2, 0.302);
    const hole = new THREE.Path(), cx = 0.170, cy = 0.33, a0 = 88 * Math.PI / 180, a1 = 182 * Math.PI / 180; hole.moveTo(cx + Math.cos(a0) * 0.014, cy + Math.sin(a0) * 0.014); hole.absarc(cx, cy, 0.068, a0, a1, false); hole.lineTo(cx + Math.cos(a1) * 0.014, cy + Math.sin(a1) * 0.014); hole.absarc(cx, cy, 0.014, a1, a0, true); s.holes.push(hole);
    const fg = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false }); fg.translate(0, 0, D.DP / 2 - t); casing.add(tag(mesh(fg, M.pp), info('frente'))); }
  const deck = mesh(frameGeo(D.W - 2 * t, D.DP - 2 * t, 0.262, 0.262, 0.004), M.pp); deck.position.y = 0.292; casing.add(tag(deck, info('piso')));
  const top = mesh(frameGeo(D.W, D.DP, D.boca, D.boca, 0.012), M.pp); top.position.y = D.frameTop - 0.012; casing.add(tag(top, info('marco')));
  casing.add(tag(box(D.W - 2 * t, 0.33, t, M.pp, 0, 0, 0.465, -0.149), info('columna')));
  const logo = canvasTex(560, 128, (x, W, H) => { x.clearRect(0, 0, W, H); x.fillStyle = '#f4f8f1'; x.font = '700 70px Segoe UI, Arial'; x.textBaseline = 'middle'; x.fillText('RECOEVO', 20, 62); x.fillStyle = 'rgba(244,248,241,.8)'; x.font = '26px Segoe UI, Arial'; x.fillText('analógico · a pedal', 300, 104); });
  const lg = mesh(new THREE.PlaneGeometry(0.2, 0.046), new THREE.MeshStandardMaterial({ map: logo, transparent: true, alphaTest: 0.35, depthWrite: false, roughness: 0.5 }), false);
  lg.position.set(-0.07, 0.53, D.DP / 2 + 0.0005); casing.add(tag(lg, info('frente')));
}
// ---------- Carter derecho (transmisión) y canal izquierdo ----------
{
  const t = D.t, { x0, x1 } = D.carter, yTop = 0.585, yc = (D.baseTop + yTop) / 2, h = yTop - D.baseTop;
  casing.add(tag(box(t, h, D.DP, M.guard, 0.002, x1 - t / 2, yc, 0), info('carter')), tag(box(x1 - x0, t, D.DP, M.guard, 0.002, (x0 + x1) / 2, yTop - t / 2, 0), info('carter')),
    tag(box(x1 - x0, h, t, M.guard, 0, (x0 + x1) / 2, yc, -D.DP / 2 + t / 2), info('carter')), tag(box(x1 - x0, yTop - 0.108, t, M.guard, 0, (x0 + x1) / 2, (0.108 + yTop) / 2, D.DP / 2 - t / 2), info('carter')));
  const c = D.chanL, yT2 = 0.40, h2 = yT2 - D.baseTop, yc2 = (D.baseTop + yT2) / 2;
  casing.add(tag(box(t, h2, D.DP, M.guard, 0.002, c.x0 + t / 2, yc2, 0), info('canal')), tag(box(c.x1 - c.x0, t, D.DP, M.guard, 0.002, (c.x0 + c.x1) / 2, yT2 - t / 2, 0), info('canal')),
    tag(box(c.x1 - c.x0, h2, t, M.guard, 0, (c.x0 + c.x1) / 2, yc2, -D.DP / 2 + t / 2), info('canal')), tag(box(c.x1 - c.x0, yT2 - 0.108, t, M.guard, 0, (c.x0 + c.x1) / 2, (0.108 + yT2) / 2, D.DP / 2 - t / 2), info('canal')));
}
// ---------- Tapa de recarga de aserrín en U (sobre el marco, queda bajo la tapa principal) ----------
const hatch = { grp: new THREE.Group(), a: 0, aT: 0, w: 0, pour: 0 };
{
  const zh = -0.147; hatch.grp.position.set(0, D.frameTop + 0.002, zh); machine.add(hatch.grp);
  for (const [x, z, w, d] of [[0, -0.1348, 0.368, 0.0245], [-0.1538, -0.004, 0.0605, 0.237], [0.1538, -0.004, 0.0605, 0.237]]) hatch.grp.add(tag(box(w, 0.004, d, M.wood, 0.0012, x, 0, z - zh), info('tapaRecarga')));
  hatch.grp.add(tag(box(0.03, 0.005, 0.006, M.ppDark, 0.002, -0.1538, 0.003, 0.11 - zh), info('tapaRecarga')));
  for (const s of [-1, 1]) machine.add(tag(cylX(0.003, 0.02, M.steel, 10, s * 0.17, D.frameTop + 0.002, zh), info('tapaRecarga')));
}
// ---------- Cámara de molido y retención (inox 304) ----------
const chamber = new THREE.Group(); machine.add(chamber);
{
  const { hx, hz, y0, y1 } = D.ch, h = y1 - y0, yc = (y0 + y1) / 2, t = 0.0015;
  chamber.add(tag(box(2 * hx + 2 * t, h, t, M.inox, 0, 0, yc, hz + t / 2), info('camaraFrente')), tag(box(2 * hx + 2 * t, h, t, M.inox, 0, 0, yc, -hz - t / 2), info('camaraAtras')),
    tag(box(t, h, 2 * hz, M.inox, 0, hx + t / 2, yc, 0), info('camaraDer')), tag(box(t, h, 2 * hz, M.inox, 0, -hx - t / 2, yc, 0), info('camaraIzq')));
  // boca 22 × 22 y tolva en V de 62° que lleva todo a la mordida de los rodillos
  const hb = D.boca / 2, hy0 = 0.598, hy1 = D.frameTop - 0.012, hh = hy1 - hy0, hyc = (hy0 + hy1) / 2;
  chamber.add(tag(box(D.boca, hh, t, M.inox, 0, 0, hyc, hb), info('tolva')), tag(box(D.boca, hh, t, M.inox, 0, 0, hyc, -hb), info('tolva')),
    tag(box(t, hh, D.boca, M.inox, 0, hb, hyc, 0), info('tolva')), tag(box(t, hh, D.boca, M.inox, 0, -hb, hyc, 0), info('tolva')));
  const fl = mesh(frameGeo(2 * hx + 0.02, 2 * hz + 0.02, D.boca, D.boca, 0.002), M.inox); fl.position.y = y1 - 0.002; chamber.add(tag(fl, info('tolva')));
  const guides = [];
  for (const s of [1, -1]) {
    const a = new THREE.Vector3(0, hy0, s * hb), b = new THREE.Vector3(0, D.roll.y + 0.0269, s * 0.0559), L = a.distanceTo(b);
    const gm = box(2 * hx, 0.0022, L, M.inox, 0.0008); gm.position.copy(a).add(b).multiplyScalar(0.5); gm.rotation.x = -s * Math.atan2(a.y - b.y, Math.abs(a.z - b.z));
    chamber.add(tag(gm, info('embudo'))); guides.push({ a, b });
  }
  D.guides = guides;
  for (const z of [D.roll.z, -D.roll.z]) for (const x of [-hx - 0.004, hx + 0.004, D.W / 2 + 0.004]) chamber.add(tag(cylX(0.014, 0.008, M.brass, 24, x, D.roll.y, z), info('bocin')));
  for (const s of [-1, 1]) chamber.add(tag(cylZ(0.006, 0.01, M.brass, 16, s * D.gate.xh, D.gate.y, hz + 0.006), info('bocin')));
}
// ---------- Rodillos trituradores (ejes contrarrotantes con cuchillas intercaladas) ----------
function bladeShape(dir) {
  const s = new THREE.Shape(), rB = D.roll.rb, r0 = 0.026, n = 3, N = 90;
  for (let i = 0; i <= N; i++) {
    const a = i / N * TAU, ph = ((a / TAU) * n) % 1, p = dir > 0 ? ph : 1 - ph;
    let r = r0;
    if (p < 0.55) r = r0 + (rB - r0) * Math.pow(p / 0.55, 1.6);
    else if (p < 0.62) r = rB - (rB - r0) * ((p - 0.55) / 0.07) * 0.85;
    else r = r0 + (rB - r0) * 0.15 * (1 - (p - 0.62) / 0.38);
    const x = Math.cos(a) * r, y = Math.sin(a) * r; i === 0 ? s.moveTo(x, y) : s.lineTo(x, y);
  }
  const h = new THREE.Path(); for (let i = 0; i <= 6; i++) { const a = i / 6 * TAU, x = Math.cos(a) * 0.0105, y = Math.sin(a) * 0.0105; i === 0 ? h.moveTo(x, y) : h.lineTo(x, y); }
  s.holes.push(h); return s;
}
function makeRoller(front) {
  const grp = new THREE.Group(), R = D.roll, dir = front ? -1 : 1;
  const blade = extrudeX(bladeShape(dir), R.disc - 0.0006, 0.0004);
  const spacer = new THREE.CylinderGeometry(R.rs, R.rs, 0.0118, 32); spacer.rotateZ(Math.PI / 2);
  const shaftLen = front ? 0.42 : 0.40, xEnd = front ? 0.222 : 0.206, xStart = xEnd - shaftLen;
  const sh = new THREE.CylinderGeometry(R.rsh, R.rsh, shaftLen, 6); sh.rotateZ(Math.PI / 2);
  const shm = mesh(sh, M.steel); shm.position.x = (xStart + xEnd) / 2; grp.add(tag(shm, info('eje')));
  const x0 = front ? -0.108 : -0.096, nb = front ? 10 : 9;
  for (let i = 0; i < nb; i++) { const m = mesh(blade, M.inoxBlade); m.position.x = x0 + i * 0.024; m.rotation.x = (i * 0.7) + (front ? 0 : 0.35); grp.add(tag(m, info('cuchillas'))); }
  for (let x = -0.114; x <= 0.1141; x += 0.012) {
    const k = (x - x0) / 0.024, isBlade = Math.abs(k - Math.round(k)) < 0.05 && k > -0.05 && k < nb - 0.95;
    if (!isBlade) { const m = mesh(spacer, M.inox); m.position.x = x; grp.add(tag(m, info('separadores'))); }
  }
  grp.position.set(0, R.y, front ? R.z : -R.z);
  return grp;
}
const rollF = makeRoller(true), rollR = makeRoller(false); machine.add(rollF, rollR);
{ // peine rascador: dedos fijos entre las cuchillas, por debajo, para despegar la pulpa
  for (const front of [true, false]) {
    const s = front ? 1 : -1, xs = front ? -0.096 : -0.108, n = front ? 9 : 10, g0 = [];
    for (let i = 0; i < n; i++) { const g1 = new THREE.BoxGeometry(0.010, 0.003, D.ch.hz - 0.052); g1.translate(xs + i * 0.024, D.roll.y - 0.022, s * (0.052 + (D.ch.hz - 0.052) / 2)); g0.push(g1); }
    machine.add(tag(mesh(mergeGeometries(g0), M.inox), info('peine')));
  }
}
// ---------- TAPA con bisagra corrida trasera ----------
const lid = { pivot: new THREE.Group(), hingeY: D.frameTop + 0.002, hingeZ: -D.DP / 2 + 0.008 };
{
  const p = lid.pivot; p.position.set(0, lid.hingeY, lid.hingeZ); machine.add(p);
  const L = 0.392;
  p.add(tag(box(D.W, D.lidT, L, M.pp, 0.01, 0, D.lidT / 2 - 0.002, L / 2 - 0.004), info('tapa')));
  // placa blanca con el rótulo (se lee de frente, parado frente al equipo)
  const decal = canvasTex(1024, 820, (x, W, H) => {
    x.fillStyle = '#f7f8f4'; x.beginPath(); x.roundRect(0, 0, W, H, 40); x.fill();
    x.fillStyle = '#2f7a3d'; x.beginPath(); x.roundRect(0, 0, W, 190, [40, 40, 0, 0]); x.fill();
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = '800 92px Segoe UI, Arial'; x.fillText('SOLO DESECHOS', W / 2, 90); x.fillText('ORGÁNICOS', W / 2, 172);
    x.textAlign = 'left'; const ok = ['Cáscaras de fruta y verdura', 'Sobras de comida', 'Café y bolsitas de té', 'Cáscara de huevo', 'Servilletas sucias'];
    ok.forEach((t, i) => { x.fillStyle = '#2f7a3d'; x.font = '800 54px Segoe UI, Arial'; x.fillText('✓', 60, 268 + i * 66); x.fillStyle = '#23342a'; x.font = '600 48px Segoe UI, Arial'; x.fillText(t, 130, 268 + i * 66); });
    x.fillStyle = '#c62f22'; x.fillRect(40, 610, W - 80, 4);
    const no = ['NO vidrio', 'NO metal', 'NO plástico', 'NO pilas'];
    no.forEach((t, i) => { const cx = 60 + (i % 2) * 470, cy = 690 + Math.floor(i / 2) * 72; x.fillStyle = '#c62f22'; x.font = '800 54px Segoe UI, Arial'; x.fillText('✕', cx, cy); x.font = '700 50px Segoe UI, Arial'; x.fillText(t, cx + 64, cy); });
  });
  decal.anisotropy = 16;
  const dm = mesh(new THREE.PlaneGeometry(0.25, 0.2), new THREE.MeshStandardMaterial({ map: decal, roughness: 0.55 }), false);
  dm.rotation.x = -Math.PI / 2; dm.position.set(-0.03, D.lidT + 0.0008, L / 2 + 0.035); p.add(tag(dm, info('etiqueta')));
  p.add(tag(box(0.16, 0.012, 0.018, M.ppDark, 0.005, 0, 0.012, L + 0.004), info('tapaAsa')));
  const seal = mesh(sealGeo(0.33, 0.33, 0.03, 0.0045), M.epdm); seal.position.set(0, -0.001, L / 2); p.add(tag(seal, info('empaque'))); lid.seal = seal;
  p.add(tag(box(0.012, 0.02, 0.004, M.red, 0.001, 0.165, -0.008, 0.375), info('lengueta')));
  p.add(tag(box(0.05, 0.008, 0.01, M.steel, 0.002, 0, 0.018, L + 0.008), info('una')));
  for (let i = 0; i < 8; i++) {
    const kx = -0.175 + i * 0.05, k = cylX(0.0055, 0.022, M.inox, 16, kx, 0, 0);
    if (i % 2 === 0) p.add(tag(k, info('bisagra'))); else { k.position.set(kx, lid.hingeY, lid.hingeZ); machine.add(tag(k, info('bisagra'))); }
  }
  machine.add(tag(cylX(0.0022, D.W - 0.01, M.steel, 12, 0, lid.hingeY, lid.hingeZ), info('bisagra')));
  machine.add(tag(cylX(0.011, 0.018, M.blackSteel, 24, -0.2, lid.hingeY, lid.hingeZ), info('amortiguador')));
  lid.L = L; lid.m = 1.2; lid.I = lid.m * (L * L + D.lidT * D.lidT) / 3; lid.rc = Math.hypot(L / 2, D.lidT / 2); lid.phic = Math.atan2(D.lidT / 2, L / 2);
}
// ---------- GANCHO DE PALANCA (cierre sobre-centro) ----------
const latch = { pivot: new THREE.Group(), y: 0.606, z: D.DP / 2 + 0.006 };
{
  machine.add(tag(box(0.07, 0.03, 0.006, M.blackSteel, 0.002, 0, latch.y, D.DP / 2 + 0.003), info('gancho')));
  latch.pivot.position.set(0, latch.y, latch.z); machine.add(latch.pivot);
  latch.pivot.add(tag(box(0.05, 0.058, 0.008, M.ppGreen, 0.004, 0, -0.026, 0.004), info('gancho')));
  latch.pivot.add(tag(cylX(0.004, 0.056, M.steel, 12, 0, 0, 0), info('gancho')));
  latch.bailL = rod(0.0016, M.zinc); latch.bailR = rod(0.0016, M.zinc); latch.bailT = rod(0.0016, M.zinc);
  [latch.bailL, latch.bailR, latch.bailT].forEach(b => machine.add(tag(b, info('estribo'))));
}
// ---------- PUERTA FRONTAL abatible (bisagra abajo) ----------
const door = { pivot: new THREE.Group(), y: 0.038, z: D.DP / 2, h: 0.262, m: 0.9 };
{
  const p = door.pivot; p.position.set(0, door.y, door.z); machine.add(p);
  p.add(tag(box(0.372, door.h, 0.022, M.ppDoor, 0.008, 0, door.h / 2, -0.011), info('puerta')));
  p.add(tag(box(0.2, 0.018, 0.026, M.ppGreen, 0.008, 0, door.h - 0.03, 0.012), info('puertaAsa')));
  const lbl = canvasTex(1024, 128, (x, W, H) => { x.clearRect(0, 0, W, H); x.fillStyle = 'rgba(255,255,255,.78)'; x.font = '600 46px Segoe UI, Arial'; x.textAlign = 'center'; x.fillText('Se abre cuando la aguja llega al ROJO', W / 2, 60); x.font = '34px Segoe UI, Arial'; x.fillStyle = 'rgba(255,255,255,.5)'; x.fillText('cajón de 20 L · bolsa compostable', W / 2, 108); });
  const lm = mesh(new THREE.PlaneGeometry(0.32, 0.04), new THREE.MeshStandardMaterial({ map: lbl, transparent: true, depthWrite: false }), false); lm.position.set(0, 0.1, 0.0006); p.add(tag(lm, info('puerta')));
  const ds = mesh(sealGeo(0.35, 0.235, 0.02, 0.003), M.epdm); ds.rotation.x = Math.PI / 2; ds.position.set(0, door.h / 2, -0.023); p.add(tag(ds, info('empaquePuerta')));
  p.add(tag(box(0.018, 0.01, 0.012, M.steel, 0.002, 0.15, door.h - 0.012, -0.03), info('trinquete')));
  for (const s of [-1, 1]) machine.add(tag(cylX(0.006, 0.05, M.inox, 16, s * 0.14, door.y, door.z - 0.004), info('bisagraPuerta')));
  door.I = door.m * door.h * door.h / 3;
}
// ---------- BANDEJA DE PESAJE sobre 4 resortes ----------
const tray = { grp: new THREE.Group(), springs: [] };
{
  tray.grp.add(tag(box(0.35, 0.006, 0.31, M.blackSteel, 0.002, 0, 0, 0), info('bandeja')));
  // pestaña delantera derecha donde apoya la varilla de empuje del indicador
  tray.grp.add(tag(box(0.014, 0.004, 0.014, M.blue, 0.001, 0.179, 0.0, 0.155), info('pestana')));
  // dos guías bajas sobre las que se desliza el cajón (no hay rieles laterales: ese hueco queda libre para el alambre)
  for (const s of [-1, 1]) tray.grp.add(tag(box(0.012, 0.003, 0.30, M.zinc, 0.001, s * 0.15, 0.0045, 0), info('rieles')));
  tray.grp.position.set(0, D.tray.y, D.dr.z0 + D.dr.d / 2); machine.add(tray.grp);
  const sg = springGeo(0.011, 0.0019, 5.5);
  for (const [x, z] of [[-0.15, -0.12], [0.15, -0.12], [-0.15, 0.12], [0.15, 0.12]]) {
    const s = mesh(sg, M.blue); s.position.set(x, D.baseTop, D.dr.z0 + D.dr.d / 2 + z); machine.add(tag(s, info('resortes'))); tray.springs.push(s);
    machine.add(tag(cylY(0.016, 0.003, M.blackSteel, 20, x, D.baseTop + 0.0015, D.dr.z0 + D.dr.d / 2 + z), info('resortes')));
  }
}
// ---------- CAJÓN extraíble ----------
const drawer = { grp: new THREE.Group(), e: 0, v: 0, m: 1.35 };
{
  const { w, h, d, wall } = D.dr, g2 = drawer.grp;
  [box(w, wall, d, M.drawer, 0.003, 0, wall / 2, 0), box(wall, h, d, M.drawer, 0.002, -w / 2 + wall / 2, h / 2, 0), box(wall, h, d, M.drawer, 0.002, w / 2 - wall / 2, h / 2, 0),
    box(w, h, wall, M.drawer, 0.002, 0, h / 2, -d / 2 + wall / 2), box(w, h, wall, M.drawer, 0.002, 0, h / 2, d / 2 - wall / 2)].forEach(m => g2.add(tag(m, info('cajon'))));
  const rim = mesh(sealGeo(w - 0.004, d - 0.004, 0.012, 0.004), M.drawer); rim.position.y = h; g2.add(tag(rim, info('cajon')));
  g2.add(tag(box(0.13, 0.022, 0.014, M.ppDark, 0.006, 0, h - 0.04, d / 2 + 0.006), info('cajonAsa')));
  g2.add(tag(box(0.1, 0.03, 0.008, M.ppGreen, 0.003, 0.1, 0.035, d / 2 + 0.004), info('reserva')));
  const grid = box(w - 0.02, 0.003, d - 0.02, M.grid, 0.002, 0, 0.034, 0); g2.add(tag(grid, info('rejilla')));
  for (const [x, z] of [[-0.14, -0.12], [0.14, -0.12], [-0.14, 0.12], [0.14, 0.12]]) g2.add(tag(cylY(0.004, 0.03, M.grid, 10, x, 0.018, z), info('rejilla')));
  g2.position.set(0, 0.06, D.dr.z0 + d / 2); machine.add(g2);
  drawer.rails = [];
}
// ---------- BOLSA compostable (con borde elástico y cordón) ----------
const bag = { grp: new THREE.Group(), state: 'in', t: 0 };
{
  const { w, h, d } = D.dr, bw = w - 0.012, bd = d - 0.012, bh = h - 0.006;
  const pos = [], uv = [], idx = [], NU = 64, NV = 12;
  const per = (u) => { const L = 2 * (bw + bd), s = u * L; if (s < bw) return [-bw / 2 + s, bd / 2]; if (s < bw + bd) return [bw / 2, bd / 2 - (s - bw)]; if (s < 2 * bw + bd) return [bw / 2 - (s - bw - bd), -bd / 2]; return [-bw / 2, -bd / 2 + (s - 2 * bw - bd)]; };
  for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
    const [x, z] = per(i / NU), f = j / NV, bulge = Math.sin(f * Math.PI) * 0.003 * (1 + Math.sin(i * 1.7) * 0.6);
    const nx = Math.abs(x) >= bw / 2 - 1e-6 ? Math.sign(x) : 0, nz = Math.abs(z) >= bd / 2 - 1e-6 ? Math.sign(z) : 0;
    pos.push(x - nx * bulge, 0.006 + f * bh, z - nz * bulge); uv.push(i / NU * 6, f * 1.4);
  }
  for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) { const a = j * (NU + 1) + i, b = a + 1, c = a + NU + 1, e = c + 1; idx.push(a, c, b, b, c, e); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); sg.setIndex(idx); sg.computeVertexNormals();
  bag.side = mesh(sg, M.bag); bag.side.userData.base = Float32Array.from(pos); bag.grp.add(tag(bag.side, info('bolsa')));
  bag.bottom = box(bw, 0.002, bd, M.bag, 0, 0, 0.006, 0); bag.grp.add(tag(bag.bottom, info('bolsa')));
  bag.rim = mesh(sealGeo(w + 0.002, d + 0.002, 0.012, 0.0045), M.bag); bag.rim.position.y = h + 0.001; bag.grp.add(tag(bag.rim, info('bolsa')));
  bag.cord = mesh(sealGeo(w - 0.004, d - 0.004, 0.012, 0.0014), M.cord); bag.cord.position.y = h - 0.004; bag.grp.add(tag(bag.cord, info('cordon')));
  bag.NU = NU; bag.NV = NV; bag.bh = bh;
  drawer.grp.add(bag.grp);
}
