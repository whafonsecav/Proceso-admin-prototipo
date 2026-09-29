const $ = (id) => document.getElementById(id);
const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',');

// =====================================================================
//  MANUAL: cómo funciona, cómo se arma y lista de piezas
// =====================================================================
const VIEWS = {
  seguro: { cam: [[0.98, 0.52, 1.18], [0.02, 0.35, 0.12]], trans: 75, call: 'seguro' },
  transmision: { cam: [[1.3, 0.46, 0.5], [0.1, 0.3, 0.02]], trans: 75, call: 'transmision' },
  rodillos: { cam: [[0.62, 0.82, 0.78], [-0.03, 0.45, 0]], trans: 80, call: null },
  aserrin: { cam: [[-0.8, 0.98, 1.0], [0.06, 0.36, 0]], trans: 80, call: 'aserrin' },
  bascula: { cam: [[0.88, 0.34, 1.08], [-0.01, 0.22, 0.1]], trans: 80, call: 'bascula' },
  olor: { cam: [[-0.5, 0.95, -1.15], [0.08, 0.42, -0.08]], trans: 75, call: 'olor' },
  puerta: { cam: [[0.95, 0.62, 1.35], [-0.05, 0.16, 0.2]], trans: 50, call: null },
};
const MANUAL = `
<details open><summary>Cómo se usa (ciclo de uso)</summary><div class="in"><p>Todo se hace desde el modo <b>Libre</b> (botones) o directamente sobre el modelo: arrastra la tapa, la puerta, el cajón o la bolsa, mantén presionado un pedal o haz doble clic para abrir y cerrar.</p><ol>
<li>Suelta el <b>gancho</b> del frente y <b>abre la tapa</b>.</li>
<li>Si hace falta, levanta la <b>tapa del aserrín</b> (los listones color madera bajo la tapa) y recarga el depósito.</li>
<li><b>Echa los residuos</b> del día (≈ 460 g) por la boca.</li>
<li><b>Baja la tapa</b> y <b>cierra el gancho</b>: el empaque sella y el pasador rojo sale de debajo del pedal.</li>
<li><b>Pisa el pedal derecho</b> varias veces: los rodillos muelen y la pulpa cae a la bolsa.</li>
<li><b>Pisa una vez el pedal izquierdo</b>: cae una dosis de aserrín que tapa lo molido.</li>
<li>Repite cada día. Cuando la <b>flecha</b> llegue al <b>rojo</b>, la puerta se destraba.</li>
<li>Antes de abrir, pisa <b>3 veces el pedal derecho</b>: el fuelle saca el aire del cajón por el carbón.</li>
<li>Abre la <b>puerta</b>, saca el <b>cajón</b>, levanta la <b>bolsa</b> (el cordón la cierra) y déjala al lado.</li>
<li>Pon una <b>bolsa nueva</b> (compartimento del frente del cajón), mete el cajón y cierra la puerta.</li></ol></div></details>
<details><summary>Qué es y medidas</summary><div class="in"><p>Triturador doméstico de residuos orgánicos <b>sin motor ni electricidad</b>. Se mueve con dos pedales. Cuerpo de 38 × 40 × 68 cm (medidas del modelo hogar) más 7 cm del carter de la transmisión y del canal izquierdo: <b>45 × 40 × 68 cm</b>.</p><ul><li>Cuerpo, tapa, puerta y cajón: polipropileno rotomoldeado (una sola pieza para el cuerpo, incluidos los depósitos de aserrín).</li><li>Cámara, embudo, cuchillas y separadores: acero inoxidable 304.</li><li>Ejes, engranajes, cadena, volante y resortes: acero; bocines de bronce.</li><li>Empaques: EPDM. Filtro: 250 g de carbón activado.</li><li>Cajón de 20 L con bolsa compostable; aviso de lleno a 10,2 kg (85 %).</li></ul></div></details>
<details><summary>1 · Seguro infantil (sistema rojo)</summary><div class="in"><p><b>¿Cómo "sabe" el pedal que la tapa está abierta?</b> No hay sensores: es una cadena de piezas de acero.</p><ol><li>La <b>lengüeta roja</b> de la tapa entra en una ranura del marco solo cuando la tapa está cerrada y el gancho la aprieta.</li><li>La lengüeta baja 4 mm el <b>pulsador</b> del marco.</li><li>El pulsador empuja la <b>varilla roja</b> que baja por la esquina delantera derecha.</li><li>Abajo, una <b>escuadra</b> convierte ese movimiento en horizontal…</li><li>…y saca el <b>pasador rojo</b> de debajo de la palanca del pedal.</li></ol><p>Con la tapa abierta, un resorte sube el pulsador y el pasador vuelve a entrar: el pedal choca con él a 1,5 mm y los rodillos no giran. Además, al soltar el gancho, el <b>cable de freno</b> baja una zapata sobre el volante (paro en menos de 1 s), y con la <b>puerta frontal abierta</b> sus pulsadores meten un segundo pasador bajo cada pedal.</p><button data-view="seguro">Mostrarme</button></div></details>
<details><summary>2 · Transmisión a pedal</summary><div class="in"><ol><li>Pedal con pivote atrás: el extremo que pisas baja 5,5 cm.</li><li>La palanca empuja una <b>cremallera</b> 33 mm.</li><li>La cremallera gira un <b>piñón con rueda libre</b>: al bajar, sus uñas se traban en una rueda de dientes de sierra fija al eje; al subir, resbalan (clic) y el eje sigue girando.</li><li><b>Cadena 24:8</b>: el eje del volante gira 3 veces más rápido.</li><li><b>Volante de 1,45 kg</b>: guarda unos 12 J por pisada y los entrega cuando las cuchillas muerden algo duro.</li><li><b>Reductor 10:50</b> y engranajes 1:1: los rodillos giran a unas 150 rpm, en sentidos opuestos y hacia el centro.</li></ol><p>Un resorte de torsión en el pivote sube el pedal; no mueve la cremallera.</p><button data-view="transmision">Mostrarme</button></div></details>
<details><summary>3 · Rodillos trituradores</summary><div class="in"><p>Dos ejes hexagonales con 10 y 9 cuchillas de gancho de Ø 72 mm, intercaladas con separadores: las cuchillas de un eje pasan entre las del otro con 1 mm de holgura. El embudo en V de 62° lleva todo a la mordida y termina a 2 mm de las cuchillas. Un peine fijo despega la pulpa. Sale material de 5-13 mm, ideal para compostar, y cae <b>directo a la bolsa</b>.</p><button data-view="rodillos">Mostrarme</button></div></details>
<details><summary>4 · Aserrín dosificado (pedal izquierdo)</summary><div class="in"><p>El depósito en U (≈ 5 L) rodea la cámara por atrás y por los lados: es el hueco que ya deja el cuerpo, así que casi no cuesta. Al pisar el pedal izquierdo, un cable desliza 15 mm una <b>placa de celdas en U</b>: las celdas llenas pasan sobre las ranuras del piso y cae una dosis fija (~30 mL) por <b>atrás, izquierda y derecha</b>, que tapa lo recién molido. Al soltar, un resorte regresa la placa y las celdas se vuelven a llenar: nunca cae de más.</p><p>El aserrín absorbe el agua libre (la que carga el olor), sube el carbono y mantiene la pulpa aireada, así no se pudre. Se recarga bajo la tapa principal, sin otra puerta hacia afuera.</p><button data-view="aserrin">Mostrarme</button></div></details>
<details><summary>5 · Control de olores sin electricidad</summary><div class="in"><ol><li><b>Sello</b>: empaque EPDM apretado 3,5 mm por el gancho (arriba) y empaque en la puerta (frente).</li><li><b>Fuelle</b> en el pedal derecho: cada pisada saca ~0,3 L de aire por una <b>rejilla atrás del compartimento del cajón, justo encima de la bolsa</b>, que es donde se junta el olor. La cámara de molido se ventila por el mismo camino, porque está abierta hacia el cajón. El interior queda en leve vacío: el aire entra al equipo, nunca sale a la cocina.</li><li><b>Carbón activado</b> (250 g): todo el aire que sale pasa por él.</li><li><b>Válvula de una sola vía</b>: es la única salida. Deja salir el aire filtrado y los gases que suelta la pulpa al descomponerse entre usos, pero nunca deja entrar aire de vuelta.</li><li><b>Aserrín</b>: cada dosis tapa la capa nueva.</li><li><b>Bolsa con cordón</b>: se cierra sola al levantarla.</li></ol><p>Consejo: antes de abrir el frente, pisa 3 veces el pedal derecho.</p><button data-view="olor">Mostrarme</button></div></details>
<details><summary>6 · Báscula e indicador (sistema azul)</summary><div class="in"><p>Sin engranajes ni piezas compradas: 4 resortes, un alambre, una palanca troquelada y un adhesivo impreso.</p><ol><li>El cajón descansa en una bandeja sobre <b>4 resortes</b> que suman 9,81 N/mm: cada kilo la baja 1 mm (ley de Hooke: F = k·x).</li><li>Un <b>alambre</b> baja con la bandeja y tira del brazo corto (9 mm) de una <b>palanca en L</b>.</li><li>El brazo largo de esa palanca <b>es la flecha</b>: gira unos 6° por kilo sobre una <b>lámina de colores</b> detrás de una ventana. 12,5 kg recorren 80°.</li><li>Cuando la flecha entra al rojo (10,2 kg), el brazo de abajo de la misma palanca empuja una varilla que levanta el <b>trinquete</b> de la puerta: se destraba.</li></ol><button data-view="bascula">Mostrarme</button></div></details>
<details><summary>7 · Puerta, cajón y bolsa</summary><div class="in"><p>Puerta con bisagra abajo y resorte compensador: baja suave y queda horizontal como repisa. El cajón se desliza sobre dos guías bajas y sale sobre la puerta abierta; tiene un tope. La bolsa encaja por su borde elástico; al levantarla, el cordón la cierra. En el frente del cajón hay 10 bolsas de reserva.</p><button data-view="puerta">Mostrarme</button></div></details>
<details><summary>Cómo se arma (orden de montaje)</summary><div class="in"><ol>
<li>Rotomoldear el cuerpo en PP con base, carter, canal y depósito en U.</li>
<li>Montar la cámara de inox con su embudo en V y los bocines de bronce.</li>
<li>Armar los rodillos: cuchillas y separadores intercalados en los ejes hexagonales; engranajes 1:1; verificar 1 mm de holgura.</li>
<li>En el carter: corona de 50 dientes, piñón de 10, volante, cadena 24:8 y piñón con rueda libre.</li>
<li>Pedales con pivote y resorte de torsión, cremallera, fuelle, colector y manguera al carbón.</li>
<li>Sistema rojo: pulsador, varilla, escuadra, pasadores y cable de freno. Probar 100 veces que el pedal no baje con la tapa abierta.</li>
<li>Báscula: resortes, bandeja, varilla, palanca, cremallera y dial. Calibrar el cero con el cajón vacío y una pesa de 5 kg.</li>
<li>Dosificador: placa en U, resorte, cable y polea. Verificar la dosis de 30 mL.</li>
<li>Puerta con bisagras y trinquete; rieles; cajón con bolsa y bolsas de reserva.</li>
<li>Tapa con bisagra de piano, empaque, gancho y rótulo; carbón y válvula. Prueba de hermeticidad.</li></ol></div></details>
<details><summary>Lista de piezas</summary><div class="in"><table class="bom"><tr><th>Pieza</th><th>Material · medida</th></tr>${Object.values(TXT).filter(v => v[0]).map(v => `<tr><td>${v[0]}</td><td>${v[1]}</td></tr>`).join('')}</table></div></details>`;
$('pManual').innerHTML = MANUAL;
{ // medidas calculadas de la geometría real del modelo
  const cm = (m) => fmt(m * 100, m * 100 % 1 ? 1 : 0);
  const W = D.carter.x1 - D.chanL.x0, Dp = (T.padZ + 0.0425) - (-D.DP / 2 - 0.016), liftH = lid.hingeY + lid.L * Math.sin(1.83) + D.lidT * Math.cos(1.83), front = door.h + 0.005;
  $('dims').innerHTML = `<b>Medidas del equipo</b>
  <div class="r"><span>Alto</span><span>${cm(D.H)} cm · ${cm(liftH)} con tapa abierta</span></div>
  <div class="r"><span>Ancho</span><span>${cm(W)} cm (cuerpo ${cm(D.W)} + transmisión y canal)</span></div>
  <div class="r"><span>Fondo</span><span>${cm(Dp)} cm (cuerpo ${cm(D.DP)} + pedales)</span></div>
  <div class="r"><span>Ocupa en el piso</span><span>${cm(W)} × ${cm(Dp)} cm</span></div>
  <div class="r"><span>Para vaciar</span><span>+${cm(front)} cm libres al frente</span></div>
  <div class="r"><span>Cajón</span><span>34 × 30 × 20 cm · 20 L</span></div>`;
}
$('pManual').querySelectorAll('[data-view]').forEach(b => b.onclick = () => showView(b.dataset.view));
function showView(k) { const v = VIEWS[k]; if (!v) return; if (EXPL.target > 0) { EXPL.target = 0; $('sExp').value = 0; $('vExp').textContent = '0%'; } camTo(v.cam); if (innerWidth < 900) { $('left').classList.remove('open'); document.querySelector('[data-open="left"]').classList.remove('on'); } if (v.trans != null) setTrans(Math.max(transT * 100, v.trans)); setCallouts(v.call ? CALLSETS[v.call]() : []); }

