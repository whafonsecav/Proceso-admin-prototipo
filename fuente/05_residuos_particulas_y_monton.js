
// =====================================================================
//  RESIDUOS: partículas con colisiones reales + montón en la bolsa
// =====================================================================
const WT = { // tipo: color, forma (escala x,y,z), radio (m), trabajo para partirlo (J), par resistente en la mordida (N·m)
  platano: { c: [0xd9b54a, 0x9c7a2e], s: [1.7, 0.35, 0.95], r: 0.017, E: 1.4, tau: 2.6, n: 'cáscara de plátano' },
  papa: { c: [0xc9a36b, 0xa9824e], s: [1.35, 0.4, 1.0], r: 0.013, E: 0.8, tau: 1.9, n: 'cáscara de papa' },
  verdura: { c: [0x5f9b3b, 0x7fb24a], s: [1.4, 0.45, 1.1], r: 0.015, E: 0.6, tau: 1.5, n: 'restos de verdura' },
  fruta: { c: [0xe5812f, 0xd96a26], s: [1.1, 0.8, 1.0], r: 0.015, E: 0.9, tau: 1.8, n: 'cáscara de fruta' },
  huevo: { c: [0xf0e7d6, 0xe3d3b8], s: [1.1, 0.32, 1.0], r: 0.011, E: 0.35, tau: 1.2, n: 'cáscara de huevo' },
  tusa: { c: [0xdcc57e, 0xc9ae62], s: [0.9, 0.9, 2.1], r: 0.015, E: 3.6, tau: 6.5, n: 'tusa de mazorca' },
  cafe: { c: [0x3b2a20, 0x4a3426], s: [1, 1, 1], r: 0.006, E: 0, tau: 0.3, n: 'cuncho de café' },
  aserrin: { c: [0xd8b47a, 0xc9a266], s: [1.2, 0.6, 1.1], r: 0.0032, E: 0, tau: 0, n: 'aserrín' },
};
const R_PASS = 0.0066;
const E_SCALE = 6;          // ≈180 J por porción de 460 g: unas 15-20 pisadas       // ≤ 13 mm de tamaño: ya pasa entre las cuchillas
const MAXP = 1400;
const P = [];                // partículas vivas
const pGeo = (() => { const gg = new THREE.IcosahedronGeometry(1, 2), p = gg.attributes.position; for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); const n = 1 + 0.22 * Math.sin(v.x * 5.1 + v.y * 3.3) * Math.cos(v.z * 4.7 - v.y * 2.1) + (Math.random() - 0.5) * 0.12; v.multiplyScalar(n); p.setXYZ(i, v.x, v.y, v.z); } gg.computeVertexNormals(); return gg; })();
const pMat = new THREE.MeshStandardMaterial({ roughness: 0.72, metalness: 0 });
const pInst = new THREE.InstancedMesh(pGeo, pMat, MAXP); pInst.castShadow = true; pInst.receiveShadow = true; pInst.count = 0; pInst.frustumCulled = false;
pInst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAXP * 3), 3);
machine.add(pInst); tag(pInst, info('residuo'));
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s3 = new THREE.Vector3(), _p3 = new THREE.Vector3(), _col = new THREE.Color();

function spawn(type, x, y, z, r, m, E, vx = 0, vy = 0, vz = 0) {
  if (P.length >= MAXP) return null;
  const t = WT[type];
  const p = { type, x, y, z, vx, vy, vz, r, m, E, E0: E, rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6, w: [(Math.random() - .5) * 8, (Math.random() - .5) * 8, (Math.random() - .5) * 8], col: t.c[Math.random() < 0.5 ? 0 : 1], pass: 0, leaf: 0, s: 0, nip: false, shade: 0.85 + Math.random() * 0.3 };
  P.push(p); return p;
}
// una porción de 460 g (lo que entrega un hogar en un día, según el estudio)
function dropPortion() {
  const mix = ['platano', 'platano', 'papa', 'papa', 'papa', 'verdura', 'verdura', 'verdura', 'fruta', 'fruta', 'huevo', 'huevo', 'tusa', 'cafe', 'cafe', 'cafe', 'cafe', 'cafe', 'cafe'];
  const vol = mix.map(k => WT[k].r ** 3), tv = vol.reduce((a, b) => a + b, 0);
  mix.forEach((k, i) => {
    const t = WT[k], r = t.r * (0.85 + Math.random() * 0.3);
    setTimeout(() => spawn(k, (Math.random() - 0.5) * 0.14, 0.72 + Math.random() * 0.12, 0.02 + (Math.random() - 0.5) * 0.1, r, 0.46 * vol[i] / tv, E_SCALE * t.E * (0.8 + Math.random() * 0.4), 0, -0.3, 0), i * 45);
  });
}
function spawnSawdust() {
  const n = 54, m = SAW.dose / 1000 / n;
  for (let i = 0; i < n; i++) {
    const side = i % 3; let x, z, vx = 0, vz = 0; const sp = 0.25 + Math.random() * 0.75;
    if (side === 0) { x = (Math.random() - 0.5) * 0.3; z = -0.133; vz = sp; }
    else { x = side === 1 ? -0.152 : 0.152; z = -0.1 + Math.random() * 0.2; vx = (side === 1 ? 1 : -1) * sp; }
    setTimeout(() => spawn('aserrin', x, 0.289, z, 0.0026 + Math.random() * 0.0014, m, 0, vx, -0.1, vz), Math.random() * 180);
  }
}
function split(p) { // la cuchilla parte el trozo en dos (la pulpa se compacta: 50-60 % menos volumen)
  const n = 2, r2 = p.r * 0.72;
  for (let k = 0; k < n; k++) {
    const q = spawn(p.type, p.x + (k ? 1 : -1) * r2 * 0.6, p.y, p.z + (Math.random() - .5) * 0.004, r2, p.m / n, p.E0 * 0.5, 0, -0.05, 0);
    if (q) q.col = p.col;
  }
  p.dead = true; S.crushedTotal += p.m;
}

