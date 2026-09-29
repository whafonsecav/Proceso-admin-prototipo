
// =====================================================================
//  DESPIECE: todas las piezas se separan con una animación escalonada
// =====================================================================
const EXPL = { list: [], u: 0, target: 0, parts: [] };
const _bb = new THREE.Box3(), _bc = new THREE.Vector3(), _bs = new THREE.Vector3(), CEN = new THREE.Vector3(0.01, 0.33, 0);
function keyOf(o) { let k = null; o.traverse(m => { if (!k && m.userData.info) k = m.userData.info.key; }); return k; }
function addExp(obj, off, delay) { EXPL.list.push({ obj, off, delay, applied: new THREE.Vector3() }); }
function panelOff(o, dist) { // se mueve hacia afuera por su cara más delgada
  _bb.setFromObject(o); _bb.getCenter(_bc); _bb.getSize(_bs); const r = _bc.clone().sub(CEN);
  const ax = _bs.x < _bs.y && _bs.x < _bs.z ? 'x' : _bs.y < _bs.z ? 'y' : 'z'; const v = new THREE.Vector3(); v[ax] = Math.sign(r[ax] || 1) * dist; return v;
}
function buildExplode() {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const trans = new Set([TR.syncF, TR.syncR, TR.gearC, TR.pinB, TR.fly, TR.brake, TR.spA, TR.spB, TR.pinA, TR.chain, TR.chainPins, TR.rack, TR.rackLink, TR.retSpring, TR.bellows, TR.pedR, TR.lockR]);
  for (const o of casing.children) {
    const k = keyOf(o);
    if (k === 'base') addExp(o, V(0, -0.03, 0), 0.45);
    else if (k === 'marco') addExp(o, V(0, 0.46, 0), 0.05);
    else if (k === 'piso') addExp(o, V(0, 0.02, -0.55), 0.3);
    else if (k === 'carter') addExp(o, V(0.5, 0, 0), 0);
    else if (k === 'canal') addExp(o, V(-0.42, 0, 0), 0);
    else if (k === 'columna') addExp(o, V(0, 0.1, -0.62), 0.2);
    else addExp(o, panelOff(o, 0.32), 0);
  }
  for (const o of chamber.children) {
    const k = keyOf(o); _bb.setFromObject(o); _bb.getCenter(_bc);
    if (k === 'tolva' || k === 'embudo') addExp(o, V(0, 0.36, Math.sign(_bc.z) * 0.08 * (k === 'embudo' ? 1.6 : 1)), 0.1);
    else if (k === 'bocin') addExp(o, V(Math.sign(_bc.x) * (Math.abs(_bc.x) > 0.15 ? 0.3 : 0.14), 0.22, Math.sign(_bc.z) * 0.13), 0.25);
    else addExp(o, panelOff(o, 0.12).add(V(0, 0.22, 0)), 0.15);
  }
  for (const [r, s] of [[rollF, 1], [rollR, -1]]) { addExp(r, V(0, 0.22, s * 0.13), 0.22); for (const c of r.children) if (c.userData.info?.key !== 'eje') addExp(c, V(c.position.x * 1.25, 0, 0), 0.4); }
  const skip = new Set([casing, chamber, rollF, rollR, pInst, OD.pts]);
  for (const o of machine.children) {
    if (skip.has(o) || SACKS.some(s => s.grp === o)) continue;
    const k = keyOf(o); _bb.setFromObject(o); _bb.getCenter(_bc);
    let off, d = 0.3;
    if (o === lid.pivot) { off = V(0, 0.62, -0.08); d = 0.05; }
    else if (o === hatch.grp) { off = V(0, 0.5, 0); d = 0.08; }
    else if (o === latch.pivot || k === 'gancho' || k === 'estribo') { off = V(0, 0.2, 0.32); d = 0.12; }
    else if (k === 'bisagra' || k === 'amortiguador') { off = V(0, 0.5, -0.12); d = 0.1; }
    else if (o === door.pivot || k === 'bisagraPuerta') { off = V(0, -0.02, 0.46); d = 0.35; }
    else if (o === drawer.grp) { off = V(0, 0.12, 0.62); d = 0.4; }
    else if (o === tray.grp || k === 'resortes') { off = V(0, -0.02, 0.62); d = 0.42; }
    else if (k === 'rieles') { off = V(Math.sign(_bc.x) * 0.14, 0.08, 0.36); d = 0.4; }
    else if (k === 'patas') { off = V(0, -0.04, 0); d = 0.45; }
    else if (trans.has(o) || k === 'ejeA' || k === 'ejeB' || k === 'platina' || k === 'retorno' || k === 'fuelle' || k === 'manguera' || k === 'ruedaLibre' || k === 'cremallera' || k === 'pedalR' || k === 'seguroR') {
      off = V(0.3 + Math.max(0, _bc.x - 0.19) * 5, _bc.y > 0.38 ? 0.22 : 0, o === TR.pedR ? 0.2 : 0); d = 0.28;
    }
    else if (o === TR.pedL || o === TR.retL || o === TR.lockL) { off = V(-0.34, 0, 0.18); d = 0.3; }
    else if (['pulsador', 'varillaSeguro', 'guiaSeguro', 'escuadra', 'lengueta'].includes(k)) { off = V(0.12, 0.02, 0.4); d = 0.2; }
    else if (['lamina', 'flecha', 'palanca', 'varillaPeso', 'trinquete'].includes(k)) { off = V(0.05, k === 'lamina' ? 0.36 : 0.3, k === 'lamina' ? 0.5 : 0.42); d = 0.2; }
    else if (['deposito', 'aserrinDep', 'camisa'].includes(k)) { off = Math.abs(_bc.x) > 0.12 && _bc.z > -0.12 ? V(Math.sign(_bc.x) * 0.4, 0.26, 0) : V(0, 0.26, -0.45); d = 0.2; }
    else if (o === SAW.plate || k === 'ranuraAserrin' || k === 'retornoPlaca') { off = V(0, 0.05, -0.2); d = 0.33; }
    else if (o === SAW.pulley || o === SAW.cableV || o === SAW.cableH) { off = V(-0.34, 0, 0.18); d = 0.3; }
    else if (['carbon', 'valvula', 'ductoOlor', 'puerto'].includes(k)) { off = V(0, 0.1, -0.72); d = 0.25; }
    else if (k === 'peine') { off = V(0, 0.22, Math.sign(_bc.z) * 0.25); d = 0.3; }
    else { off = _bc.clone().sub(CEN).setY(0).normalize().multiplyScalar(0.35); if (_bc.x > 0.19) off.set(0.5, 0, 0); if (_bc.x < -0.19) off.set(-0.42, 0, 0); d = 0.1; }
    addExp(o, off, d);
  }
  // lista de piezas para recorrer una por una (sin repetir la misma ficha)
  const seen = new Set(); pickables.forEach(m => { const inf = m.userData.info; if (inf && !seen.has(inf) && inf.name && TXT[inf.key]) { seen.add(inf); EXPL.parts.push({ info: inf, mesh: m }); } });
}
function explodeUndo() { for (const e of EXPL.list) e.obj.position.sub(e.applied), e.applied.set(0, 0, 0); }
function explodeApply(dt) {
  EXPL.u += (EXPL.target - EXPL.u) * Math.min(1, dt * 3.2);
  if (EXPL.u < 1e-4) { EXPL.u = 0; return; }
  for (const e of EXPL.list) { const t = smooth(e.delay, e.delay + 0.55, EXPL.u * 1.0); e.applied.copy(e.off).multiplyScalar(t); e.obj.position.add(e.applied); }
}
// =====================================================================
//  RESALTADO AL PASAR EL CURSOR y RÓTULOS 3D NUMERADOS
// =====================================================================
const tintCache = new Map(); let tinted = null;
const byInfo = new Map(); function meshesOf(inf) { if (!byInfo.size) pickables.forEach(m => { const i = m.userData.info; if (!byInfo.has(i)) byInfo.set(i, []); byInfo.get(i).push(m); }); return byInfo.get(inf) || []; }
function tint(inf) {
  if (tinted === inf) return; untint(); if (!inf) return; tinted = inf;
  for (const m of meshesOf(inf)) { if (!m.material || m.isInstancedMesh) continue; let t = tintCache.get(m.material); if (!t) { t = m.material.clone(); if (t.emissive) { t.emissive = new THREE.Color(0x3b8a4a); t.emissiveIntensity = 0.55; } tintCache.set(m.material, t); } m.userData.orig = m.material; m.material = t; }
}
function untint() { if (!tinted) return; for (const m of meshesOf(tinted)) if (m.userData.orig) { m.material = m.userData.orig; m.userData.orig = null; } tinted = null; }
const CALL = { items: [], box: document.createElement('div') };
CALL.box.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:14'; document.body.appendChild(CALL.box);
function setCallouts(list) { // list: [{obj|pos, text}]
  CALL.box.innerHTML = ''; CALL.items = list.map((it, i) => {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;transform:translate(-6px,-50%);display:flex;align-items:center;gap:6px;font:600 12px Segoe UI,Arial;color:#fff;white-space:nowrap';
    d.innerHTML = `<span style="width:12px;height:12px;border-radius:50%;background:${it.color || '#d23a2b'};box-shadow:0 0 0 3px rgba(255,255,255,.7)"></span><span style="background:rgba(14,18,16,.9);padding:3px 8px;border-radius:10px;border:1px solid ${it.color || '#d23a2b'}">${it.text}</span>`;
    CALL.box.appendChild(d); return { ...it, el: d };
  });
}
function updateCallouts() {
  for (const it of CALL.items) {
    if (it.obj) { _bb.setFromObject(it.obj); _bb.getCenter(_pa); } else _pa.copy(typeof it.pos === 'function' ? it.pos() : it.pos);
    _pa.project(camera); const vis = _pa.z < 1;
    it.el.style.display = vis ? 'flex' : 'none'; it.el.style.left = ((_pa.x + 1) / 2 * innerWidth) + 'px'; it.el.style.top = ((1 - _pa.y) / 2 * innerHeight) + 'px';
  }
}
const CALLSETS = {
  seguro: () => [{ obj: lid.pivot.children.find(m => m.userData.info?.key === 'lengueta'), text: '1 · Lengüeta de la tapa' }, { obj: SAFE.plunger, text: '2 · Pulsador (baja 4 mm)' }, { pos: new THREE.Vector3(0.183, 0.36, 0.186), text: '3 · Varilla roja' }, { obj: SAFE.crank, text: '4 · Escuadra' }, { obj: TR.lockR, text: '5 · Pasador bajo el pedal' }],
  bascula: () => [{ obj: tray.springs[3], text: '1 · 4 resortes: bajan 1 mm por kg', color: '#2f6fb5' }, { obj: gauge.push, text: '2 · Alambre', color: '#2f6fb5' }, { obj: gauge.inArm, text: '3 · Palanca en L (brazo de 9 mm)', color: '#2f6fb5' }, { obj: gauge.arrow, text: '4 · Flecha = brazo largo', color: '#2f6fb5' }, { pos: () => new THREE.Vector3(0.13, 0.37, 0.2), text: '5 · Lámina impresa', color: '#2f6fb5' }, { obj: gauge.pawl, text: '6 · Trinquete de la puerta', color: '#2f6fb5' }],
  aserrin: () => [{ obj: hatch.grp, text: '1 · Se carga aquí (bajo la tapa)', color: '#b0843c' }, { obj: SAW.fills[1], text: '2 · Depósito en U (≈5 L)', color: '#b0843c' }, { pos: new THREE.Vector3(-0.154, 0.298, 0.06), text: '3 · Placa con agujeros', color: '#b0843c' }, { pos: new THREE.Vector3(0.154, 0.29, -0.03), text: '4 · Ranuras: atrás, izq. y der.', color: '#b0843c' }, { obj: SAW.pulley, text: '5 · Cable', color: '#b0843c' }, { obj: TR.pedL, text: '6 · Pedal izquierdo', color: '#b0843c' }],
  transmision: () => [{ obj: TR.pedR, text: '1 · Pedal (pivote atrás)', color: '#555' }, { obj: TR.rack, text: '2 · Cremallera', color: '#555' }, { obj: TR.pinA, text: '3 · Rueda libre', color: '#555' }, { pos: () => new THREE.Vector3(0.252, 0.29, T.zA + 0.05), text: '4 · Cadena 24:8', color: '#555' }, { obj: TR.fly, text: '5 · Volante 1,45 kg', color: '#555' }, { obj: TR.gearC, text: '6 · Reductor 5:1', color: '#555' }, { obj: rollF, text: '7 · Rodillos', color: '#555' }],
  olor: () => [{ obj: lid.seal, text: '1 · Empaque EPDM', color: '#2f7a3d' }, { obj: TR.bellows, text: '2 · Fuelle (pedal derecho)', color: '#2f7a3d' }, { pos: new THREE.Vector3(0, 0.43, -0.2), text: '3 · Carbón activado', color: '#2f7a3d' }, { obj: SAW.valveFlap, text: '4 · Válvula de una vía', color: '#2f7a3d' }, { pos: new THREE.Vector3(0, 0.279, -0.145), text: '5 · Rejilla de aspiración (sobre la bolsa)', color: '#2f7a3d' }, { obj: SAW.plate, text: '6 · Aserrín que tapa', color: '#2f7a3d' }],
};
// =====================================================================
//  OLOR (partículas de aire) y SONIDO
// =====================================================================
const OD = { n: 260, pts: null, a: [] };
{
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(OD.n * 3), 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(OD.n * 3), 3));
  const spr = canvasTex(64, 64, (x) => { const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); });
  OD.pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.018, map: spr, vertexColors: true, transparent: true, opacity: 0.75, depthWrite: false }));
  OD.pts.visible = false; OD.pts.frustumCulled = false; machine.add(OD.pts);
  for (let i = 0; i < OD.n; i++) OD.a.push({ life: 0 });
}
const colOdor = new THREE.Color(0x8b7d2c), colEsc = new THREE.Color(0xd0662c), colClean = new THREE.Color(0x6fc3ff);
const DUCT = [new THREE.Vector3(0, 0.275, -0.135), new THREE.Vector3(0, 0.279, -0.165), new THREE.Vector3(0, 0.34, -0.175), new THREE.Vector3(0, 0.43, -0.174), new THREE.Vector3(0, 0.55, -0.18), new THREE.Vector3(0, 0.62, -0.215)];
function heapUncovered() { let a = 0, n = 0; for (let k = 0; k < HP.h.length; k++) if (HP.h[k] > 0.002) { n++; a += 1 - HP.cov[k]; } return n ? a / n : 0; }
function updateOdor(dt) {
  OD.pts.visible = VIEW.seals && EXPL.u < 0.02; if (!OD.pts.visible) return;
  const inCh = P.filter(p => p.y > 0.31 && p.type !== 'aserrin').length, pos = OD.pts.geometry.attributes.position, col = OD.pts.geometry.attributes.color;
  const lidOpen = S.th > 0.08, doorOpen = S.de > 0.2, suck = S.vR > 0.02 && sealed(), unc = heapUncovered();
  for (let i = 0; i < OD.n; i++) {
    const o = OD.a[i];
    if (o.life <= 0) {
      const r = Math.random();
      if (inCh > 0 && r < 0.45) Object.assign(o, { x: (Math.random() - .5) * 0.22, y: 0.34 + Math.random() * 0.24, z: (Math.random() - .5) * 0.22, zone: 'ch', life: 2 + Math.random() * 3 });
      else if (S.bagMass > 0.2 && r < 0.45 + 0.5 * unc) Object.assign(o, { x: (Math.random() - .5) * 0.3, y: drawer.grp.position.y + 0.06 + Math.random() * 0.15, z: drawer.grp.position.z + (Math.random() - .5) * 0.26, zone: 'bin', life: 2 + Math.random() * 3 });
      else { Object.assign(o, { life: 0.2, zone: 'none', c: colOdor }); pos.setXYZ(i, 0, -5, 0); continue; }
      o.c = colOdor; o.k = 0;
    }
    if (o.zone === 'none') { o.life -= dt; pos.setXYZ(i, 0, -5, 0); continue; }
    o.life -= dt; const j = () => (Math.random() - 0.5) * 0.12 * dt * 8;
    if (o.zone === 'ch' || o.zone === 'bin') {
      if (lidOpen && o.y > 0.5 && o.zone === 'ch') { o.zone = 'esc'; o.c = colEsc; }
      else if (doorOpen && o.zone === 'bin' && o.z > drawer.grp.position.z) { o.zone = 'esc2'; o.c = colEsc; }
      else if (suck && Math.random() < 0.03) { o.zone = 'duct'; o.k = 0; }
      o.x = clamp(o.x + j(), -0.16, 0.16); o.y = clamp(o.y + j(), 0.07, 0.6); o.z = clamp(o.z + j(), -0.14, 0.16);
    } else if (o.zone === 'esc') { o.y += 0.09 * dt; o.x += j() * 2; o.z += j() * 2; if (o.y > 1.0) o.life = 0; }
    else if (o.zone === 'esc2') { o.z += 0.08 * dt; o.y += 0.05 * dt; if (o.z > 0.8) o.life = 0; }
    else if (o.zone === 'duct') {
      if (o.k === 0) { o.k = 0.001; o.x = DUCT[0].x; o.y = DUCT[0].y; o.z = DUCT[0].z; }
      o.k += dt * 0.7; const seg = Math.min(DUCT.length - 2, Math.floor(o.k)), f = o.k - seg;
      if (o.k >= DUCT.length - 1) { o.zone = 'out'; o.c = colClean; } else { const A = DUCT[seg], B = DUCT[seg + 1]; o.x = lerp(A.x, B.x, f); o.y = lerp(A.y, B.y, f); o.z = lerp(A.z, B.z, f); if (seg >= 3) o.c = colClean; }
    } else if (o.zone === 'out') { o.z -= 0.08 * dt; o.y += 0.02 * dt; if (o.z < -0.45) o.life = 0; }
    pos.setXYZ(i, o.x, o.y, o.z); col.setXYZ(i, o.c.r, o.c.g, o.c.b);
  }
  pos.needsUpdate = true; col.needsUpdate = true;
}
const AU = { on: true, ctx: null };
function audioInit() {
  if (AU.ctx) return; try { AU.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  const c = AU.ctx, len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const mk = (type, f, q) => { const s = c.createBufferSource(); s.buffer = buf; s.loop = true; const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const gn = c.createGain(); gn.gain.value = 0; s.connect(fl).connect(gn).connect(c.destination); s.start(); return { gn, fl }; };
  AU.grind = mk('bandpass', 900, 0.7); AU.whir = mk('bandpass', 300, 3);
}
function blip(freq, dur, vol, type = 'square') {
  if (!AU.on || !AU.ctx) return; const c = AU.ctx, o = c.createOscillator(), gn = c.createGain();
  o.type = type; o.frequency.value = freq; gn.gain.setValueAtTime(vol, c.currentTime); gn.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(gn).connect(c.destination); o.start(); o.stop(c.currentTime + dur + 0.02);
}
function thud(vol, f = 110) { if (!AU.on || !AU.ctx) return; blip(f, 0.18, Math.min(0.5, vol), 'sine'); blip(f * 2.7, 0.05, Math.min(0.2, vol * 0.4), 'triangle'); }
function updateAudio() {
  if (!AU.ctx) return; const t = AU.ctx.currentTime, wC = S.wB / T.red;
  AU.grind.gn.gain.setTargetAtTime(AU.on ? clamp(S.loadC * wC * 0.004, 0, 0.35) : 0, t, 0.05);
  AU.grind.fl.frequency.setTargetAtTime(500 + 60 * wC, t, 0.1);
  AU.whir.gn.gain.setTargetAtTime(AU.on ? clamp(S.wB * 0.0009, 0, 0.08) : 0, t, 0.1);
  AU.whir.fl.frequency.setTargetAtTime(120 + S.wB * 4, t, 0.1);
  if (EV.clicks > 0.6) { EV.clicks = 0; blip(2400, 0.012, 0.05); }
  if (EV.latchClack) { EV.latchClack = 0; blip(900, 0.03, 0.15); blip(320, 0.06, 0.12, 'triangle'); }
  if (EV.lidThud) { thud(EV.lidThud * 0.25, 95); EV.lidThud = 0; }
  if (EV.doorThud) { thud(EV.doorThud * 0.3, 80); EV.doorThud = 0; }
}
