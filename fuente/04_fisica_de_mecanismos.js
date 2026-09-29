
// =====================================================================
//  FÍSICA DE MECANISMOS (integración semi-implícita a 1 kHz)
// =====================================================================
const S = {
  th: 0, om: 0, lidHand: null,                       // tapa: ángulo (rad), velocidad
  lat: 1, latT: 1, engaged: true,                    // gancho: 0 abierto … 1 cerrado
  sR: 0, vR: 0, footR: false, auto: false, autoPress: false, autoT: 0, lockD: 0,
  wB: 0, thB: 0, thPin: 0, lockR: 0, loadC: 0, engagedFW: false,
  sL: 0, vL: 0, footL: false, lockL: 0,
  saw: 0, sawG: 700, sawArmed: true, doses: 0, hatchOpen: 0,
  de: 0, wd: 0, doorHand: null, doorLatched: true,
  e: 0, ve: 0, drawerHand: null,
  x: 0, vx: 0, key: 0,
  bagMass: 0, spilled: 0, crushedTotal: 0,
};
const K = {
  thSeat: 0.0035 / lid.L, thMax: 1.83,               // 105° tope de bisagra
  mR: 0.45, F0R: 14, kR: 380, Ffoot: 420, vFoot: 0.62,// pie: F = Fmax(1 − v/vmax)
  IB: 0.0046, tauC: 0.028, bB: 1.6e-4, brake: 1.7,   // volante 1,45 kg Ø14 cm
  mL: 0.4, F0L: 10, kL: 300, kot: 8000, rc: 0.025,   // cable con resorte de sobrecarrera
  kPlate: 350,
  kD: 0.55, tD0: 0.15, cD: 0.12,
  kTray: D.tray.k, trayFree: 0.0606, trayStop: 0.016,
  mDrawer: 1.35 + 0.25, mBag: 0.05, redKg: 10.2, fullKg: 12,
};
const tareKg = K.mDrawer + K.mBag;
// ---------- Gancho: geometría del estribo → compresión real del empaque ----------
const _a = new THREE.Vector3(), _b = new THREE.Vector3();
function latchAttach(lam, out) { const a = -1.9 * (1 - lam), ly = -0.012, lz = 0.009; return out.set(0, latch.y + ly * Math.cos(a) - lz * Math.sin(a), latch.z + ly * Math.sin(a) + lz * Math.cos(a)); }
function unaPos(th, out) { const ly = 0.018, lz = lid.L + 0.008; return out.set(0, lid.hingeY + ly * Math.cos(th) + lz * Math.sin(th), lid.hingeZ - ly * Math.sin(th) + lz * Math.cos(th)); }
const BAIL = (() => { latchAttach(1, _a); unaPos(K.thSeat, _b); return _a.distanceTo(_b) - 0.0035; })();
function latchComp(lam) { latchAttach(lam, _a); unaPos(K.thSeat, _b); return clamp(_a.distanceTo(_b) - BAIL, 0, 0.0036); }
const sealed = () => S.engaged && latchComp(S.lat) >= 0.003;

// ---------- Colisión puerta ↔ cajón (geometría real, se resuelve por bisección) ----------
function trayTop() { return K.trayFree - S.x; }
function drawerY(e) { return lerp(trayTop(), 0.0622, smooth(0, 0.012, e)); }
function doorHits(de, e) {
  const zF = D.dr.z0 + D.dr.d + e, yb = drawerY(e), yt = yb + D.dr.h;
  const pts = [[yt, zF], [yb + 0.5 * D.dr.h, zF], [yb, zF], [yb + D.dr.h - 0.04, zF + 0.014]];
  for (let k = 1; k <= 6; k++) pts.push([yb, zF - k * 0.05]);
  const c = Math.cos(de), s = Math.sin(de);
  for (const [y, z] of pts) {
    const Y = y - door.y, Z = z - door.z, yl = Y * c + Z * s, zl = -Y * s + Z * c;
    if (yl > -0.002 && yl < door.h && zl > -0.0235 && zl < 0.004) return true;
  }
  return false;
}
function solveConstraint(oldV, newV, hits) { // devuelve el valor admisible más cercano a newV
  if (!hits(newV)) return [newV, false];
  if (hits(oldV)) return [oldV, true];
  let a = oldV, b = newV; for (let i = 0; i < 14; i++) { const m = (a + b) / 2; if (hits(m)) b = m; else a = m; } return [a, true];
}

let heapWorldY = () => -1; // se define con el montón (p5)
// ---------- Paso de mecanismos ----------
const EV = { lidThud: 0, doorThud: 0, clicks: 0, latchClack: 0, lockBlockR: 0, lockBlockL: 0, lockWhyR: '', dose: 0, noSaw: 0 };
function footForce(pressing, v) { return pressing ? K.Ffoot * clamp(1 - v / K.vFoot, 0, 1) : 0; }

