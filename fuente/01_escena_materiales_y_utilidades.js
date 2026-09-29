import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// =====================================================================
//  EJES: x = izquierda→derecha, y = altura, z = atrás→frente. Metros.
//  Origen en el piso, centro de la huella del cuerpo (38 × 40 cm).
// =====================================================================
const TAU = Math.PI * 2, g = 9.81;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

const D = {
  W: 0.38, DP: 0.40, H: 0.68, t: 0.003,
  baseTop: 0.035, frameTop: 0.64, lidT: 0.04, boca: 0.22,
  ch: { hx: 0.12, hz: 0.12, y0: 0.318, y1: 0.60 },          // cámara de inox (medio ancho interior)
  roll: { y: 0.47, z: 0.029, rb: 0.036, rs: 0.021, rsh: 0.009, disc: 0.012, n: 9 },
  gate: { y: 0.325, xh: 0.12, L: 0.12, hz: 0.118, th: 0.0012 },
  dr: { w: 0.34, h: 0.20, d: 0.30, z0: -0.14, y0: 0.063, wall: 0.004 },
  tray: { y: 0.057, k: 9810, m: 0.6 },                     // 4 resortes: k total 9,81 N/mm → 1 mm por kg
  carter: { x0: 0.19, x1: 0.262 }, chanL: { x0: -0.234, x1: -0.19 },
};
// Transmisión (pedal derecho → cremallera → rueda libre → cadena → volante → reductor 1:5 → rodillos)
const T = { pivZ: -0.15, pivY: 0.05, padZ: 0.25, armPad: 0.40, restH: 0.045, sMax: 0.055,
  rPin: 0.012, RA: 0.04865, rB: 0.01659, rPB: 0.012, RC: 0.060, yA: 0.17, yB: 0.41, xR: 0.226, xL: -0.212 };
T.zB = D.roll.z + Math.sqrt((T.RC + T.rPB) ** 2 - (D.roll.y - T.yB) ** 2);
T.zA = T.zB; T.zRack = T.zA + T.rPin; T.armRack = T.zRack - T.pivZ;
T.G = (T.armRack / T.armPad) / T.rPin * 3; // catalina 24 : piñón 8   // rad del volante por metro de pedal
T.red = T.RC / T.rPB;                                    // reducción volante → rodillos (5:1)
T.armCable = 0.30;                                       // pedal izquierdo: brazo del cable

// ---------------------------------------------------------------------
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.localClippingEnabled = true;

const scene = new THREE.Scene();
const BG = new THREE.Color(0xe3e6e0);
scene.background = BG;
scene.fog = new THREE.Fog(0xdfe2dc, 3.5, 9);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
scene.environmentIntensity = 0.75;

const camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, 0.02, 30);
camera.position.set(1.05, 0.82, 1.25);
const controls = new OrbitControls(camera, canvas);
controls.target.set(0.02, 0.33, 0.02);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 0.12; controls.maxDistance = 3.2; controls.maxPolarAngle = Math.PI - 0.05; // se puede mirar por debajo: el piso solo se ve desde arriba
controls.update();

scene.add(new THREE.HemisphereLight(0xffffff, 0x8d9389, 0.35));
const key = new THREE.DirectionalLight(0xfff6ea, 2.3);
key.position.set(1.3, 2.4, 1.7); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -0.7, right: 0.7, top: 0.9, bottom: -0.5, near: 0.5, far: 6 });
key.shadow.bias = -0.0003; key.shadow.normalBias = 0.015; key.shadow.radius = 5;
scene.add(key);
const fill = new THREE.DirectionalLight(0xdfe9ff, 0.55); fill.position.set(-1.8, 1.2, 0.6); scene.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 0.7); rim.position.set(-0.6, 1.4, -2.0); scene.add(rim);