// =====================================================================
//  ACCIONES
// =====================================================================
const toastLast = {};
function toast(msg, type = '', keyT = msg, cool = 2500) {
  const now = performance.now(); if (toastLast[keyT] && now - toastLast[keyT] < cool) return; toastLast[keyT] = now;
  const d = document.createElement('div'); d.className = 'toast ' + type; d.textContent = msg; $('toasts').appendChild(d);
  setTimeout(() => { d.style.transition = 'opacity .4s'; d.style.opacity = 0; setTimeout(() => d.remove(), 400); }, 4600);
  while ($('toasts').children.length > 3) $('toasts').firstChild.remove();
}
const wait = (ms) => new Promise(r => setTimeout(r, ms));
let SEQ = 0; // cada acción nueva cancela la anterior (nada se queda "trabado")
async function until(fn, ms, id) { const t0 = performance.now(); while (!fn() && performance.now() - t0 < ms && id === SEQ) await wait(25); return fn(); }
function actLatch() {
  if (S.latT > 0.5) { S.latT = 0; return; }
  S.latT = 1; setTimeout(() => { if (!S.engaged && S.lat > 0.5) toast('El gancho se cerró en vacío: la tapa no estaba abajo. Ábrelo, baja la tapa y ciérralo otra vez para que apriete el empaque.', 'warn'); }, 450);
}
async function openLid() { const id = ++SEQ; if (S.latT > 0.5 || S.lat > 0.1) { S.latT = 0; await until(() => S.lat < 0.05, 700, id); } if (id !== SEQ) return; S.lidHand = K.thMax; await until(() => S.th > 1.72, 2000, id); if (id === SEQ) S.lidHand = null; }
async function closeLid() { const id = ++SEQ; S.lidHand = 0; await until(() => S.th < 0.3, 2000, id); if (id !== SEQ) return; S.lidHand = null; await until(() => S.th < K.thSeat + 0.002, 2000, id); if (id !== SEQ) return; await wait(120); S.latT = 1; }
function actLid() { if (S.th > 0.5) closeLid(); else openLid(); }
async function actWaste() { if (S.th < 1.0) { toast('Primero se suelta el gancho y se abre la tapa.'); await openLid(); } dropPortion(); audioInit(); }
async function actDoor() {
  const id = ++SEQ;
  if (S.de < 0.3) {
    if (S.doorLatched) { S.doorHand = 0.12; await wait(220); S.doorHand = null; toast(`La puerta sigue trabada: el cajón pesa ${fmt(Math.max(0, scaleReading()))} kg y el trinquete se libera en 10,2 kg (zona roja).`, 'warn', 'doorlock'); return; }
    S.doorHand = Math.PI / 2; await until(() => S.de > 1.56, 1800, id); if (id === SEQ) S.doorHand = null;
  } else {
    if (S.e > 0.01) toast('Primero mete el cajón: la puerta choca con él.', 'warn');
    S.doorHand = 0; await until(() => S.de < 0.004, 1800, id); await wait(150); if (id === SEQ) S.doorHand = null;
  }
}
async function actDrawer() {
  const id = ++SEQ;
  if (S.e < 0.12) { if (S.de < 1.5) toast('El cajón no puede salir: la puerta frontal está cerrada delante de él.', 'warn', 'drw'); S.drawerHand = 0.26; await until(() => S.e > 0.255, 1500, id); }
  else { S.drawerHand = 0; await until(() => S.e < 0.002, 1500, id); }
  if (id === SEQ) S.drawerHand = null;
}
function actBag() {
  if (S.e < 0.24) { toast('Saca el cajón del todo para cambiar la bolsa.', 'warn'); return; }
  if (bag.state === 'in') autoSack(); else if (bag.state === 'none') { bag.state = 'inserting'; bag.t = 0; }
}
async function autoSack() { const sk = grabBag(); if (!sk) return; const side = [[0.45, 0.35, 0.42], [0.62, 0.3, 0.1], [-0.45, 0.3, 0.42]][Math.min(2, SACKS.length - 1)]; await wait(300); sk.tx = side[0]; sk.ty = side[1]; sk.tz = side[2]; await wait(900); sk.held = false; }
function toggleHatch() {
  if (hatch.aT < 0.5) { if (S.th < 1.2) { toast('La tapa del aserrín está debajo de la tapa principal: primero abre la tapa principal.', 'warn', 'hatch'); return false; } hatch.aT = 1.3; setTimeout(pourSaw, 700); }
  else hatch.aT = 0; return true;
}
function pourSaw() { if (hatch.a < 1) return; const need = SAW.cap - S.sawG; if (need <= 1) { toast('El depósito ya está lleno.'); return; } hatch.pour = 1.6; toast('Vertiendo aserrín en el depósito en U…'); }
async function autoRefill() { if (S.th < 1.2) await openLid(); if (hatch.aT < 0.5) toggleHatch(); await wait(2600); if (hatch.aT > 0.5) toggleHatch(); }
function refillSaw() { toggleHatch(); }
function resetAll() {
  ++SEQ; P.length = 0; heapReset(); bag.state = 'in'; bag.grp.visible = true; bagShape(0, 0);
  for (const s of SACKS) machine.remove(s.grp); SACKS.length = 0;
  Object.assign(S, { th: 0, om: 0, lidHand: null, lat: 1, latT: 1, engaged: true, sR: 0, vR: 0, wB: 0, auto: false, autoPress: false, sL: 0, vL: 0, saw: 0, sawG: 700, sawArmed: true, doses: 0, de: 0, wd: 0, doorHand: null, doorLatched: true, e: 0, ve: 0, drawerHand: null, key: 0, spilled: 0, lockR: 0, lockL: 0, lockD: 0 });
  S.x = (D.tray.m + tareKg) * g / K.kTray; G0.triedLock = false; hatch.a = hatch.aT = 0; hatch.pour = 0;
}
S.x = (D.tray.m + tareKg) * g / K.kTray;

