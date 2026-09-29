// Recorre un ciclo completo de uso con los mismos controles del prototipo y verifica
// en cada paso el estado físico. Uso: ver pruebas/tomar_captura.py
const R = window.__recoevo, S = R.S, w = (ms) => new Promise(r => setTimeout(r, ms)), log = [];
const paso = async (nombre, accion, cond, max = 15000) => {
  await accion(); let t = 0; while (!cond() && t < max) { await w(200); t += 200; }
  log.push(`${cond() ? 'ok   ' : 'FALLA'} ${nombre} (${(t / 1000).toFixed(1)} s) · tapa ${(S.th * 57.3).toFixed(0)}° · sellada ${R.sealed()} · pasador ${S.lockR > 0.5 ? 'puesto' : 'fuera'} · volante ${Math.round(S.wB * 9.55)} rpm · bolsa ${S.bagMass.toFixed(2)} kg · báscula ${R.scaleReading().toFixed(2)} kg · aserrín ${Math.round(S.sawG)} g · puerta ${(S.de * 57.3).toFixed(0)}° ${S.doorLatched ? 'trabada' : 'libre'} · cajón ${(S.e * 100).toFixed(0)} cm`);
};
const raw = () => R.P.some(p => p.type !== 'aserrin' && p.y > 0.3);
await paso('Soltar el gancho', () => R.actLatch(), () => S.lat < 0.05 && !S.engaged);
await paso('Abrir la tapa', () => R.openLid(), () => S.th > 1.7);
await paso('Pedal bloqueado con la tapa abierta', async () => { S.footR = true; await w(800); S.footR = false; }, () => S.sR < 0.002 && S.lockR > 0.5);
S.sawG = 300;
await paso('Cargar aserrín (tapa en U hacia arriba)', () => R.autoRefill(), () => S.sawG >= 999 && R.hatch.a < 0.03);
await paso('Echar 460 g de residuos', () => R.dropPortion(), () => raw(), 4000);
await paso('Cerrar tapa y gancho (sella)', () => R.closeLid(), () => R.sealed() && S.lockR < 0.5);
await paso('Pedalear hasta moler todo', () => { S.auto = true; }, () => !raw(), 40000); S.auto = false;
const d0 = S.doses;
await paso('Pedal izquierdo: dosis de aserrín', async () => { S.footL = true; await w(700); S.footL = false; }, () => S.doses > d0);
await paso('Simular 22 días (flecha en rojo)', () => R.addDays(22), () => R.scaleReading() >= R.K.redKg && !S.doorLatched);
await paso('Abrir la puerta frontal', () => R.actDoor(), () => S.de > 1.5 && S.lockD > 0.5);
await paso('Sacar el cajón', () => R.actDrawer(), () => S.e > 0.24);
await paso('Sacar la bolsa y dejarla en el piso', () => R.autoSack(), () => R.bag.state === 'none' && R.SACKS.some(s => !s.held && s.y < 0.01));
await paso('Poner bolsa nueva', () => R.actBag(), () => R.bag.state === 'in');
await paso('Meter el cajón', () => R.actDrawer(), () => S.e < 0.003);
await paso('Cerrar la puerta (se vuelve a trabar)', () => R.actDoor(), () => S.de < 0.004 && S.doorLatched);
return log.join('\n');