const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.MeshStandardMaterial({ color: 0xd3d6cf, roughness: 0.92 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
{ // sombra de contacto suave bajo el equipo (oclusión ambiental aproximada)
  const t = canvasTex(256, 256, (x, W, H) => { const gr = x.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2); gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(0.55, 'rgba(0,0,0,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, W, H); });
  const c = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.75), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
  c.rotation.x = -Math.PI / 2; c.position.set(0.015, 0.0008, 0.02); scene.add(c);
}

// ---------------------------------------------------------------------
//  Materiales PBR
// ---------------------------------------------------------------------
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  return t;
}
function noiseTex(w, base, amp, repeat, grain = 1) {
  return canvasTex(w, w, (x, W, H) => {
    x.fillStyle = base; x.fillRect(0, 0, W, H);
    const id = x.getImageData(0, 0, W, H), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * amp; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    x.putImageData(id, 0, 0);
    if (grain > 1) { x.globalAlpha = 0.25; x.drawImage(x.canvas, 0, 0, W / grain, H / grain, 0, 0, W, H); }
  }, repeat);
}
// acero cepillado: vetas horizontales
const brushed = canvasTex(256, 256, (x, W, H) => {
  x.fillStyle = '#8a8a8a'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 1400; i++) { const y = Math.random() * H, v = 110 + Math.random() * 60; x.strokeStyle = `rgba(${v},${v},${v},.35)`; x.beginPath(); x.moveTo(0, y); x.lineTo(W, y + (Math.random() - .5) * 2); x.stroke(); }
}, [3, 3]);
brushed.colorSpace = THREE.NoColorSpace;

const wrinkle = canvasTex(256, 256, (x, W, H) => {
  x.fillStyle = '#808080'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 140; i++) { const y0 = Math.random() * H, a = (Math.random() - .5) * 0.5, l = 40 + Math.random() * 160, x0 = Math.random() * W; const gr = x.createLinearGradient(0, y0 - 6, 0, y0 + 6); const v = Math.random() < .5 ? 200 : 60; gr.addColorStop(0, 'rgba(128,128,128,0)'); gr.addColorStop(.5, `rgba(${v},${v},${v},.55)`); gr.addColorStop(1, 'rgba(128,128,128,0)'); x.fillStyle = gr; x.save(); x.translate(x0, y0); x.rotate(a); x.fillRect(-l / 2, -6, l, 12); x.restore(); }
}, [2, 2]); wrinkle.colorSpace = THREE.NoColorSpace;
const housingMats = [], clipMats = [];
const M = {
  pp: new THREE.MeshPhysicalMaterial({ color: 0x3f8c55, roughness: 0.44, clearcoat: 0.25, clearcoatRoughness: 0.55, side: THREE.DoubleSide, roughnessMap: noiseTex(128, '#bdbdbd', 30, [6, 6]) }),
  ppGreen: new THREE.MeshPhysicalMaterial({ color: 0xd3e6c4, roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.4, side: THREE.DoubleSide }),
  ppDark: new THREE.MeshPhysicalMaterial({ color: 0x252d28, roughness: 0.5, clearcoat: 0.2, side: THREE.DoubleSide }),
  guard: new THREE.MeshPhysicalMaterial({ color: 0x3f8c55, roughness: 0.44, clearcoat: 0.25, side: THREE.DoubleSide }),
  inox: new THREE.MeshStandardMaterial({ color: 0xcdd1d4, metalness: 1, roughness: 0.3, roughnessMap: brushed, side: THREE.DoubleSide }),
  inoxLeaf: new THREE.MeshStandardMaterial({ color: 0xc3c8cc, metalness: 1, roughness: 0.34, roughnessMap: brushed, side: THREE.DoubleSide }),
  inoxBlade: new THREE.MeshStandardMaterial({ color: 0xd9dcdf, metalness: 1, roughness: 0.22, roughnessMap: brushed }),
  steel: new THREE.MeshStandardMaterial({ color: 0x6b7178, metalness: 0.95, roughness: 0.36 }),
  blackSteel: new THREE.MeshStandardMaterial({ color: 0x2b2f33, metalness: 0.85, roughness: 0.42 }),
  castIron: new THREE.MeshStandardMaterial({ color: 0x3a3f43, metalness: 0.75, roughness: 0.5, roughnessMap: noiseTex(128, '#9a9a9a', 60, [2, 2]) }),
  zinc: new THREE.MeshStandardMaterial({ color: 0xc4c9cc, metalness: 1, roughness: 0.28 }),
  springBlue: new THREE.MeshStandardMaterial({ color: 0x5c6f86, metalness: 0.9, roughness: 0.35 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xc9a14a, metalness: 1, roughness: 0.3 }),
  chain: new THREE.MeshStandardMaterial({ color: 0x3b3e41, metalness: 0.9, roughness: 0.4 }),
  epdm: new THREE.MeshStandardMaterial({ color: 0x141516, roughness: 0.88, emissive: 0x000000 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x1c1e1f, roughness: 0.95 }),
  red: new THREE.MeshStandardMaterial({ color: 0xd23a2b, roughness: 0.35, metalness: 0.2 }),
  ppDoor: new THREE.MeshPhysicalMaterial({ color: 0x2b6a40, roughness: 0.46, clearcoat: 0.25, clearcoatRoughness: 0.5, side: THREE.DoubleSide }),
  blue: new THREE.MeshStandardMaterial({ color: 0x2f6fb5, roughness: 0.35, metalness: 0.45 }),
  wood: new THREE.MeshStandardMaterial({ color: 0xcfa86a, roughness: 0.95 }),
  ppClear: new THREE.MeshPhysicalMaterial({ color: 0xf2f4ef, roughness: 0.2, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }),
  cord: new THREE.MeshStandardMaterial({ color: 0xf1efe6, roughness: 0.8 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf7f7f3, roughness: 0.5 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xe8792b, roughness: 0.4 }),
  drawer: new THREE.MeshPhysicalMaterial({ color: 0x55705d, roughness: 0.55, clearcoat: 0.15, side: THREE.DoubleSide }),
  bag: new THREE.MeshPhysicalMaterial({ color: 0x6fa64a, roughness: 0.55, transparent: true, opacity: 0.86, side: THREE.DoubleSide, sheen: 0.5, sheenColor: 0xd7f0b8, bumpMap: wrinkle, bumpScale: 3, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
  grid: new THREE.MeshStandardMaterial({ color: 0x4f5a53, roughness: 0.6 }),
  carbon: new THREE.MeshStandardMaterial({ color: 0x1b1c1d, roughness: 0.9 }),
  pc: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.06, transmission: 0.9, thickness: 0.002, ior: 1.58, transparent: true, opacity: 0.35 }),
  label: null,
};
housingMats.push(M.pp, M.ppDark, M.guard, M.ppDoor);
clipMats.push(M.pp, M.ppGreen, M.ppDark, M.guard, M.inox);

