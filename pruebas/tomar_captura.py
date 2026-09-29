"""Abre el prototipo en un navegador sin ventana (Microsoft Edge vía Playwright),
ejecuta un guion de JavaScript opcional y guarda una captura en pruebas/capturas/.

Uso:
  python pruebas/tomar_captura.py NOMBRE "codigo JS" [espera_s] [ancho] [alto]
  python pruebas/tomar_captura.py ciclo "$(cat pruebas/prueba_ciclo_completo.js)" 0.3

El JS se ejecuta dentro de una función async: puede usar await y devolver un valor,
que se imprime junto con los mensajes de la consola del navegador.
Requiere: pip install playwright   y un servidor local en la carpeta del repositorio:
  python -m http.server 8765
"""
import sys, json, asyncio, pathlib
from playwright.async_api import async_playwright

URL = 'http://127.0.0.1:8765/index.html'
nombre = sys.argv[1]; js = sys.argv[2] if len(sys.argv) > 2 else ''
espera = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
W = int(sys.argv[4]) if len(sys.argv) > 4 else 1400; H = int(sys.argv[5]) if len(sys.argv) > 5 else 900
SALIDA = pathlib.Path(__file__).resolve().parent / 'capturas'; SALIDA.mkdir(exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='msedge', args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': W, 'height': H})
        logs = []
        pg.on('console', lambda m: logs.append(f'[{m.type}] {m.text}'))
        pg.on('pageerror', lambda e: logs.append(f'[error de página] {e}'))
        await pg.goto(URL); await pg.wait_for_timeout(2500)
        res = await pg.evaluate(f'(async () => {{ {js} }})()') if js else None
        await pg.wait_for_timeout(int(espera * 1000))
        await pg.screenshot(path=str(SALIDA / f'{nombre}.png'))
        print(json.dumps({'resultado': res, 'consola': logs[-20:]}, ensure_ascii=False, indent=1))
        await b.close()

asyncio.run(main())
