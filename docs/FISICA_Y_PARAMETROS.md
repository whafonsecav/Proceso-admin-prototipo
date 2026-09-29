# La física del prototipo y todos sus valores

Este documento explica **cómo** el prototipo calcula lo que se ve en pantalla. Nada está "animado a mano": cada pieza móvil tiene masa o inercia, y en cada instante se calculan las fuerzas que la empujan y lo que eso le hace.

## 1. La idea general: pasos de tiempo muy pequeños

Un computador no puede calcular el movimiento de forma continua, así que lo divide en pasos muy cortos:

- **Mecanismos** (pedales, volante, tapa, puerta, cajón, báscula, placa del aserrín): **1.080 pasos por segundo**.
- **Trozos de residuo:** 180 pasos por segundo.

En cada paso, para cada pieza:

1. Se suman las fuerzas (o los *pares*, que son fuerzas que hacen girar): peso, resortes, rozamiento, la mano del usuario, el pie.
2. Aceleración = fuerza ÷ masa (o par ÷ inercia, si gira). Es la segunda ley de Newton.
3. Con la aceleración se actualiza la velocidad, y con la velocidad la posición. Es el método llamado *Euler semi-implícito*, estable y sencillo.
4. Se revisan los **topes y choques**: si la pieza pasaría a través de otra, se deja justo en el contacto y se le quita la velocidad que la llevaba hacia adentro.

## 2. Pedal derecho, rueda libre y volante

- **Pie:** empuja con una fuerza que baja si el pie ya va rápido, como pasa con un músculo real: F = 420 N × (1 − v / 0,62 m/s).
- **Pedal:** masa efectiva de 0,45 kg; resorte de retorno con 14 N de precarga y 380 N/m; recorrido de 55 mm.
- **Relación pedal → volante:** 55 mm de pedal = 32 mm de cremallera → piñón de 12 mm de radio → cadena 24 : 8. En total, el volante gira **144 radianes por cada metro que baja el pedal**.
- **Volante:** inercia I = 0,0046 kg·m² (disco de hierro de 1,45 kg y 14 cm).
- **Rueda libre:** en cada paso se compara la velocidad del piñón (la que impone el pie) con la del volante.
  - Si el piñón va igual o más rápido, las uñas "traban" y pedal y volante se mueven **juntos**. Para el pie, el volante se siente como una masa de I × 144² ≈ 96 kg: por eso cuesta acelerarlo y por eso guarda tanta energía.
  - Si el piñón va más lento (o hacia atrás), las uñas resbalan y el volante sigue solo, frenado únicamente por su rozamiento y por lo que esté cortando.
- **Rozamientos del volante:** 0,028 N·m constante + 0,00016 N·m por cada rad/s. **Freno** al abrir el gancho: 1,7 N·m, con lo que para en menos de 1 s.
- **Resistencia estática:** si el volante está quieto y el pie no alcanza a vencer la resistencia de las cuchillas, el pedal no se mueve. Esto evita la "energía gratis" al empezar cada pisada.

## 3. Trituración: energía real sacada del volante

- Cada trozo tiene masa, tamaño, **dureza** (el trabajo en julios necesario para partirlo) y **par resistente** (lo que frena a las cuchillas mientras lo muerden). Valores usados:

| Residuo | Tamaño (radio) | Par resistente | Trabajo para partirlo |
|---|---|---|---|
| Cáscara de plátano | 17 mm | 2,6 N·m | 8,4 J |
| Cáscara de papa | 13 mm | 1,9 N·m | 4,8 J |
| Restos de verdura | 15 mm | 1,5 N·m | 3,6 J |
| Cáscara de fruta | 15 mm | 1,8 N·m | 5,4 J |
| Cáscara de huevo | 11 mm | 1,2 N·m | 2,1 J |
| Tusa de mazorca | 15 mm | 6,5 N·m | 21,6 J |
| Café | 6 mm | — | ya es fino, pasa directo |

- Mientras un trozo está en la mordida, el volante pierde exactamente la energía que el trozo recibe: potencia = par × velocidad de los rodillos. Cuando el trozo acumula su "trabajo para partirse", **se divide en dos** trozos más pequeños (radio × 0,72, con la mitad de la dureza). Se repite hasta que mide menos de unos 13 mm y pasa entre las cuchillas.
- Las cuchillas cortan a la vez **como máximo los dos trozos más hondos** de la mordida, como en una trituradora real de dos ejes. Los demás esperan encima.
- Resultado medido en las pruebas: una porción de **460 g** se muele en unos **8 segundos** de pedaleo rítmico (unas 8-10 pisadas), sin atascos permanentes.