// ---------- Montón (campo de alturas) dentro de la bolsa ----------
const HP = { NX: 34, NZ: 30, w: 0.326, d: 0.286, base: 0.0375, rho: 600, dirty: true };
HP.cx = HP.w / (HP.NX - 1); HP.cz = HP.d / (HP.NZ - 1); HP.h = new Float32Array(HP.NX * HP.NZ); HP.cov = new Float32Array(HP.NX * HP.NZ);
HP.cap = D.dr.h + 0.016 - HP.base;
const heapGeo = new THREE.PlaneGeometry(HP.w, HP.d, HP.NX - 1, HP.NZ - 1); heapGeo.rotateX(-Math.PI / 2);
{ const cols = new Float32Array(heapGeo.attributes.position.count * 3); for (let i = 0; i < cols.length; i += 3) { const v = 0.8 + Math.random() * 0.4; cols[i] = v; cols[i + 1] = v * (0.92 + Math.random() * 0.12); cols[i + 2] = v * 0.9; } heapGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3)); heapGeo.userData.base = Float32Array.from(cols); }
const heapTex = canvasTex(256, 256, (x, W, H) => {
  x.fillStyle = '#6b4a2e'; x.fillRect(0, 0, W, H);
  const cols = ['#4e3420', '#7a5634', '#5d6b2c', '#8a6a2a', '#3a2a1c', '#a0762e', '#6f7d34', '#c28b3c'];
  for (let i = 0; i < 2600; i++) { x.fillStyle = cols[i % cols.length]; x.globalAlpha = 0.35 + Math.random() * 0.5; const r = 1 + Math.random() * 4; x.beginPath(); x.ellipse(Math.random() * W, Math.random() * H, r, r * (0.4 + Math.random()), Math.random() * 3, 0, 6.3); x.fill(); }
}, [3, 3]);
const heapMesh = mesh(heapGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, map: heapTex, bumpMap: heapTex, bumpScale: 2.5 }));
heapMesh.visible = false; bag.grp.add(tag(heapMesh, info('monton')));
function heapLocal(xl, zl) {
  const fx = (xl + HP.w / 2) / HP.cx, fz = (zl + HP.d / 2) / HP.cz;
  if (fx < 0 || fz < 0 || fx > HP.NX - 1 || fz > HP.NZ - 1) return 0;
  const i = Math.min(HP.NX - 2, Math.floor(fx)), j = Math.min(HP.NZ - 2, Math.floor(fz)), u = fx - i, v = fz - j, H = HP.h, N = HP.NX;
  return lerp(lerp(H[j * N + i], H[j * N + i + 1], u), lerp(H[(j + 1) * N + i], H[(j + 1) * N + i + 1], u), v);
}
heapWorldY = (x, z) => {
  if (bag.state === 'removing' || S.e > 0.02) return -1;
  const zl = z - drawer.grp.position.z, h = heapLocal(x, zl);
  return h > 0.0005 ? drawer.grp.position.y + HP.base + h : -1;
};
function heapAdd(xl, zl, mass, saw = false) {
  const V = mass / (saw ? 200 : HP.rho), fx = (xl + HP.w / 2) / HP.cx, fz = (zl + HP.d / 2) / HP.cz, R = 2.2, N = HP.NX;
  let W = 0; const cells = [];
  for (let j = Math.floor(fz - R); j <= Math.ceil(fz + R); j++) for (let i = Math.floor(fx - R); i <= Math.ceil(fx + R); i++) {
    if (i < 0 || j < 0 || i >= N || j >= HP.NZ) continue; const d2 = (i - fx) ** 2 + (j - fz) ** 2; if (d2 > R * R) continue;
    const w = Math.exp(-d2 / 1.6); W += w; cells.push([j * N + i, w]);
  }
  const A = HP.cx * HP.cz; for (const [k, w] of cells) { const dh = V * w / W / A; HP.h[k] += dh; HP.cov[k] = clamp(HP.cov[k] + (saw ? dh / 0.0012 : -dh / 0.002), 0, 1); }
  S.bagMass += mass; HP.dirty = true;
}
function heapRelax(iter) { // talud natural de la pulpa ≈ 42°
  const N = HP.NX, M2 = HP.NZ, H = HP.h, mx = Math.tan(42 * Math.PI / 180) * HP.cx;
  for (let it = 0; it < iter; it++) {
    let moved = false;
    for (let j = 0; j < M2; j++) for (let i = 0; i < N; i++) {
      const k = j * N + i;
      if (H[k] > HP.cap) { const ex = H[k] - HP.cap; H[k] = HP.cap; spreadAround(i, j, ex); }
      for (const [di, dj] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= M2) continue;
        const kk = jj * N + ii, diff = H[k] - H[kk];
        if (diff > mx) { const t = (diff - mx) * 0.22; H[k] -= t; H[kk] += t; moved = true; }
      }
    }
    if (!moved) break; HP.dirty = true;
  }
}
function spreadAround(i, j, ex) { const N = HP.NX, nb = []; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const ii = i + di, jj = j + dj; if ((di || dj) && ii >= 0 && jj >= 0 && ii < N && jj < HP.NZ && HP.h[jj * N + ii] < HP.cap) nb.push(jj * N + ii); } if (!nb.length) return; nb.forEach(k => HP.h[k] += ex / nb.length); }
function heapUpdateMesh() {
  if (!HP.dirty) return; HP.dirty = false;
  const pos = heapGeo.attributes.position, col = heapGeo.attributes.color, base = heapGeo.userData.base; let any = false;
  for (let j = 0; j < HP.NZ; j++) for (let i = 0; i < HP.NX; i++) {
    const k = j * HP.NX + i, h = HP.h[k], c = HP.cov[k]; if (h > 0.0008) any = true;
    pos.setY(k, h > 0.0008 ? HP.base + h : HP.base - 0.004);
    col.setXYZ(k, lerp(base[k * 3], 2.0, c), lerp(base[k * 3 + 1], 1.62, c), lerp(base[k * 3 + 2], 1.05, c));
  }
  pos.needsUpdate = true; col.needsUpdate = true; heapGeo.computeVertexNormals(); heapMesh.visible = any;
}
function heapReset() { HP.h.fill(0); HP.cov.fill(0); S.bagMass = 0; HP.dirty = true; }
function addDays(days) { // material ya molido de días anteriores
  const kg = 0.46 * days;
  for (let i = 0; i < 40; i++) heapAdd((Math.random() - .5) * 0.06, (Math.random() - .5) * 0.06 + (-drawer.grp.position.z + 0.0), kg / 40);
  heapRelax(400);
  for (let k = 0; k < HP.h.length; k++) if (HP.h[k] > 0.002) HP.cov[k] = 1; // cada día se cubrió con su dosis
  S.x = (D.tray.m + tareKg + S.bagMass) * g / K.kTray; S.vx = 0; // días de uso: la bandeja ya está en reposo
}

