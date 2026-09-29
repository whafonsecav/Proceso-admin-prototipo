# Colores, materiales, texturas y lista de piezas

## 1. Paleta de colores

El cuerpo es **verde** porque, en el código de colores para separar residuos en Colombia, el verde es para los **orgánicos** (el blanco es para aprovechables y el negro para no aprovechables).

| Uso | Color | Código |
|---|---|---|
| Cuerpo, tapa y carter (polipropileno) | Verde orgánico | `#3f8c55` |
| Puerta frontal | Verde oscuro | `#2b6a40` |
| Base, marcos y detalles | Grafito | `#252d28` |
| Manijas, palanca del gancho, compartimento de bolsas | Verde muy claro | `#d3e6c4` |
| Aserrín, tapa de recarga, pedal del aserrín | Madera | `#cfa86a` |
| **Sistema de seguridad** (lengüeta, pulsador, varilla, pasadores) | Rojo | `#d23a2b` |
| **Sistema de pesaje** (resortes, alambre, palanca) | Azul | `#2f6fb5` |
| Bolsa compostable | Verde bolsa | `#6fa64a` |
| Rótulos | Blanco sobre verde | — |

Los colores rojo y azul ayudan a seguir cada sistema con la vista: todo lo que es seguridad es rojo y todo lo que es pesaje es azul.

## 2. Materiales físicos (PBR)

Cada material del 3D imita el real con tres valores principales: **color**, **rugosidad** (0 = espejo, 1 = mate) y **metalicidad** (0 = plástico o caucho, 1 = metal).

| Material real | Rugosidad | Metalicidad | Detalle |
|---|---|---|---|
| Polipropileno rotomoldeado | 0,44 | 0 | Barniz suave y textura de rugosidad para que no se vea "de plástico de juguete" |
| Acero inoxidable 304 (cámara, embudo) | 0,30 | 1 | Textura de acero cepillado |
| Inox de las cuchillas | 0,22 | 1 | Más pulido |
| Acero de ejes | 0,36 | 0,95 | |
| Hierro fundido (volante) | 0,50 | 0,75 | Textura de rugosidad granulada |
| Bronce (bocines, corona) | 0,30 | 1 | |
| Caucho EPDM (empaques, fuelle, pedales) | 0,88-0,95 | 0 | |
| Policarbonato (ventana del indicador) | 0,06 | 0 | Transparente con refracción |
| Bolsa compostable | 0,55 | 0 | Brillo satinado y relieve de arrugas |

## 3. Texturas (carpeta `texturas/`)

No se usa ninguna imagen externa. Todas se dibujan con código al abrir la página y aquí se exportaron como PNG:

| Archivo | Qué es |
|---|---|
| `rugosidad_acero_cepillado.png` | Vetas del acero inoxidable |
| `rugosidad_polipropileno.png` | Grano fino del plástico |
| `rugosidad_hierro_fundido.png` | Grano del volante |
| `relieve_arrugas_bolsa.png` | Arrugas de la bolsa (se usa como relieve) |
| `pulpa_molida.png` | Aspecto de la pulpa en el montón |
| `lamina_indicador_peso.png` | Lámina verde-ámbar-rojo del indicador |
| `rotulo_tapa_solo_organicos.png` | Rótulo de la tapa: qué sí y qué no se echa |
| `rotulo_puerta.png`, `logo_frente.png`, `rotulo_pedal_triturar.png`, `rotulo_pedal_aserrin.png`, `rotulo_advertencia_carter.png`, `etiqueta_carbon_activado.png` | Rótulos y etiquetas |
| `sombra_de_contacto.png`, `particula_de_aire.png` | Ayudas visuales: sombra suave bajo el equipo y puntos del aire |

## 4. Lista de piezas

Esta tabla se genera directamente de las fichas del prototipo (`fuente/07_fichas_de_piezas_y_guia.js`). Es lo mismo que aparece al pasar el cursor sobre cada pieza.

