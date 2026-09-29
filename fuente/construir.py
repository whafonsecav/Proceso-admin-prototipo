"""Une las partes del código fuente en un solo archivo: ../index.html

Uso (desde cualquier carpeta):  python fuente/construir.py
Si tienes Node.js instalado, además revisa que no haya errores de sintaxis.
"""
import pathlib, subprocess, shutil, tempfile

AQUI = pathlib.Path(__file__).resolve().parent
PARTES_JS = [
    '01_escena_materiales_y_utilidades.js',
    '02_cuerpo_camara_rodillos_tapa_puerta_cajon.js',
    '03_transmision_seguros_bascula_aserrin_olores.js',
    '04_fisica_de_mecanismos.js',
    '05_residuos_particulas_y_monton.js',
    '06_sincronia_visual_bolsa_y_sacos.js',
    '06b_despiece_rotulos_olor_sonido.js',
    '07_fichas_de_piezas_y_guia.js',
    '07b_interfaz_manual_y_mano_virtual.js',
    '08_bucle_principal.js',
]
js = ''.join((AQUI / p).read_text(encoding='utf-8') for p in PARTES_JS)
html = (AQUI / '00_pagina_e_interfaz.html').read_text(encoding='utf-8')
salida = AQUI.parent / 'index.html'
salida.write_text(html + '<script type="module">\n' + js + '</script>\n</body>\n</html>\n', encoding='utf-8')
print(f'Listo: {salida}  ({salida.stat().st_size / 1024:.0f} KB)')

if shutil.which('node'):
    with tempfile.NamedTemporaryFile('w', suffix='.mjs', delete=False, encoding='utf-8') as f:
        f.write(js)
    r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True)
    print('Sintaxis correcta.' if r.returncode == 0 else 'ERROR de sintaxis:\n' + r.stderr)