// ---------- Paso de partículas ----------
const PH = { mu: 0.8, muK: 0.45 };
const hash = new Map();
function stepParticles(dt) {
  const R = D.roll, G = D.gate, wC = -S.wB / T.red; // rodillo delantero gira en −x
  const turning = Math.abs(wC) > 0.25;
  let loadC = 0; const nipList = [];
  const lidClosedish = S.th < 0.35;
  for (const p of P) {
    if (p.dead) continue;
    p.nip = false;
    if (p.refill) { p.vy -= g * dt; p.y += p.vy * dt; if (p.y < 0.63) p.dead = true; continue; }
    if (p.pass > 0) { // atravesando la mordida de los rodillos
      if (p.y < R.y - 0.042) p.pass = 0; p.vx *= 0.9; p.vz = -p.z * 20; p.vy = -Math.max(0.25, Math.abs(wC) * 0.033);
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; continue;
    }
    p.px = p.x; p.py = p.y; p.pz = p.z;
    p.vy -= g * dt; const dmp = 1 - 0.25 * dt; p.vx *= dmp; p.vy *= dmp; p.vz *= dmp;
    p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    // tapa cerrándose sobre la boca: empuja hacia adentro
    if (p.y > D.frameTop - p.r && lidClosedish) { p.y = D.frameTop - p.r; p.vy = Math.min(p.vy, 0); }
    // paredes: boca/tolva, cámara
    if (p.y > 0.598) { const b = D.boca / 2 - p.r; if (p.y < D.frameTop + 0.2) { p.x = clamp(p.x, -b, b); p.z = clamp(p.z, -b, b); } }
    else if (p.y > D.ch.y0 - 0.01) { const bx = D.ch.hx - p.r, bz = D.ch.hz - p.r; if (Math.abs(p.x) > bx) { p.x = Math.sign(p.x) * bx; p.vx *= -0.2; } if (Math.abs(p.z) > bz) { p.z = Math.sign(p.z) * bz; p.vz *= -0.2; } }
    // deflector y guías (placas inclinadas en el plano y-z)
    for (const gd of D.guides) plate(p, gd.a, gd.b, D.ch.hx, 0.35);
    // rodillos: cilindros de contacto (radio efectivo entre cuchilla y separador)
    if (p.y > R.y - 0.06 && p.y < R.y + 0.08) {
      let touch = 0;
      for (const sgn of [1, -1]) {
        const zc = sgn * R.z, qy = p.y - R.y, qz = p.z - zc, dd = Math.hypot(qy, qz), Re = 0.033;
        if (dd < Re + p.r) {
          touch++;
          const ny = qy / dd, nz = qz / dd, pen = Re + p.r - dd; p.y += ny * pen; p.z += nz * pen;
          const vn = p.vy * ny + p.vz * nz; if (vn < 0) { p.vy -= vn * ny * 1.1; p.vz -= vn * nz * 1.1; }
          const w = sgn > 0 ? wC : -wC; // el trasero gira al revés (engranajes 1:1)
          const sy = -w * Re * nz, sz = w * Re * ny; // velocidad de la superficie
          const grip = turning ? 0.12 : 0.04; p.vy += (sy - p.vy) * grip; p.vz += (sz - p.vz) * grip;
        }
      }
      if (touch === 2 || (Math.abs(p.z) < 0.012 && p.y < R.y + 0.045 && p.y > R.y - 0.01 && touch)) {
        p.nip = true;
        if (turning) {
          if (p.r <= R_PASS) { p.pass = 1; }
          else nipList.push(p);
        }
      }
    }
    // dentro del cajón: paredes de la bolsa y montón
    if (p.y < D.ch.y0 - 0.005) {
      const zc = drawer.grp.position.z;
      if (S.e < 0.02 && bag.state !== 'removing') {
        const bx = D.dr.w / 2 - 0.01 - p.r, bz = D.dr.d / 2 - 0.01 - p.r;
        p.x = clamp(p.x, -bx, bx); p.z = clamp(p.z, zc - bz, zc + bz);
        const hy = heapWorldY(p.x, p.z), floorY = drawer.grp.position.y + HP.base;
        if (p.y - p.r * 0.5 <= Math.max(hy, floorY)) { heapAdd(p.x, p.z - zc, p.m, p.type === 'aserrin'); S.vx += p.m * Math.max(0, -p.vy) / (D.tray.m + K.mDrawer + S.bagMass); p.dead = true; continue; }
      } else if (p.y < 0.07) { S.spilled += p.m; p.dead = true; continue; }
    }
    if (p.y < p.r) { p.y = p.r; p.vy = 0; p.vx *= 0.8; p.vz *= 0.8; }
    const sp = Math.hypot(p.vx, p.vy, p.vz); p.rx += p.w[0] * dt * Math.min(1, sp * 3); p.ry += p.w[1] * dt * Math.min(1, sp * 3); p.rz += p.w[2] * dt * Math.min(1, sp * 3);
  }
  // choques entre trozos (retícula espacial): permite que se apilen sobre la compuerta y en los rodillos
  hash.clear(); const cs = 0.016;
  for (let i = 0; i < P.length; i++) { const p = P[i]; if (p.dead || p.pass > 0 || p.y < D.roll.y - 0.05) continue; const k = (Math.floor(p.x / cs) * 92837111) ^ (Math.floor(p.y / cs) * 689287499) ^ (Math.floor(p.z / cs) * 283923481); let a = hash.get(k); if (!a) hash.set(k, a = []); a.push(i); }
  for (let i = 0; i < P.length; i++) {
    const p = P[i]; if (p.dead || p.pass > 0 || p.y < D.roll.y - 0.05) continue;
    const ix = Math.floor(p.x / cs), iy = Math.floor(p.y / cs), iz = Math.floor(p.z / cs);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
      const arr = hash.get(((ix + a) * 92837111) ^ ((iy + b) * 689287499) ^ ((iz + c) * 283923481)); if (!arr) continue;
      for (const j of arr) {
        if (j <= i) continue; const q = P[j]; if (q.dead || q.pass > 0) continue;
        const dx = q.x - p.x, dy = q.y - p.y, dz = q.z - p.z, rr = (p.r + q.r) * 0.82, d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < rr * rr && d2 > 1e-10) {
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, nz = dz / d, pen = (rr - d) * 0.5;
          p.x -= nx * pen; p.y -= ny * pen; p.z -= nz * pen; q.x += nx * pen; q.y += ny * pen; q.z += nz * pen;
          const rv = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny + (q.vz - p.vz) * nz;
          if (rv < 0) { const im = rv * 0.5; p.vx += nx * im; p.vy += ny * im; p.vz += nz * im; q.vx -= nx * im; q.vy -= ny * im; q.vz -= nz * im; }
        }
      }
    }
  }
  // las cuchillas cortan a la vez como máximo los dos trozos más hondos de la mordida
  nipList.sort((a, b) => a.y - b.y);
  for (let i = 0; i < Math.min(2, nipList.length); i++) {
    const p = nipList[i], tq = WT[p.type].tau * Math.pow(p.r / WT[p.type].r, 1.5); loadC += tq; // par ∝ sección del trozo
    p.E -= tq * Math.abs(wC) * dt; p.rx += 0.4; if (p.E <= 0) split(p);
  }
  if (nipList.length && !turning) loadC = 0;
  S.loadC = loadC;
  for (let i = P.length - 1; i >= 0; i--) if (P[i].dead) P.splice(i, 1);
}
function plate(p, a, b, hw, mu) {
  if (Math.abs(p.x) > hw) return;
  const ty = b.y - a.y, tz = b.z - a.z, L2 = ty * ty + tz * tz, t = ((p.y - a.y) * ty + (p.z - a.z) * tz) / L2;
  if (t < 0 || t > 1) return;
  const L = Math.sqrt(L2); let ny = -tz / L, nz = ty / L; if (ny < 0) { ny = -ny; nz = -nz; }
  const d = (p.y - a.y) * ny + (p.z - a.z) * nz, dp = ((p.py ?? p.y) - a.y) * ny + ((p.pz ?? p.z) - a.z) * nz;
  const side = dp >= 0 ? 1 : -1; // de qué lado venía: la placa tiene dos caras y no se atraviesa
  if (side * d < p.r) {
    ny *= side; nz *= side; const dd = d * side;
    p.y += ny * (p.r - dd); p.z += nz * (p.r - dd);
    const vn = p.vy * ny + p.vz * nz; if (vn < 0) { p.vy -= vn * ny * 1.15; p.vz -= vn * nz * 1.15; }
    // rozamiento de Coulomb sobre la placa (μ ≈ 0,35 pulpa húmeda sobre inox)
    const vn2 = p.vy * ny + p.vz * nz, ty2 = p.vy - vn2 * ny, tz2 = p.vz - vn2 * nz, vt = Math.hypot(ty2, tz2, p.vx);
    if (vt > 1e-5) { const k = Math.max(0, 1 - mu * g * Math.abs(ny) * (1 / 180) / vt); p.vy = vn2 * ny + ty2 * k; p.vz = vn2 * nz + tz2 * k; p.vx *= k; }
  }
}
function drawParticles() {
  let n = 0;
  for (const p of P) {
    const t = WT[p.type], sc = p.r * (p.nip ? 0.94 + Math.random() * 0.08 : 1);
    _q.setFromEuler(_e.set(p.rx, p.ry, p.rz)); _s3.set(t.s[0] * sc, t.s[1] * sc, t.s[2] * sc);
    _m4.compose(_p3.set(p.x, p.y, p.z), _q, _s3); pInst.setMatrixAt(n, _m4);
    _col.setHex(p.col).multiplyScalar(p.shade * (p.r < 0.009 ? 0.82 : 1)); pInst.setColorAt(n, _col); n++;
  }
  pInst.count = n; pInst.instanceMatrix.needsUpdate = true; if (pInst.instanceColor) pInst.instanceColor.needsUpdate = true;
}
