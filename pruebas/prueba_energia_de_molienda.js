const R = window.__recoevo, S = R.S, P = R.P, w = (ms) => new Promise(r => setTimeout(r, ms)); const log = [];
R.actLid(); await w(1500); R.dropPortion(); await w(2000); R.actLid(); await w(2200);
let Ework = 0, last = performance.now();
const iv = setInterval(() => {}, 1000);
S.auto = true;
for (let i = 0; i < 30; i++) { await w(500); log.push(`t=${(i*0.5+0.5).toFixed(2)} wB=${S.wB.toFixed(1)} E=${(0.5*R.K.IB*S.wB*S.wB).toFixed(1)}J load=${S.loadC.toFixed(1)} sR=${(S.sR*1000).toFixed(0)} nip=${P.filter(p=>p.nip).length} raw=${P.filter(p=>p.r>0.0066).length} Erest=${P.reduce((a,p)=>a+(p.r>0.0066?p.E:0),0).toFixed(1)}`); }
S.auto = false; return log.join('\n');