// =====================================================================
//  MODOS, GUÍA Y VISTA
// =====================================================================
let MODE = 'manual';
function setMode(m) {
  MODE = m; document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  $('pFree').style.display = m === 'free' ? '' : 'none'; $('pManual').style.display = m === 'manual' ? '' : 'none';
  setCallouts([]);
}
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => setMode(b.dataset.mode));
const CAMS = {
  fr: [[1.05, 0.78, 1.35], [0.0, 0.32, 0.04]], fl: [[-1.1, 0.88, 1.2], [0.02, 0.3, 0.02]], side: [[1.45, 0.62, 0.7], [0.02, 0.3, 0]],
  gen: [[1.05, 0.82, 1.25], [0.02, 0.33, 0.02]], front: [[0.25, 0.55, 1.5], [0.02, 0.33, 0.05]], mech: [[1.3, 0.46, 0.5], [0.1, 0.3, 0.02]],
  top: [[0.45, 1.3, 1.05], [0, 0.36, 0]], grind: [[0.5, 0.72, 0.6], [0, 0.46, 0]], drawer: [[0.62, 0.52, 1.1], [0, 0.14, 0.2]], scale: [[0.88, 0.34, 1.08], [-0.01, 0.22, 0.1]],
};
let camTween = null;
// distancia para que TODO el equipo (esfera de 0,55 m) quepa en la pantalla, sea horizontal o vertical
function fitDist(r = 0.55) { const v = camera.fov * Math.PI / 180, h = 2 * Math.atan(Math.tan(v / 2) * camera.aspect); const mob = innerWidth < 900 ? 0.98 : 1.18; return mob * r / Math.sin(Math.min(v, h) / 2); }
const REF_DIST = 1.78; // distancia de las vistas pensadas para una pantalla de computador
function scaled([p, t], full) { const P = new THREE.Vector3(...p), Tt = new THREE.Vector3(...t), d = P.distanceTo(Tt), k = Math.max(1, fitDist() / REF_DIST); const nd = full ? Math.max(d, fitDist()) : d * k; return [Tt.clone().add(P.sub(Tt).normalize().multiplyScalar(nd)).toArray(), Tt.toArray()]; }
function camTo(v, dur = 0.9, full = false) { const [p, t] = scaled(v, full); camTween = { t: 0, d: dur, p0: camera.position.clone(), t0: controls.target.clone(), p1: new THREE.Vector3(...p), t1: new THREE.Vector3(...t) }; }
function fitNow() { const [p, t] = scaled(CAMS.gen, true); camera.position.set(...p); controls.target.set(...t); controls.update(); }
document.querySelectorAll('[data-cam]').forEach(b => b.onclick = () => { camTo(CAMS[b.dataset.cam], 0.9, b.dataset.cam === 'gen'); if (['grind', 'scale', 'mech'].includes(b.dataset.cam) && transT < 0.6) setTrans(70); setCallouts(b.dataset.cam === 'scale' ? CALLSETS.bascula() : b.dataset.cam === 'mech' ? CALLSETS.transmision() : []); });
const housingMeshes = []; casing.traverse(o => o.isMesh && housingMeshes.push(o));
let transT = 0.45;
function setTrans(v) { $('sTrans').value = v; transT = v / 100; applyTrans(); }
function applyTrans() {
  const t = transT; $('vTrans').textContent = Math.round(t * 100) + '%';
  for (const m of housingMats) { m.transparent = t > 0.01; m.opacity = 1 - 0.9 * t; m.depthWrite = t < 0.25; m.needsUpdate = true; }
  M.inox.transparent = t > 0.01; M.inox.opacity = 1 - 0.66 * t; M.inox.depthWrite = t < 0.25; M.inox.needsUpdate = true;
  housingMeshes.forEach(o => o.castShadow = t < 0.5);
  [lid.pivot, door.pivot].forEach(gp => gp.traverse(o => { if (o.isMesh && housingMats.includes(o.material)) o.castShadow = t < 0.5; }));
}
$('sTrans').oninput = (e) => { transT = e.target.value / 100; applyTrans(); };
let expHint = false;
$('sExp').oninput = (e) => {
  EXPL.target = e.target.value / 100; $('vExp').textContent = e.target.value + '%';
  if (EXPL.target > 0 && !expHint) { expHint = true; toast('Despiece: haz clic en cualquier pieza para verla de cerca y recorrerlas una por una.'); }
  if (EXPL.target === 0) { clearGhost(false); $('detail').style.display = 'none'; }
  S.footR = S.footL = S.auto = false; S.lidHand = S.doorHand = S.drawerHand = null; setCallouts([]);
};
$('bOdor').onclick = () => { VIEW.seals = !VIEW.seals; $('bOdor').classList.toggle('on', VIEW.seals); if (VIEW.seals) toast('Verde = sello apretado · rojo = abierto. Puntos cafés = aire con olor; naranja = olor que escapa; azul = aire ya filtrado por el carbón.'); };
$('bSound').onclick = () => { AU.on = !AU.on; $('bSound').classList.toggle('on', AU.on); };
$('rTtl').onclick = () => { $('right').classList.toggle('min'); $('rTg').textContent = $('right').classList.contains('min') ? '+' : '–'; };