## 4. Choques de los residuos

Cada trozo es una esfera deformada, con su tamaño. Choca contra:

- Las paredes de la cámara y de la boca (cajas).
- Las dos paredes del **embudo en V** (placas de **dos caras**: se revisa de qué lado venía el trozo, así que no se atraviesan) con rozamiento de Coulomb μ = 0,35.
- Los **rodillos** (cilindros): la superficie arrastra al trozo con la velocidad a la que gira.
- **Los otros trozos**, mediante una rejilla espacial que encuentra rápido a los vecinos. Así se apilan unos sobre otros encima de los rodillos.

## 5. El montón en la bolsa

- El interior de la bolsa se divide en una **rejilla de 34 × 30 celdas** (1 cm). Cada celda guarda una altura.
- Cuando un trozo llega al montón, su volumen (masa ÷ densidad) se reparte alrededor del punto de caída. Pulpa: 600 kg/m³ (0,6 kg por litro). Aserrín: 200 kg/m³.
- Luego el montón **se derrumba solo** hasta un talud (inclinación máxima) de 42°, que es como se comporta una pila de material húmedo.
- Cada celda guarda también cuánto aserrín la cubre. El aserrín la cubre y la pulpa nueva la destapa. De ahí sale el porcentaje "Montón cubierto" y la cantidad de olor que se dibuja.

## 6. Báscula

- Masa sobre los resortes: bandeja (0,6 kg) + cajón y rejilla (1,6 kg) + bolsa (0,05 kg) + contenido.
- Rigidez total k = 9.810 N/m (**1 mm por kg**), amortiguación del 28 %. Es un sistema masa-resorte: cuando cae un trozo, la bandeja rebota un poco y la flecha tiembla, como en una báscula real.
- **Flecha:** giro = lo que bajó la bandeja ÷ 9 mm (el brazo corto de la palanca). 12,5 kg = 80°.
- **Puerta:** se destraba cuando el contenido supera **10,2 kg** (85 % de 20 L a 0,6 kg/L). Al simular varios días de uso, la bandeja se coloca directamente en reposo, para que el rebote no dé una lectura falsa.

## 7. Tapa, gancho, puerta y cajón

- **Tapa:** 1,2 kg, inercia calculada como una placa que gira sobre su borde. Par del peso = m·g·r·cos(ángulo). Amortiguador de cierre suave de 0,42 N·m·s/rad en los últimos 50°. Tope a 105°.
- **Gancho:** la compresión del empaque no se "decide": se calcula con la geometría del estribo. Es la distancia entre el punto de la palanca y la uña de la tapa, menos el largo del alambre. Da 3,5 mm con la palanca abajo.
- **Puerta:** 0,9 kg y 26,2 cm de alto. Su peso la abre y un resorte compensador (0,15 N·m + 0,55 N·m/rad) la frena. Resultado: baja sola desde unos 16° y descansa horizontal.
- **Choque puerta ↔ cajón:** se revisan las esquinas del cajón contra el volumen real de la puerta en su ángulo. Si un movimiento produciría una intersección, se busca por *bisección* (probar la mitad del camino, luego la mitad de la mitad…) el punto exacto de contacto y la pieza se detiene ahí.
- **Mano del usuario:** cuando arrastras una pieza, se simula un resorte con amortiguador entre tu cursor y la pieza, con fuerza máxima limitada. Por eso la pieza te sigue, pero sigue respetando los topes y los choques.

## 8. Aserrín

- Placa de 27 celdas: recorre 15 mm cuando el cable jala 36 mm (la palanca del pedal da 41 mm).
- Suelta una dosis cuando pasa el 90 % del recorrido, y solo si antes volvió a menos del 15 % (así se llenaron las celdas). Dosis de 6 g ≈ 30 mL. Depósito: 1.000 g ≈ 5 L.
- La dosis sale por las tres ranuras con velocidad hacia el centro (0,25 a 1 m/s) y cae con gravedad.

## 9. Cómo se verificó

Con `pruebas/prueba_ciclo_completo.js` el prototipo se recorre solo, en un navegador sin ventana, desde "soltar el gancho" hasta "cerrar la puerta", usando los mismos controles que usa una persona. En cada paso revisa el estado físico (ángulo de la tapa, compresión del empaque, posición de los pasadores, energía del volante, masa en la bolsa, lectura de la báscula, puerta trabada o no). La última corrida pasó las **15 comprobaciones**, sin errores. Con `prueba_energia_de_molienda.js` se comprobó que la energía se conserva durante la trituración.