// ---------------------------------------------------------------------
//  Utilidades de geometría
// ---------------------------------------------------------------------
const pickables = [];
function mesh(geo, mat, shadow = true) { const m = new THREE.Mesh(geo, mat); m.castShadow = shadow; m.receiveShadow = true; return m; }
function box(w, h, d, mat, r = 0, x = 0, y = 0, z = 0) {
  const geo = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4)) : new THREE.BoxGeometry(w, h, d);
  const m = mesh(geo, mat); m.position.set(x, y, z); return m;
}
// cilindro con eje en X
function cylX(r, len, mat, seg = 32, x = 0, y = 0, z = 0) { const geo = new THREE.CylinderGeometry(r, r, len, seg); geo.rotateZ(Math.PI / 2); const m = mesh(geo, mat); m.position.set(x, y, z); return m; }
function cylY(r, len, mat, seg = 32, x = 0, y = 0, z = 0) { const m = mesh(new THREE.CylinderGeometry(r, r, len, seg), mat); m.position.set(x, y, z); return m; }
function cylZ(r, len, mat, seg = 32, x = 0, y = 0, z = 0) { const geo = new THREE.CylinderGeometry(r, r, len, seg); geo.rotateX(Math.PI / 2); const m = mesh(geo, mat); m.position.set(x, y, z); return m; }
function tag(obj, info) { obj.traverse(o => { if (o.isMesh) { o.userData.info = info; pickables.push(o); } }); return obj; }
// Extruye una Shape (plano XY) con espesor t y la orienta con el eje de giro en X
function extrudeX(shape, t, bevel = 0.0006) {
  const geo = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 1, curveSegments: 10 });
  geo.translate(0, 0, -t / 2); geo.rotateY(Math.PI / 2); // (x,y,z)->(z,y,-x): eje de extrusión pasa a X
  // tras rotar, el plano de la forma es (−z, y); giramos para que forma.x → z
  return geo;
}
// Rueda dentada (engranaje recto): perfil trapezoidal
function gearShape(rp, teeth, module, hole) {
  const ra = rp + module, rf = rp - 1.25 * module, s = new THREE.Shape();
  for (let i = 0; i < teeth; i++) {
    const a0 = i / teeth * TAU, da = TAU / teeth;
    const pts = [[rf, a0], [rf, a0 + da * 0.18], [ra, a0 + da * 0.34], [ra, a0 + da * 0.52], [rf, a0 + da * 0.68], [rf, a0 + da]];
    pts.forEach(([r, a], j) => { const x = Math.cos(a) * r, y = Math.sin(a) * r; (i === 0 && j === 0) ? s.moveTo(x, y) : s.lineTo(x, y); });
  }
  if (hole) { const h = new THREE.Path(); h.absarc(0, 0, hole, 0, TAU, true); s.holes.push(h); }
  return s;
}
function gearGeo(rp, teeth, t, hole = 0.0045, spokes = 0) {
  const module = TAU * rp / teeth / Math.PI;
  const s = gearShape(rp, teeth, module, hole);
  if (spokes && rp > 0.03) { // aligeramientos
    for (let i = 0; i < spokes; i++) { const a = i / spokes * TAU + 0.3, h = new THREE.Path(), rr = rp * 0.55, rw = rp * 0.17; h.absarc(Math.cos(a) * rr, Math.sin(a) * rr, rw, 0, TAU, true); s.holes.push(h); }
  }
  return extrudeX(s, t);
}
// Piñón de cadena (dientes redondeados)
function sprocketGeo(rp, teeth, t) {
  const s = new THREE.Shape(), pitch = TAU * rp / teeth, rr = pitch * 0.32;
  for (let i = 0; i <= teeth * 8; i++) {
    const a = i / (teeth * 8) * TAU, ph = (a / TAU * teeth) % 1;
    const r = rp + 0.0035 - (ph < 0.5 ? Math.sin(ph / 0.5 * Math.PI) * (rr + 0.0035) : 0) * 1;
    const x = Math.cos(a) * r, y = Math.sin(a) * r; i === 0 ? s.moveTo(x, y) : s.lineTo(x, y);
  }
  const h = new THREE.Path(); h.absarc(0, 0, 0.0045, 0, TAU, true); s.holes.push(h);
  if (rp > 0.03) for (let i = 0; i < 5; i++) { const a = i / 5 * TAU, hp = new THREE.Path(); hp.absarc(Math.cos(a) * rp * 0.55, Math.sin(a) * rp * 0.55, rp * 0.18, 0, TAU, true); s.holes.push(hp); }
  return extrudeX(s, t, 0.0003);
}
// Resorte helicoidal de eje Y, altura unitaria (se escala en Y)
class Helix extends THREE.Curve {
  constructor(r, turns) { super(); this.r = r; this.turns = turns; }
  getPoint(t, o = new THREE.Vector3()) { const a = t * this.turns * TAU; return o.set(Math.cos(a) * this.r, t, Math.sin(a) * this.r); }
}
function springGeo(r, wire, turns) { return new THREE.TubeGeometry(new Helix(r, turns), Math.round(turns * 24), wire, 8, false); }
// Trayectoria rectángulo redondeado (plano XZ) para empaques
function rrectCurve(w, d, r) {
  const p = new THREE.CurvePath(), hw = w / 2 - r, hd = d / 2 - r, V = (x, z) => new THREE.Vector3(x, 0, z);
  const arc = (cx, cz, a0) => { const c = new THREE.EllipseCurve(cx, cz, r, r, a0, a0 + Math.PI / 2, false); return { getPoint: (t) => { const q = c.getPoint(t); return V(q.x, q.y); } }; };
  const L = (a, b) => new THREE.LineCurve3(a, b);
  const segs = [L(V(-hw, d / 2), V(hw, d / 2))];
  const pts = [];
  // construimos como polilínea densa (más simple y robusta)
  const add = (x, z) => pts.push(V(x, z));
  for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 - i / 8 * Math.PI / 2; add(hw + Math.cos(a) * r, hd + Math.sin(a) * r); }
  for (let i = 0; i <= 8; i++) { const a = 0 - i / 8 * Math.PI / 2; add(hw + Math.cos(a) * r, -hd + Math.sin(a) * r); }
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 - i / 8 * Math.PI / 2; add(-hw + Math.cos(a) * r, -hd + Math.sin(a) * r); }
  for (let i = 0; i <= 8; i++) { const a = Math.PI - i / 8 * Math.PI / 2; add(-hw + Math.cos(a) * r, hd + Math.sin(a) * r); }
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.1);
}
function sealGeo(w, d, r, tube) { return new THREE.TubeGeometry(rrectCurve(w, d, r), 180, tube, 8, true); }
// Placa con agujero rectangular (plano XZ), espesor en Y
function frameGeo(w, d, hw, hd, t, r = 0.004) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, -d / 2); s.lineTo(w / 2, -d / 2); s.lineTo(w / 2, d / 2); s.lineTo(-w / 2, d / 2); s.lineTo(-w / 2, -d / 2);
  const h = new THREE.Path(); h.moveTo(-hw / 2, -hd / 2); h.lineTo(-hw / 2, hd / 2); h.lineTo(hw / 2, hd / 2); h.lineTo(hw / 2, -hd / 2); h.lineTo(-hw / 2, -hd / 2); s.holes.push(h);
  const geo = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.001, bevelSegments: 2 });
  geo.rotateX(Math.PI / 2); geo.translate(0, t, 0); return geo;  // queda de y=0 a y=t
}
// Segmento (cilindro fino) entre dos puntos, reutilizable
const _up = new THREE.Vector3(0, 1, 0), _v = new THREE.Vector3();
function rodBetween(m, a, b) {
  _v.subVectors(b, a); const L = _v.length();
  m.position.copy(a).addScaledVector(_v, 0.5);
  m.scale.set(1, Math.max(L, 1e-5), 1);
  m.quaternion.setFromUnitVectors(_up, _v.normalize());
}
function rod(r, mat) { return mesh(new THREE.CylinderGeometry(r, r, 1, 10), mat); }