// ---- botones del modo libre ----
$('bLatch').onclick = () => { audioInit(); actLatch(); };
$('bLid').onclick = () => { audioInit(); actLid(); };
$('bWaste').onclick = () => actWaste();
$('bDoor').onclick = () => { audioInit(); actDoor(); };
$('bDrawer').onclick = () => { audioInit(); actDrawer(); };
$('bBag').onclick = () => actBag();
$('bKey').onclick = () => { S.key = 6; toast('Llave del operario: el trinquete queda liberado 6 segundos.'); };
$('bAuto').onclick = () => { audioInit(); S.auto = !S.auto; };
$('bDays').onclick = () => { if (bag.state !== 'in' || S.e > 0.01) { toast('Para simular días de uso el cajón debe estar adentro y con bolsa.', 'warn'); return; } addDays(5); toast('Se sumaron 5 días de pulpa molida y cubierta con aserrín (2,3 kg).'); };
$('bReset').onclick = () => resetAll();
function holdBtn(el, set) {
  const on = (e) => { e.preventDefault(); audioInit(); set(true); el.classList.add('pressed'); };
  const off = () => { set(false); el.classList.remove('pressed'); };
  el.addEventListener('pointerdown', on); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, off));
}
holdBtn($('bPedR'), v => S.footR = v); holdBtn($('bPedL'), v => S.footL = v);
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.repeat) return; audioInit(); const k = e.key.toLowerCase();
  if (e.code === 'Space') { S.footR = true; e.preventDefault(); } else if (k === 'c') S.footL = true;
  else if (k === 't') actLid(); else if (k === 'g') actLatch(); else if (k === 'r') actWaste(); else if (k === 'f') actDoor(); else if (k === 'd') actDrawer(); else if (k === 'p') S.auto = !S.auto;
  else if (EXPL.u > 0.3 && (k === 'arrowright' || k === 'arrowleft')) cyclePart(k === 'arrowright' ? 1 : -1);
  else if (k === 'escape') clearGhost();
});
addEventListener('keyup', (e) => { if (e.code === 'Space') S.footR = false; if (e.key.toLowerCase() === 'c') S.footL = false; });