| Pieza | Material y medida | Qué hace |
|---|---|---|
| Pared izquierda | Polipropileno (PP) de 3 mm | Parte del cuerpo de una sola pieza (rotomoldeado). Se vuelve traslúcida con el control de abajo para ver adentro. |
| Pared derecha | Polipropileno (PP) de 3 mm | Separa el interior del carter de la transmisión. Por ella salen los ejes de los rodillos, apoyados en bocines de bronce. |
| Pared trasera | Polipropileno (PP) de 3 mm | Cierra la columna de olores, donde van el carbón activado y la válvula de una vía. |
| Frente superior | Polipropileno (PP) verde de 3 mm | Lleva el gancho de la tapa, el logo y la ventana del indicador de peso. |
| Base | PP reforzado | Apoya los cuatro resortes de la báscula y los pivotes de los dos pedales. |
| Patas antideslizantes | Caucho EPDM Ø 36 mm | Evitan que el equipo se corra al pedalear. |
| Piso intermedio | PP de 4 mm con hueco de 26 × 26 cm | Separa la zona de molido del cajón. Por el hueco cae la pulpa directo a la bolsa y por sus tres ranuras cae el aserrín. |
| Marco superior y boca de carga | PP · boca de 22 × 22 cm | El empaque de la tapa apoya sobre este marco. |
| Tabique de la columna de olores | PP | Separa el depósito de aserrín de la columna trasera donde está el carbón activado. |
| Carter de la transmisión | PP (tapa de protección) | Encierra cadena, piñones y volante para que nadie meta los dedos. Añade 7 cm al ancho: 45 × 40 × 68 cm en total con el canal izquierdo. |
| Canal izquierdo | PP | Protege el pedal izquierdo y su cable. |
| Cámara de molido · pared frontal | Acero inoxidable AISI 304, 1,5 mm | La cámara es una caja de 24 × 24 cm donde trabajan los rodillos. El inox resiste los ácidos de la comida. |
| Cámara de molido · pared trasera | Inox 304, 1,5 mm | Detrás está el depósito de aserrín en U. |
| Cámara de molido · pared derecha | Inox 304, 1,5 mm | Sostiene los bocines de los ejes. |
| Cámara de molido · pared izquierda | Inox 304, 1,5 mm | Sostiene los bocines de los ejes. |
| Tolva de la boca | Inox 304 | Encauza lo que se echa por la boca de 22 × 22 cm. |
| Embudo en V (62°) | Inox 304 | Dos paredes inclinadas que llevan TODO directo a la mordida de los rodillos. Con más de 60° la pulpa húmeda no se queda pegada (se queda quieta por debajo de 40°). Terminan a 2 mm de las cuchillas, así nada pasa sin moler. |
| Bocín | Bronce autolubricado | Apoyo de los ejes donde atraviesan las paredes. |
| Rejilla de aspiración del cajón | PP · 12 × 2 cm, atrás del compartimento | Está atrás, justo encima de la bolsa, que es donde se junta el olor de lo que se va acumulando. Por aquí el fuelle saca ese aire y lo manda al carbón activado. La cámara de molido también se ventila por aquí, porque está abierta hacia el cajón por el hueco de los rodillos. |
| Eje hexagonal | Acero al carbono recubierto, 18 mm entre caras | Las cuchillas entran en el hexágono y giran con el eje sin patinar. |
| Cuchilla de gancho | Inox endurecido, Ø 72 mm, 12 mm de espesor | Dos ejes giran en sentido contrario hacia el centro. Las cuchillas de uno pasan entre las del otro con 1 mm de holgura, como dos peines. Muerden el trozo, lo arrastran hacia abajo y lo parten; solo pasa lo que ya mide menos de unos 13 mm. |
| Separador | Inox, Ø 42 mm | Anillo entre cuchillas: es el hueco donde entra la cuchilla del otro eje. |
| Peine rascador | Lámina de inox cortada con láser | Sí es necesario: son dedos fijos que entran entre las cuchillas por debajo. Las cáscaras fibrosas (plátano, tusa, hojas de mazorca) tienden a enrollarse en el eje y a subir de nuevo con el giro; el peine las despega y las manda hacia abajo. Sin él, los rodillos se atascan en pocos días. Es una sola lámina, muy barata. |
| Tapa hermética | PP · 38 × 40 × 4 cm · 1,2 kg | Bisagra de piano atrás. Pasados los 90° su propio peso la mantiene abierta contra el tope de la bisagra (105°). Al cerrar, un amortiguador la frena al final. |
| Labio para levantar la tapa | PP | Punto de agarre de la tapa. |
| Rótulo de uso | Placa impresa | Solo desechos orgánicos: cáscaras, sobras, café, cáscara de huevo y servilletas. Nunca vidrio, metal, plástico ni pilas. |
| Empaque de la tapa | EPDM de celda cerrada, perfil en D de 10 × 8 mm | Corre por todo el borde, como el de una nevera. Solo sella cuando el gancho lo aprieta 3,5 mm. |
| Lengüeta roja de la tapa (seguro) | Acero pintado | Paso 1 del seguro infantil: cuando la tapa está cerrada Y apretada por el gancho, esta lengüeta entra en la ranura del marco y empuja el pulsador rojo 4 mm hacia abajo. |
| Uña de enganche | Acero inoxidable | Donde muerde el estribo del gancho para apretar la tapa. |
| Bisagra de piano | Acero inoxidable, pasador de 4 mm | Nudillos alternados tapa-marco a todo el ancho; lleva el tope de 105° integrado. |
| Amortiguador de cierre suave | Rotativo de aceite de silicona | Frena la tapa al final del cierre para que no golpee ni pellizque. |
| Gancho de palanca (cierre sobre-centro) | Palanca de PP + estribo de acero | Al bajar la palanca, el estribo engancha la uña y tira de la tapa: el empaque se aprieta 3,5 mm. Si la tapa no estaba abajo, se cierra en vacío y NO sella. Al abrirlo, una leva baja la zapata de freno sobre el volante. |
| Estribo del gancho | Alambre de acero 3 mm | Es el lazo que engancha la uña de la tapa. |
| Puerta frontal abatible | PP con empaque | Bisagra abajo, como un horno. Un resorte de compensación la deja bajar suave y quedar horizontal, sirviendo de repisa para el cajón. Solo se destraba cuando la aguja entra en la zona roja. |
| Manija de la puerta | PP | Para jalar la puerta. |
| Empaque de la puerta | EPDM | Mantiene el olor del cajón adentro. |
| Bisagras de la puerta | Inox | Eje inferior de la puerta con resorte compensador. |
| Bandeja de pesaje | Acero pintado | El cajón descansa sobre ella y ella solo sobre los 4 resortes: todo el peso pasa por los resortes. |
| Resortes de la báscula (ley de Hooke) | Acero de resorte · 4 × 2,45 N/mm | Los cuatro suman 9,81 N/mm: cada kilo baja la bandeja exactamente 1 mm (F = k·x). Es el mismo principio de una báscula de baño. |
| Cajón extraíble de 20 L | PP · 34 × 30 × 20 cm | Recibe la pulpa directo de los rodillos. Con la puerta abierta se desliza sobre dos guías bajas y sale sobre la puerta, que sirve de repisa; un tope evita sacarlo del todo por accidente. |
| Manija del cajón | PP | Para sacar el cajón. |
| Compartimento de bolsas de reserva | PP, tapa a presión | Guarda 10 bolsas dobladas. Con el cajón afuera y sin bolsa, haz clic aquí para poner una nueva. |
| Rejilla separadora | PP perforado, patas de 3 cm | Deja abajo un sumidero de 2,5 L para el líquido; la pulpa queda escurrida encima. |
| Guías bajas del cajón | Acero galvanizado, sobre la bandeja | El cajón se desliza sobre estas dos guías y, al salir, sobre la puerta abierta que hace de repisa. Como van sobre la bandeja, todo el peso del cajón pasa a los resortes de la báscula. No hay rieles a los lados: ese hueco queda libre para el alambre del indicador. |
| Bolsa compostable | Bioplástico compostable · 20 L | Su borde elástico encaja en la ranura del reborde del cajón. Trae un cordón: al tirar de él se cierra sola, sin tocar el contenido. |
| Cordón de cierre | Algodón | Al levantar la bolsa, el cordón la cierra como un saco. |
| Bolsa llena y cerrada | Lista para la ruta de recolección | Va a la planta de compostaje. Puedes moverla: tiene peso y no atraviesa el equipo. |
| Pulpa molida | ≈ 0,6 kg por litro | Se amontona donde cae y se reparte sola con un talud de unos 42°. Las zonas color madera están tapadas con aserrín. |
| Residuo orgánico | Cáscaras, sobras, café, huevo, tusa | Cada trozo tiene masa, tamaño y dureza. Las cuchillas le quitan energía al volante hasta partirlo en dos, una y otra vez, hasta que cabe entre ellas. |
| Engranajes de sincronización 1:1 | Acero, 24 dientes | Obligan a los dos rodillos a girar igual de rápido y en sentidos opuestos, siempre hacia el centro. |
| Corona del reductor | Bronce, 50 dientes | Con el piñón de 10 dientes reduce 5:1: los rodillos giran 5 veces más lento que el volante pero con 5 veces más fuerza. |
| Piñón del reductor | Acero, 10 dientes | Va en el mismo eje del volante. |
| Eje del volante | Acero Ø 11 mm | Lleva el piñón de cadena, el volante y el piñón del reductor. |
| Volante de inercia | Hierro fundido · 1,45 kg · Ø 14 cm | Guarda la energía de cada pisada (unos 12 J) y se la entrega a las cuchillas cuando muerden algo duro. Por eso los rodillos siguen moliendo aunque levantes el pie. La marca naranja deja ver el giro. |
| Zapata de freno | Caucho sobre la llanta del volante | El volante guarda energía y seguiría girando solo; por eso, al soltar el gancho de la tapa, el cable del freno baja esta zapata sobre su llanta y los rodillos paran en menos de un segundo, antes de que la tapa termine de abrirse. |
| Piñón de cadena | Acero, 8 dientes | Recibe la cadena en el eje del volante. |
| Catalina | Acero, 24 dientes | Con el piñón de 8 multiplica el giro por 3, como en una bicicleta. |
| Eje inferior | Acero Ø 11 mm | Lleva la catalina y la rueda libre. |
| Piñón con rueda libre (uñas rojas) | Acero + 2 uñas con resorte | Funciona como la rueda libre de una bicicleta. El piñón engrana con la cremallera y SÍ gira hacia atrás cuando el pedal sube. Pero no está pegado al eje: lo une con él un par de uñas con resorte que se apoyan en una rueda de dientes de sierra fija al eje. Al bajar el pedal, las uñas se traban en los dientes y empujan el eje. Al subir el pedal, las uñas resbalan sobre la rampa de los dientes (clic, clic) y el eje sigue girando hacia adelante con el volante: nada se frena ni se devuelve. |
| Rueda de trinquete (dientes de sierra) | Acero, 12 dientes, fija al eje | Cada diente tiene una cara recta y una rampa: las uñas empujan contra la cara recta y resbalan por la rampa. Gira siempre hacia adelante, arrastrada por la cadena. |
| Chumacera | Acero + bronce | Apoya los ejes en la tapa del carter. |
| Cadena de rodillos 1/2" | Acero | Une la catalina con el piñón del volante. |
| Pedal derecho · triturar | Palanca de acero + taco de caucho | El pivote está atrás, bajo la base: pisas adelante y ES ESE extremo el que baja 5,5 cm. Empuja la cremallera hacia abajo. |
| Cremallera | Acero | Barra dentada unida a la palanca del pedal. Al bajar gira el piñón de la rueda libre. |
| Resorte de torsión del pedal | Acero de resorte, en el pivote | Enrollado en el pivote, como el de una caneca de pedal: sube el pedal cuando levantas el pie. No mueve la cremallera: la cremallera la mueve la palanca del pedal. |
| Pulsadores de la puerta (seguro) | Acero rojo con resorte | La puerta cerrada los empuja hacia adentro. Al abrir la puerta, sus resortes los sacan y por su varilla meten un segundo pasador bajo cada pedal: con el frente abierto no se puede moler ni echar aserrín. |
| Pasador de la puerta (pedal derecho) | Acero rojo Ø 9 mm | Segundo tope independiente del pedal derecho: entra cuando la puerta frontal se abre. |
| Cable del freno (tipo bicicleta) | Cable Bowden de acero | Une la palanca del gancho con la zapata de freno. Al soltar el gancho, el cable tira de la zapata contra la llanta del volante. |
| Colector con dos válvulas de lengüeta | PP + membranas de silicona | Hace que el fuelle bombee en un solo sentido: al estirarse, la primera válvula deja entrar el aire que viene del cajón; al comprimirse, esa se cierra y la segunda lo manda al carbón activado. |
| Fuelle de extracción de olores | Caucho EPDM · ≈ 0,3 L por pisada | Reemplaza al ventilador eléctrico. Al pisar se estira y aspira el aire del compartimento del cajón por la rejilla de atrás; al soltar lo empuja por el carbón activado y sale por la válvula de una vía. El interior queda en leve vacío: el aire entra hacia el equipo y nunca sale hacia la cocina. |
| Manguera del fuelle | Caucho | Lleva el aire del fuelle al carbón activado. |
| Pasador rojo del seguro infantil | Acero pintado Ø 9 mm | Paso 5 del seguro: mientras la tapa no esté cerrada y apretada (o si la puerta frontal está abierta), este pasador queda metido debajo de la palanca del pedal. El pedal choca con él a 1,5 mm y los rodillos no pueden girar. No hay sensores: es un tope de acero. |
| Pulsador rojo del marco | Acero con resorte | Paso 2 del seguro: la lengüeta de la tapa lo baja 4 mm. Con la tapa abierta, su resorte lo sube. |
| Varilla roja del seguro | Acero Ø 4 mm | Paso 3 del seguro: une el pulsador del marco con la escuadra de abajo. Baja 4 mm cuando la tapa está sellada. |
| Guía de la varilla | Acero | Mantiene la varilla roja recta en la esquina. |
| Escuadra del seguro | Acero | Paso 4 del seguro: palanca en L que convierte el movimiento vertical de la varilla en el movimiento horizontal del pasador. |
| Pedal izquierdo · aserrín | Palanca de acero + taco color madera | Pivote atrás; se pisa adelante. Tira del cable que desliza la placa dosificadora: cae una dosis de aserrín por atrás, izquierda y derecha. Bloqueado con la puerta abierta. |
| Resorte de torsión del pedal | Acero, en el pivote | Sube el pedal izquierdo cuando levantas el pie. |
| Pasador del pedal izquierdo | Acero rojo | Se mete bajo la palanca cuando la puerta frontal está abierta, para que el aserrín no caiga afuera. |
| Pestaña de la bandeja (sistema azul) | Acero | Aquí se engancha el alambre del indicador: cuando la bandeja baja por el peso, el alambre baja con ella. |
| Alambre del indicador | Alambre de acero Ø 3 mm | Une la bandeja con el brazo corto de la palanca. Baja exactamente lo mismo que la bandeja: 1 mm por cada kilo. Sube por la esquina delantera derecha, en el hueco entre el cajón y la pared: queda por fuera del camino del cajón y nunca estorba al sacarlo. |
| Palanca en L (sistema azul) | Lámina de acero estampada + remache | Tiene un brazo corto de 9 mm donde tira el alambre y un brazo largo de 62 mm que es la flecha. Cada milímetro que baja la bandeja gira la flecha unos 6°: así 12,5 kg recorren toda la lámina. No hay engranajes: es una sola pieza troquelada. |
| Flecha del indicador | Brazo largo de la palanca, pintado de rojo | Se mueve sobre la lámina de colores. Cuando pasa al rojo, el brazo de abajo de la misma palanca empuja el trinquete y la puerta frontal se destraba. |
| Lámina de colores | Adhesivo impreso detrás de una ventana de policarbonato | Verde hasta 7 kg, ámbar hasta 10,2 kg y rojo desde 10,2 kg (85 % de los 20 L). Solo la flecha se mueve. |
| Trinquete de la puerta (sistema azul) | Acero | Uña con resorte que traba la puerta. La levanta la varilla que empuja la palanca del indicador cuando la flecha entra al rojo. Si cierras la puerta con menos peso, se vuelve a trabar sola. |
| Depósito de aserrín en U | PP (parte del mismo cuerpo) · ≈ 5 L | Rodea la cámara por atrás y por los dos lados, en el hueco que ya deja el cuerpo: cuesta casi nada fabricarlo. Alcanza para unas 160 dosis (2-3 meses). |
| Aserrín o biochar | ≈ 0,2 kg por litro | Absorbe el agua libre (que es la que carga el olor), sube la relación carbono/nitrógeno y mantiene la pulpa aireada: así no se pudre ni huele. |
| Camisa | Tubo de PP | Los ejes y el conducto atraviesan el depósito por dentro de estos tubos, sin tocar el aserrín. |
| Placa dosificadora en U | Acero galvanizado con 27 celdas | En reposo las celdas están bajo el depósito y se llenan. Al pisar el pedal izquierdo la placa avanza 15 mm, las celdas quedan sobre las ranuras del piso y la dosis (≈ 30 mL, dos cucharadas) cae. Al soltar, un resorte la regresa y se vuelven a llenar. Nunca cae de más. |
| Ranuras de salida del aserrín | En el piso intermedio | Por atrás, izquierda y derecha: la dosis cae alrededor y se reparte sobre lo recién molido. |
| Resorte de la placa | Acero | Devuelve la placa para que las celdas se llenen otra vez. |
| Polea de reenvío | Bronce | Cambia el cable del pedal de vertical a horizontal. |
| Cable de acero | Acero trenzado Ø 1,5 mm | Del pedal izquierdo a la placa dosificadora. |
| Tapa del depósito de aserrín | PP color madera, bisagra atrás | Tres listones unidos en U alrededor de la boca. Queda debajo de la tapa principal: solo se puede levantar con la tapa abierta, y se abre hacia arriba igual que ella. Por ahí se vierte el aserrín (lo hace el operario cada 15 días). |
| Cartucho de carbón activado | 250 g en pellets · 12 × 6 × 4,5 cm | Atrapa las moléculas de olor del aire que sale. Lo cambia el operario cada 6 meses, sin herramientas. |
| Válvula de una sola vía | Membrana de silicona Ø 30 mm | Es la única salida de aire del equipo. Se abre sola con una presión mínima: deja salir el aire que empuja el fuelle y los gases que suelta la pulpa al descomponerse, siempre DESPUÉS de pasar por el carbón. Nunca deja que el aire vuelva a entrar por ahí: así el olor no regresa y el interior mantiene el leve vacío. |
| Conducto de aspiración | PP Ø 18 mm | Sube por la columna trasera desde la rejilla del cajón hasta el carbón activado. |
