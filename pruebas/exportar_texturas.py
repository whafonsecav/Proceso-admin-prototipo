import asyncio, base64, json, pathlib, sys
# Uso: python pruebas/exportar_texturas.py [url]   (por defecto http://127.0.0.1:8765/index.html)
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8765/index.html'
SALIDA = pathlib.Path(__file__).resolve().parent.parent / 'texturas'; SALIDA.mkdir(exist_ok=True)
from playwright.async_api import async_playwright
JS = """(() => { const R = window.__recoevo, out = {}, seen = new Set();
  const nm = (k) => (k || 'textura').replace(/[^a-z0-9]+/gi, '_');
  R.scene.traverse(o => { const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of mats) for (const slot of ['map', 'roughnessMap', 'bumpMap']) { const t = m[slot]; if (!t || !t.image || !t.image.toDataURL || seen.has(t)) continue; seen.add(t);
      const key = (o.userData.info ? o.userData.info.key : (o.parent && o.parent.userData.info ? o.parent.userData.info.key : 'escena')) + '_' + slot;
      let k = nm(key), n = 2; while (out[k]) k = nm(key) + '_' + (n++); out[k] = t.image.toDataURL('image/png'); } });
  return out; })()"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='msedge'); pg = await b.new_page(viewport={'width': 1200, 'height': 800})
        await pg.goto(URL); await pg.wait_for_timeout(2500)
        res = await pg.evaluate(JS)
        for k, v in res.items():
            open(SALIDA / f'{k}.png', 'wb').write(base64.b64decode(v.split(',')[1]))
        print(len(res), sorted(res.keys())); await b.close()
asyncio.run(main())