// =====================================================================
//  MANO VIRTUAL: arrastrar, mantener, doble clic
// =====================================================================
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tip = $('tip');
let drag = null;
function pick(e) {
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const skipHousing = transT > 0.3 && EXPL.u < 0.3;
  for (const h of ray.intersectObjects(pickables.concat(SACKS.map(s => s.grp)), true)) { const o = h.object; if (!o.visible || !o.userData.info) continue; if (skipHousing && housingMeshes.includes(o)) continue; return h; }
  return null;
}
const DRAG = { tapa: 'lid', tapaAsa: 'lid', empaque: 'lid', una: 'lid', lengueta: 'lid', etiqueta: 'lid', gancho: 'latch', estribo: 'latch', pedalR: 'pedR', pedalL: 'pedL', puerta: 'door', puertaAsa: 'door', empaquePuerta: 'door', cajon: 'drawer', cajonAsa: 'drawer', rejilla: 'drawer', bolsa: 'bag', monton: 'bag', cordon: 'bag', saco: 'sack', tolva: 'waste', embudo: 'waste', tapaRecarga: 'hatch', reserva: 'reserva' };
function planeHit(e, normal, point) { ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); const pl = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, point); const out = new THREE.Vector3(); return ray.ray.intersectPlane(pl, out) ? out : null; }
const camPlaneN = () => { const n = new THREE.Vector3(); camera.getWorldDirection(n); n.y = 0; return n.normalize(); };
canvas.addEventListener('pointermove', (e) => {
  if (drag) { dragMove(e); return; }
  const h = pick(e), inf = h ? h.object.userData.info : null;
  if (inf && inf.name) {
    if (!GHOST.inf) tint(inf); tip.style.display = 'block';
    tip.innerHTML = `<b>${inf.name}</b>${inf.mat ? `<span class="mat">${inf.mat}</span>` : ''}${inf.desc}${inf.act && EXPL.u < 0.02 ? `<span class="act">${inf.act}</span>` : ''}${EXPL.u > 0.02 ? '<span class="act">Clic: ver de cerca</span>' : ''}`;
    tip.style.left = Math.min(e.clientX + 16, innerWidth - 330) + 'px'; tip.style.top = Math.min(e.clientY + 16, innerHeight - tip.offsetHeight - 10) + 'px';
    canvas.style.cursor = EXPL.u > 0.02 ? 'zoom-in' : DRAG[inf.key] ? 'grab' : 'help';
  } else { untint(); tip.style.display = 'none'; canvas.style.cursor = 'default'; }
});
canvas.addEventListener('pointerleave', () => { tip.style.display = 'none'; untint(); });
canvas.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return; audioInit();
  const h = pick(e); if (!h) return; const inf = h.object.userData.info, k = inf?.key;
  if (EXPL.u > 0.02) { drag = { kind: 'focus', inf, obj: h.object, x0: e.clientX, y0: e.clientY, t0: performance.now(), moved: false }; return; }
  let kind = DRAG[k]; if (!kind) return;
  if (kind === 'bag' && !(S.e > 0.24 && bag.state === 'in')) kind = S.e > 0.24 ? null : 'drawer';
  if (!kind) return;
  controls.enabled = false; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing';
  drag = { kind, x0: e.clientX, y0: e.clientY, t0: performance.now(), hit: h.point.clone(), moved: false };
  if (kind === 'lid') drag.off = Math.atan2(h.point.y - lid.hingeY, h.point.z - lid.hingeZ) - S.th;
  if (kind === 'door') drag.off = Math.atan2(h.point.z - door.z, h.point.y - door.y) - S.de;
  if (kind === 'drawer') drag.e0 = S.e;
  if (kind === 'pedR') S.footR = true;
  if (kind === 'pedL') S.footL = true;
  if (kind === 'bag') { const sk = grabBag(); if (sk) { drag.kind = 'sack'; drag.sack = sk; drag.hit.set(sk.x, sk.y + 0.25, sk.z); } }
  if (kind === 'sack') { drag.sack = h.object.userData.sack || SACKS.find(s => s.grp === h.object.parent); if (drag.sack) { drag.sack.held = true; drag.sack.tx = drag.sack.x; drag.sack.ty = drag.sack.y + 0.05; drag.sack.tz = drag.sack.z; } }
});
function dragMove(e) {
  if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 4) drag.moved = true;
  if (!drag.moved) return;
  if (drag.kind === 'lid') { const p = planeHit(e, new THREE.Vector3(1, 0, 0), drag.hit); if (p) S.lidHand = clamp(Math.atan2(p.y - lid.hingeY, p.z - lid.hingeZ) - drag.off, -0.05, 1.95); if (S.engaged && S.lat > 0.5) toast('La tapa está enganchada: primero suelta el gancho verde del frente.', 'warn', 'lidlocked'); }
  if (drag.kind === 'door') { const p = planeHit(e, new THREE.Vector3(1, 0, 0), drag.hit); if (p) S.doorHand = clamp(Math.atan2(p.z - door.z, p.y - door.y) - drag.off, -0.05, 1.62); if (S.doorLatched) toast(`Trabada por el trinquete: marca ${fmt(Math.max(0, scaleReading()))} kg y se libera en 10,2 kg.`, 'warn', 'doorlock'); }
  if (drag.kind === 'drawer') { const p = planeHit(e, new THREE.Vector3(0, 1, 0), drag.hit); if (p) S.drawerHand = clamp(drag.e0 + (p.z - drag.hit.z), 0, 0.27); }
  if (drag.kind === 'sack' && drag.sack) { const p = planeHit(e, camPlaneN(), drag.hit); if (p) { drag.sack.tx = p.x; drag.sack.ty = Math.max(0.02, p.y - 0.12); drag.sack.tz = p.z; } }
}
function endDrag() {
  if (!drag) return; const d = drag; drag = null; controls.enabled = true; canvas.style.cursor = 'default';
  const click = !d.moved && performance.now() - d.t0 < 450;
  if (d.kind === 'focus') { if (click) focusPart(d.inf, d.obj); return; }
  if (d.kind === 'lid') S.lidHand = null;
  if (d.kind === 'door') S.doorHand = null;
  if (d.kind === 'drawer') S.drawerHand = null;
  if (d.kind === 'latch' && click) actLatch();
  if (d.kind === 'waste' && click) actWaste();
  if (d.kind === 'hatch' && click) toggleHatch();
  if (d.kind === 'reserva' && click) { if (bag.state === 'none' && S.e > 0.24) { bag.state = 'inserting'; bag.t = 0; } else toast(bag.state === 'none' ? 'Saca el cajón del todo para poner la bolsa.' : 'Aquí hay 10 bolsas de reserva dobladas.'); }
  if (d.kind === 'sack' && d.sack) d.sack.held = false;
  if (d.kind === 'pedR') S.footR = false;
  if (d.kind === 'pedL') S.footL = false;
  if ((d.kind === 'lid' || d.kind === 'door' || d.kind === 'drawer') && click) toast('Arrastra para moverla con la mano o haz doble clic para abrir/cerrar.', '', 'hint-dbl', 8000);
}
canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('dblclick', (e) => {
  if (EXPL.u > 0.02) { if (!pick(e)) clearGhost(); return; } const h = pick(e); if (!h) return; const k = DRAG[h.object.userData.info?.key];
  if (k === 'lid') actLid(); else if (k === 'door') actDoor(); else if (k === 'drawer') actDrawer();
});
// ---- despiece: ver cada pieza de cerca ----
let focusIdx = -1;
// modo foco: la pieza elegida queda sólida y todo lo demás casi transparente
const GHOST = { inf: null, mat: new THREE.MeshStandardMaterial({ color: 0xc9d3cc, transparent: true, opacity: 0.05, depthWrite: false, roughness: 0.8 }) };
function setGhost(inf) {
  untint(); GHOST.inf = inf; const keep = new Set(meshesOf(inf));
  machine.traverse(o => { if (!o.isMesh && !o.isInstancedMesh) return; if (keep.has(o)) { if (o.userData.gOrig) { o.material = o.userData.gOrig; o.userData.gOrig = null; } o.castShadow = true; } else if (!o.userData.gOrig) { o.userData.gOrig = o.material; o.material = GHOST.mat; } });
}
function clearGhost(frame = true) {
  if (!GHOST.inf) return; GHOST.inf = null; machine.traverse(o => { if (o.userData.gOrig) { o.material = o.userData.gOrig; o.userData.gOrig = null; } });
  $('detail').style.display = 'none'; if (frame && EXPL.u > 0.02) camTo([[1.6, 1.25, 1.9], [0.02, 0.36, 0.1]], 0.8);
}
function focusPart(inf, obj) {
  if (!inf) return; focusIdx = EXPL.parts.findIndex(p => p.info === inf); if (focusIdx < 0) focusIdx = 0; setGhost(inf);
  _bb.makeEmpty(); for (const m of meshesOf(inf)) _bb.expandByObject(m); if (_bb.isEmpty()) _bb.setFromObject(obj);
  const c = _bb.getCenter(new THREE.Vector3()), r = Math.max(0.05, _bb.getSize(new THREE.Vector3()).length() * 0.9);
  const dir = camera.position.clone().sub(controls.target).normalize();
  camTo([c.clone().addScaledVector(dir, r * 1.8 + 0.08).toArray(), c.toArray()], 0.7);
  const dt2 = $('detail'); dt2.style.display = 'block';
  dt2.innerHTML = `<b>${inf.name}</b><div class="mat">${inf.mat || ''}</div><p>${inf.desc}</p><p class="sub" style="margin-top:6px">Gira alrededor de la pieza arrastrando; acércate con la rueda.</p><div class="gnav" style="margin-top:8px"><button id="dPrev">‹ Anterior</button><span class="sub">${focusIdx + 1} / ${EXPL.parts.length}</span><button id="dNext">Siguiente ›</button></div><button id="dAll" class="pri" style="width:100%;margin-top:8px">Ver todas las piezas (Esc)</button>`;
  $('dPrev').onclick = () => cyclePart(-1); $('dNext').onclick = () => cyclePart(1); $('dAll').onclick = () => clearGhost();
}
function cyclePart(d) { if (!EXPL.parts.length) return; focusIdx = (focusIdx + d + EXPL.parts.length) % EXPL.parts.length; const p = EXPL.parts[focusIdx]; focusPart(p.info, p.mesh); }