function stepMech(dt) {
  // ----- GANCHO -----
  const latPrev = S.lat;
  S.lat += clamp(S.latT - S.lat, -5 * dt, 5 * dt);
  if (latPrev < 0.5 && S.lat >= 0.5) { S.engaged = S.th < K.thSeat + 0.012; EV.latchClack = 1; }
  if (latPrev >= 0.3 && S.lat < 0.3) { S.engaged = false; EV.latchClack = 1; }
  const comp = S.engaged ? latchComp(S.lat) : 0;
  // ----- TAPA -----
  const thLow = K.thSeat - comp / lid.L, thHigh = S.engaged ? thLow : K.thMax;
  let tq = -lid.m * g * lid.rc * Math.cos(S.th + lid.phic);
  tq += (S.om < 0 && S.th < 0.9) ? -0.42 * S.om : -0.02 * S.om; // amortiguador de cierre suave
  tq -= Math.sign(S.om) * 0.025;
  if (S.lidHand !== null) tq += clamp(16 * (S.lidHand - S.th) - 1.1 * S.om, -12, 12);
  S.om += tq / lid.I * dt; S.th += S.om * dt;
  if (S.th < thLow) { if (S.om < -0.6) EV.lidThud = Math.max(EV.lidThud, -S.om); S.th = thLow; S.om = Math.max(0, S.om); }
  if (S.th > thHigh) { S.th = thHigh; S.om = S.engaged ? Math.min(0, S.om) : -0.15 * Math.abs(S.om); }
  // ----- SEGURO DEL PEDAL DERECHO (pasador bajo la palanca) -----
  // el pasador rojo entra bajo la palanca si la tapa no está apretada por el gancho O si la puerta frontal está abierta
  const wantLockR = sealed() ? 0 : 1, wantLockD = S.de > 0.03 ? 1 : 0;
  if (!(wantLockR > S.lockR && S.sR > 0.0025)) S.lockR += clamp(wantLockR - S.lockR, -30 * dt, 30 * dt); // con la palanca abajo, el pasador espera
  if (!(wantLockD > S.lockD && S.sR > 0.0025)) S.lockD += clamp(wantLockD - S.lockD, -30 * dt, 30 * dt);
  // ----- PEDAL DERECHO + RUEDA LIBRE + VOLANTE -----
  const Ff = footForce(S.footR || S.autoPress, S.vR);
  const Fnet = Ff - (K.F0R + K.kR * S.sR) - 4 * S.vR; // 4 N·s/m: fuelle + roce
  const brake = S.lat < 0.85 ? K.brake : 0;
  // par resistente en el eje del volante: roce + freno + corte de las cuchillas (÷5 por el reductor)
  const tauRes = K.tauC + K.bB * S.wB + brake + S.loadC / T.red;
  const aR = Fnet / K.mR, aB = S.wB > 1e-4 ? -tauRes / K.IB : 0;
  let engaged = S.vR * T.G >= S.wB - 1e-6 && aR * T.G > aB && S.vR >= 0 && Fnet > 0;
  if (engaged) { // la rueda libre traba: pedal y volante se mueven juntos (masa reflejada I·G²)
    const a = (Fnet - tauRes * T.G) / (K.mR + K.IB * T.G * T.G);
    if (S.wB <= 1e-4 && a <= 0) { S.vR = 0; S.wB = 0; } // el pie no vence la resistencia estática: no se mueve
    else { S.vR += a * dt; S.wB = Math.max(0, S.vR * T.G); }
  } else { S.vR += aR * dt; S.wB = Math.max(0, S.wB + aB * dt); }
  S.engagedFW = engaged;
  const sPrev = S.sR; S.sR += S.vR * dt;
  const blockedR = S.lockR > 0.5 || S.lockD > 0.5, sLim = blockedR ? 0.0015 : T.sMax;
  if (S.sR > sLim) { S.sR = sLim; S.vR = Math.min(S.vR, 0); if (blockedR && (S.footR || S.autoPress)) { EV.lockBlockR = 1; EV.lockWhyR = S.lockR > 0.5 ? 'lid' : 'door'; } }
  if (S.sR < 0) { S.sR = 0; S.vR = Math.max(S.vR, 0); }
  S.thB += S.wB * dt;
  const pinStep = (S.sR - sPrev) * (T.armRack / T.armPad) / T.rPin;
  S.thPin += pinStep;
  if (pinStep < 0) EV.clicks += -pinStep; // trinquetes de la rueda libre al regresar
  // ----- PEDAL IZQUIERDO: cable → placa dosificadora en U (15 mm) -----
  const wantLockL = S.de > 0.03 ? 1 : 0;
  if (!(wantLockL > S.lockL && S.sL > 0.0025)) S.lockL += clamp(wantLockL - S.lockL, -30 * dt, 30 * dt);
  const FfL = footForce(S.footL, S.vL);
  const plateF = K.kPlate * S.saw * SAW.travel / ((T.armCable / T.armPad)); // resorte de la placa reflejado al pedal
  S.vL += (FfL - (K.F0L + K.kL * S.sL) - plateF - 3 * S.vL) / K.mL * dt;
  S.sL += S.vL * dt;
  const sLimL = S.lockL > 0.5 ? 0.0015 : T.sMax;
  if (S.sL > sLimL) { S.sL = sLimL; S.vL = Math.min(0, S.vL); if (S.lockL > 0.5 && S.footL) EV.lockBlockL = 1; }
  if (S.sL < 0) { S.sL = 0; S.vL = Math.max(0, S.vL); }
  const sawPrev = S.saw; S.saw = clamp((T.armCable / T.armPad) * S.sL / 0.036, 0, 1); // 36 mm de cable = 15 mm de placa (palanca 2,4:1)
  if (S.saw < 0.15) S.sawArmed = true; // las celdas vuelven bajo el depósito y se llenan
  if (sawPrev < 0.9 && S.saw >= 0.9 && S.sawArmed) { S.sawArmed = false; if (S.sawG >= SAW.dose) { S.sawG -= SAW.dose; S.doses++; EV.dose = 1; } else EV.noSaw = 1; }
  // ----- PUERTA FRONTAL -----
  const reading = scaleReading();
  const unlocked = reading >= K.redKg || S.key > 0;
  if (unlocked) S.doorLatched = false;
  let tdq = door.m * g * (door.h / 2) * Math.sin(S.de) - (K.tD0 + K.kD * S.de) - K.cD * S.wd;
  if (S.de < 0.025 && !S.doorLatched) tdq -= 0.25; // imán del empaque
  if (S.doorHand !== null) tdq += clamp(9 * (S.doorHand - S.de) - 0.5 * S.wd, -8, 8);
  const deOld = S.de; S.wd += tdq / door.I * dt; let deNew = S.de + S.wd * dt;
  if (S.doorLatched) deNew = Math.min(deNew, 0.004);
  if (deNew > Math.PI / 2) { deNew = Math.PI / 2; if (S.wd > 0.8) EV.doorThud = Math.max(EV.doorThud, S.wd * 0.4); S.wd = Math.min(0, S.wd) * -0.1; }
  if (deNew < 0) { if (S.wd < -0.8) EV.doorThud = Math.max(EV.doorThud, -S.wd * 0.5); deNew = 0; S.wd = 0; }
  const [deOk, hitD] = solveConstraint(deOld, deNew, v => doorHits(v, S.e));
  if (hitD) S.wd = 0; S.de = deOk;
  if (S.de < 0.004 && !unlocked && !S.doorLatched) { S.doorLatched = true; EV.latchClack = 1; }
  // ----- CAJÓN sobre rieles -----
  const md = K.mDrawer + (bag.state === 'none' ? 0 : K.mBag) + S.bagMass;
  let F = -Math.sign(S.ve) * 0.05 * md * g - 2 * S.ve;
  if (S.drawerHand !== null) F += clamp(320 * (S.drawerHand - S.e) - 28 * S.ve, -70, 70);
  const eOld = S.e; S.ve += F / md * dt; let eNew = S.e + S.ve * dt;
  if (eNew > 0.26) { eNew = 0.26; S.ve = Math.min(0, S.ve); }
  if (eNew < 0) { eNew = 0; S.ve = Math.max(0, S.ve); }
  const [eOk, hitE] = solveConstraint(eOld, eNew, v => doorHits(S.de, v));
  if (hitE) S.ve = 0; S.e = eOk;
  // ----- BÁSCULA: bandeja sobre 4 resortes (masa-resorte-amortiguador) -----
  const onTray = 1 - smooth(0, 0.012, S.e);
  const Mt = D.tray.m + md * onTray, c = 2 * 0.28 * Math.sqrt(K.kTray * Mt);
  S.vx += (Mt * g - K.kTray * S.x - c * S.vx) / Mt * dt; S.x += S.vx * dt;
  if (S.x > K.trayStop) { S.x = K.trayStop; S.vx = Math.min(0, S.vx); }
  if (S.key > 0) S.key -= dt;
}
function scaleReading() { return (K.kTray * S.x / g) - D.tray.m - tareKg; } // kg de contenido que "ve" la aguja

// ---------- Pedaleo rítmico (el pie baja y sube solo) ----------
function stepAuto(dt) {
  if (!S.auto) { S.autoPress = false; return; }
  S.autoT += dt;
  if (S.autoPress) { if (S.sR >= T.sMax * 0.97 || S.autoT > 0.55 || ((S.lockR > 0.5 || S.lockD > 0.5) && S.autoT > 0.25)) { S.autoPress = false; S.autoT = 0; } }
  else if (S.sR < 0.004 && S.autoT > 0.18) { S.autoPress = true; S.autoT = 0; }
}
