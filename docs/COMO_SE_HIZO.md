# Cómo se hizo este prototipo

## 1. El punto de partida

Había un primer archivo HTML con un modelo 3D muy simple. Sus problemas:

- Las piezas se atravesaban, la tapa y la compuerta se movían sin física, y el pedal bajaba por el extremo equivocado.
- Nada correspondía a las medidas del estudio.
- No había forma de seguir un ciclo de uso real.

Ese archivo se conservó como respaldo y se rehízo todo desde cero.

## 2. De dónde salieron las medidas y los materiales

Del estudio técnico del proyecto (modelo hogar), se respetaron:

- Cuerpo de 38 × 40 × 68 cm.
- Cajón extraíble de 20 L (34 × 30 × 20 cm) con bolsa compostable de borde elástico y cordón, y rejilla separadora.
- Boca de carga de 22 × 22 cm.
- Tapa de 38 × 40 × 4 cm con bisagra trasera y empaque EPDM apretado 3-4 mm por un gancho de palanca.
- Cámara y cuchillas de acero inoxidable 304; cuerpo de polipropileno.
- Carbón activado de 250 g y válvula de una sola vía.
- Aviso de lleno al 85 %.

Lo **tecnológico** del estudio se quitó a propósito: motor, tarjeta electrónica, radio, celdas de carga y ventilador. Se reemplazó por mecánica de bajo costo:

| En el estudio (eléctrico) | En este prototipo (analógico) |
|---|---|
| Motor de 24 V | Pedal + rueda libre + cadena + volante + reductor |
| Interruptor de seguridad en el cable | Pasadores de acero que bloquean el pedal |
| Celdas de carga electrónicas | 4 resortes + alambre + palanca-flecha + lámina impresa |
| Ventilador de extracción | Fuelle movido por el mismo pedal |
| Aviso por radio | Flecha en rojo que destraba la puerta |

## 3. Herramientas

- **Three.js** (librería gratuita de 3D para el navegador). Todas las piezas se construyen con código a partir de sus medidas: cajas con bordes redondeados, cilindros, engranajes con sus dientes calculados, cadena eslabón por eslabón, resortes helicoidales, empaques como tubos que siguen un rectángulo redondeado, y la bolsa como una malla que se deforma.
- **Materiales físicos (PBR):** cada material tiene color, rugosidad y "metalicidad" como en la realidad (por ejemplo, el inox refleja y el caucho es mate). Se ilumina con un estudio fotográfico virtual, sombras suaves y sombra de contacto.
- **Texturas hechas con código:** acero cepillado, arrugas de la bolsa, pulpa molida, rótulos y la lámina del indicador. Están exportadas en la carpeta `texturas/`.
- **Física escrita a mano en JavaScript** (ver `FISICA_Y_PARAMETROS.md`). No se usó un motor de física genérico, para poder controlar cada mecanismo con sus valores reales.
- **Pruebas automáticas** con Playwright y Microsoft Edge en modo invisible. Recorren la guía completa y toman capturas.

## 4. Cómo está organizado el código

El prototipo final es un solo archivo, `index.html`, para que funcione con doble clic y en GitHub Pages. Para trabajarlo cómodamente está dividido en partes dentro de `fuente/`, en el orden en que se ejecutan:

1. Página, estilos y paneles.
2. Escena, cámara, luces, materiales y funciones para crear geometría.
3. Cuerpo, cámara, rodillos, tapa, gancho, puerta, cajón y bolsa.
4. Transmisión, seguros, báscula, aserrín y olores.
5. Física de los mecanismos.
6. Residuos, trituración y montón.
7. Mover cada pieza según la física; bolsa y sacos.
8. Despiece, resaltado, rótulos, aire con olor y sonido.
9. Fichas de piezas y pasos de la guía.
10. Interfaz, manual y "mano virtual" (arrastrar, doble clic).
11. Bucle principal.

`fuente/construir.py` las une en `index.html`.

## 5. Decisiones de diseño y correcciones (en orden)

Durante el desarrollo el diseño se revisó varias veces. En cada revisión la pregunta fue *"¿esto funciona así en la realidad?"*:

1. **Pedal con pivote atrás:** el extremo que se pisa es el que baja; la cremallera va entre el pivote y el pie.
2. **Los trozos se quedaban atrapados** entre un deflector y los rodillos. Se reemplazó por un **embudo en V de 62°** que termina a 2 mm de las cuchillas.
3. **La energía no se conservaba al empezar cada pisada.** Se agregó la resistencia estática y el corte de a dos trozos a la vez. Moler 460 g pasó a requerir unas 8-10 pisadas, un esfuerzo creíble.
4. **La compuerta intermedia se eliminó.** Se abría sola con el peso y no aportaba. Ahora la pulpa cae directo a la bolsa, y el pedal izquierdo pasó a ser el del **aserrín**.
5. **Dosificador de aserrín en U:** una sola placa con celdas, un cable y un resorte. Dosis fija, sin compuertas y sin electricidad.
6. **Rueda libre visible:** se modelaron las uñas y la rueda de dientes de sierra para que se entienda por qué el pedal puede subir sin frenar el volante.
7. **Seguro infantil explicado pieza por pieza** (lengüeta → pulsador → varilla → escuadra → pasador), con rótulos numerados en 3D.
8. **Faltaban conexiones físicas**, y se agregaron:
   - El cable de freno entre el gancho y el volante.
   - Los pulsadores de la puerta que bloquean los pedales.
   - El colector de dos válvulas que hace que el fuelle bombee en un solo sentido.
9. **Indicador de peso:** se probó un reloj de aguja con engranajes, pero era caro. Se cambió por **resortes + alambre + palanca-flecha + lámina impresa**, que cuesta casi nada.
10. **Color verde,** según el código de colores para residuos (verde = orgánicos, blanco = aprovechables, negro = no aprovechables).
11. **Se quitaron** la rejilla del carter (hacía pensar que por ahí salía olor), el corte de sección y el render por trazado de rayos (pausaba la simulación).
12. **La tapa de recarga del aserrín** gira hacia arriba con bisagra y solo se abre con la tapa principal abierta: no puede atravesar nada.
13. **El alambre del indicador estorbaba al sacar el cajón** porque subía por delante de él. Se pasó a la esquina delantera derecha, fuera de su camino. Los rieles laterales se cambiaron por dos guías bajas sobre la bandeja, y el indicador se movió a la derecha (cuarto de círculo).
14. **El aire se aspiraba desde la cámara de molido** y no desde donde se acumula el olor. La aspiración se hace ahora por una rejilla atrás del compartimento del cajón, justo encima de la bolsa.
15. **Se quitó la guía paso a paso.** La página abre en el modo **Manual**, que ahora empieza con "Cómo se usa". El modo **Libre** tiene todos los controles.

## 6. Cómo se verificó

- Revisión de sintaxis en cada construcción.
- Recorrido automático de un ciclo completo de uso (15 comprobaciones), verificando el estado físico en cada paso.
- Capturas en computador (1400 × 900) y celular (390 × 844).
- Revisión visual de cada sistema desde varios ángulos, incluso desde abajo.

Los errores que encontraron las pruebas, y que se corrigieron:

- La báscula rebotaba al sumar muchos días de golpe y marcaba rojo por un instante.
- Una partícula de aire sin inicializar congelaba la animación al activar la vista de olor.
- Un error de orden en el código impedía cargar el cuadro de medidas.