// =====================================================================
//  PANEL DE ESTADO Y EVENTOS
// =====================================================================
const pill = (t, c) => `<span class="pill p-${c}">${t}</span>`;
let uiT = 0, sPrevR = 0;
function updateUI(dt) {
  if (EV.lockBlockR) { EV.lockBlockR = 0; G0.triedLock = true; toast(EV.lockWhyR === 'lid' ? 'Seguro infantil: el pedal choca con el pasador rojo porque la tapa no está cerrada y apretada por el gancho.' : 'Con la puerta frontal abierta, su pulsador mete un pasador rojo bajo el pedal: no se puede moler con el cajón afuera.', 'bad', 'lockR' + EV.lockWhyR, 3500); }
  if (EV.lockBlockL) { EV.lockBlockL = 0; toast('El pedal del aserrín está bloqueado: con la puerta frontal abierta el aserrín caería afuera.', 'bad', 'lockL', 3500); }
  if (EV.dose) { EV.dose = 0; spawnSawdust(); toast('Dosis de aserrín (≈ 30 mL): cae por atrás, izquierda y derecha sobre lo recién molido.', '', 'dose', 4000); blip(300, 0.15, 0.05, 'triangle'); }
  if (EV.noSaw) { EV.noSaw = 0; toast('El depósito de aserrín está vacío: ábrelo bajo la tapa y recárgalo.', 'warn', 'nosaw'); }
  if (sPrevR < 0.04 && S.sR >= 0.04) G0.strokes++; sPrevR = S.sR;
  uiT -= dt; if (uiT > 0) return; uiT = 0.1;
  const comp = S.engaged ? latchComp(S.lat) : 0, kg = scaleReading(), wC = S.wB / T.red;
  $('oLid').innerHTML = S.th > 0.05 ? pill(`abierta ${Math.round(S.th * 57.3)}°`, 'warn') : sealed() ? pill('cerrada y sellada', 'ok') : pill('cerrada sin gancho', 'mid');
  $('oSeal').innerHTML = comp > 0.0002 ? `${fmt(comp * 1000)} mm` : (S.th < K.thSeat + 0.001 ? 'apoyado, sin apretar' : 'sin contacto');
  $('oLock').innerHTML = (S.lockR > 0.5 || S.lockD > 0.5) ? pill(S.lockR > 0.5 ? 'BLOQUEADO (tapa)' : 'BLOQUEADO (puerta)', 'bad') : pill('liberado', 'ok');
  $('oPedR').textContent = `${fmt(S.sR * 1000, 0)} mm · ${S.engagedFW && S.vR > 0.01 ? 'empuja' : 'rueda libre'}`;
  $('oFly').textContent = `${Math.round(S.wB * 60 / TAU)} rpm · ${fmt(0.5 * K.IB * S.wB * S.wB)} J`;
  $('oRoll').innerHTML = wC > 0.3 ? `${Math.round(wC * 60 / TAU)} rpm${S.loadC > 0 ? ' · ' + pill('moliendo', 'warn') : ''}` : 'quietos';
  const raw = P.filter(p => p.type !== 'aserrin' && p.y > 0.3).reduce((a, p) => a + p.m, 0);
  $('oRaw').textContent = `${Math.round(raw * 1000)} g`;
  $('oGate').textContent = `${Math.round(S.sawG)} g · ${Math.floor(S.sawG / SAW.dose)} dosis`;
  $('oOnGate').textContent = S.bagMass > 0.05 ? `${Math.round((1 - heapUncovered()) * 100)} %` : '—';
  const cls = kg >= K.redKg ? 'bad' : kg >= 7 ? 'warn' : 'ok';
  $('oBin').innerHTML = S.e > 0.02 ? pill(bag.state === 'none' ? 'afuera · sin bolsa' : `afuera · ${fmt(S.bagMass)} kg`, 'mid') : pill(`${fmt(Math.max(0, kg))} kg · ${Math.round(clamp(kg, 0, 99) / K.fullKg * 100)} %`, cls);
  $('oDoor').innerHTML = S.de > 0.03 ? pill(`abierta ${Math.round(S.de * 57.3)}°`, 'warn') : S.doorLatched ? pill('trabada', 'mid') : pill('destrabada', 'ok');
  $('oNeedle').style.left = clamp(kg / K.fullKg * 100, 0, 100) + '%';
  $('oE').style.width = clamp(0.5 * K.IB * S.wB * S.wB / 25 * 100, 0, 100) + '%';
  $('oLoad').style.width = clamp(S.loadC / 12 * 100, 0, 100) + '%';
  $('bAuto').classList.toggle('on', S.auto); $('bAuto').textContent = S.auto ? 'Detener pedaleo rítmico (P)' : 'Pedaleo rítmico automático (P)';
  $('bPedR').classList.toggle('pressed', S.footR || S.autoPress); $('bPedL').classList.toggle('pressed', S.footL);
  $('bLatch').innerHTML = (S.latT > 0.5 ? 'Soltar gancho' : 'Cerrar gancho') + ' <kbd>G</kbd>';
  $('bLid').innerHTML = (S.th > 0.5 ? 'Cerrar tapa' : 'Abrir tapa') + ' <kbd>T</kbd>';
  $('bDoor').innerHTML = (S.de > 0.3 ? 'Cerrar puerta' : 'Abrir puerta') + ' <kbd>F</kbd>'; $('bDoor').classList.toggle('dis', S.doorLatched && S.de < 0.01);
  $('bDrawer').innerHTML = (S.e > 0.12 ? 'Meter cajón' : 'Sacar cajón') + ' <kbd>D</kbd>'; $('bDrawer').classList.toggle('dis', S.de < 1.5 && S.e < 0.01);
  $('bBag').textContent = bag.state === 'none' ? 'Poner bolsa nueva' : 'Sacar la bolsa llena y dejarla al lado'; $('bBag').classList.toggle('dis', S.e < 0.24);
}
addEventListener('resize', () => { const was = camera.aspect; camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); if ((was < 1) !== (camera.aspect < 1)) fitNow(); });
// ---- menús desplegables (celular): uno a la vez, se cierran al tocar el modelo ----
const SHEETS = ['left', 'right', 'dims'];
function openSheet(id) { SHEETS.forEach(k => { $(k).classList.toggle('open', k === id && !$(k).classList.contains('open')); document.querySelector(`[data-open="${k}"]`).classList.toggle('on', $(k).classList.contains('open')); }); }
document.querySelectorAll('[data-open]').forEach(b => b.onclick = () => openSheet(b.dataset.open));
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => { $(b.dataset.close).classList.remove('open'); document.querySelector(`[data-open="${b.dataset.close}"]`).classList.remove('on'); });
canvas.addEventListener('pointerdown', () => { if (innerWidth < 900) { SHEETS.forEach(k => $(k).classList.remove('open')); document.querySelectorAll('[data-open]').forEach(b => b.classList.remove('on')); } }, true);
$('bMore').onclick = () => { $('bar').classList.toggle('more'); $('bMore').textContent = $('bar').classList.contains('more') ? 'Vistas ▴' : 'Vistas ▾'; };
// en celular, al tocar una pieza (sin arrastrar) se muestra su ficha un momento
canvas.addEventListener('pointerup', (e) => { if (e.pointerType !== 'touch' || drag) return; const h = pick(e), inf = h && h.object.userData.info; if (!inf || !inf.name) return; tip.style.display = 'block'; tip.innerHTML = `<b>${inf.name}</b>${inf.mat ? `<span class="mat">${inf.mat}</span>` : ''}${inf.desc}`; tip.style.left = '8px'; tip.style.top = 'auto'; tip.style.bottom = '96px'; clearTimeout(tip._t); tip._t = setTimeout(() => { tip.style.display = 'none'; tip.style.bottom = ''; }, 5000); });
