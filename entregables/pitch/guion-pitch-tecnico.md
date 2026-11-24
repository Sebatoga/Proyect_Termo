# Guion del pitch — EcoGrid: Ciudad al Límite

**Duración objetivo:** 6:30–6:50  
**Límite oficial:** 7 minutos  
**Regla de presentación:** diferenciar siempre lo verificado, lo que está en desarrollo y lo pendiente.

## Diapositiva 1 — EcoGrid: Ciudad al Límite (0:00–0:40)

> Buenos días. Somos el equipo EcoGrid y presentamos *Ciudad al Límite*, un
> juego cooperativo de mesa con electrónica. Nuestra propuesta parte de un
> problema real: una ciudad necesita energía de forma continua, pero la
> producción renovable cambia con el ambiente y los recursos tienen límites.
>
> En EcoGrid, las condiciones físicas no son decoración. La luz, la temperatura
> y las decisiones sobre el agua cambian el resultado de la partida. El reto del
> equipo es mantener las cargas esenciales sin desperdiciar energía ni vulnerar
> el caudal ecológico.

**Transición:** “Primero veamos qué decisión toma realmente un jugador”.

## Diapositiva 2 — El reto y la experiencia (0:40–1:35)

> De dos a cuatro jugadores administran una ciudad durante seis rondas. En cada
> ronda aparece una demanda o un evento. El equipo observa el tablero, lee las
> condiciones de luz y temperatura, y decide cuánta agua derivar, cómo usar la
> batería y qué cargas priorizar.
>
> Después confirma la decisión. Los modelos calculan la energía disponible y el
> equipo mueve fichas para representar qué cargas fueron atendidas y cuánta
> reserva queda.
>
> No es un juego de preguntas. Tampoco es una simulación escondida detrás de una
> pantalla. La discusión entre los jugadores, el tablero, los controles físicos
> y las ecuaciones forman una sola experiencia. Y aplicamos una regla central:
> no existe energía gratis; toda elección tiene límites, pérdidas y
> consecuencias.

**Transición:** “Esas consecuencias nacen de dos fenómenos científicos”.

## Diapositiva 3 — Ciencia que determina la partida (1:35–2:55)

> El primer fenómeno pertenece a la termodinámica. Usamos un modelo concentrado
> del panel solar. La energía absorbida aumenta su temperatura, mientras que la
> convección y la potencia eléctrica extraída reducen ese balance. Además, al
> aumentar la temperatura de la celda, disminuye su eficiencia eléctrica.
>
> El sensor de luz se denomina *proxy de luz calibrado para gameplay*. No
> afirmamos que mida irradiancia en vatios por metro cuadrado mientras no exista
> una calibración trazable.
>
> El segundo fenómeno pertenece a la mecánica de fluidos. Modelamos una central
> hidroeléctrica de pasada. El jugador solicita un caudal, pero el sistema limita
> la derivación al agua realmente disponible después de proteger el caudal
> ecológico. El salto neto también disminuye con pérdidas proporcionales al
> cuadrado del caudal.
>
> Esto integra ingeniería ambiental de forma funcional: conservar el río reduce
> físicamente la potencia disponible. No es una pregunta de trivia ni un bono de
> puntos. Si el río trae menos que el mínimo ecológico, no se deriva agua y
> tampoco se culpa al jugador por una condición natural.

**Transición:** “Para que una variable real llegue al juego, atraviesa una cadena segura”.

## Diapositiva 4 — Sistema híbrido (2:55–3:55)

> La cadena comienza en sensores y controles físicos: luz, temperatura, control
> hidro y confirmación. Una placa ESP32-C6 adquiere las señales, comprueba rangos
> y marca cada dato como válido, inválido o desconectado.
>
> Los mensajes viajan por USB serial mediante un protocolo versionado. En el
> computador, un adaptador valida el mensaje antes de entregarlo al dominio
> científico. Solo entonces se ejecutan los modelos PV, hidro y batería.
>
> El resultado vuelve al tablero y a una consola local secundaria. El tablero
> sigue siendo la interfaz principal; la consola muestra variables, alertas y
> una explicación breve de lo ocurrido.
>
> La seguridad también limita el diseño: trabajamos con baja tensión por USB,
> montaje protegido y cableado fijo. No usamos agua real, bombas, fuentes de
> calor peligrosas ni baterías de potencia.

**Transición:** “Como el plazo es de dos semanas, congelamos un alcance mínimo”.

## Diapositiva 5 — MVP reducido (3:55–4:45)

> El MVP conserva únicamente lo necesario para demostrar el ciclo completo.
> Incluye un tablero sencillo, seis rondas reproducibles, luz, temperatura,
> control hidro, los modelos PV e hidro, una batería simplificada, USB serial y
> una consola local.
>
> Posponemos eólica, campaña, mapa, audio, aplicación móvil, backend, eventos
> complejos y puntuación ponderada. Tampoco afirmaremos una calibración
> metrológica que no podamos realizar.
>
> Nuestra regla de alcance es directa: si una función no demuestra ciencia,
> causalidad híbrida o seguridad, queda fuera de estas dos semanas.

**Transición:** “Esta reducción aprovecha una base técnica que ya existe”.

## Diapositiva 6 — Evidencia real y uso de IA (4:45–5:55)

> Ya verificamos una consola local que funciona sin depender de Internet, un
> ciclo técnico completo de seis rondas en navegador y validaciones de mensajes
> que fallan de forma segura ante entradas incorrectas. También existe un núcleo
> C++ probado en computador para los primeros mensajes del protocolo.
>
> Sin embargo, debemos ser precisos: todavía no existe integración física
> completa. La placa, la LDR y la sonda de temperatura fueron reportadas, pero
> faltan autenticar el pinout, cargar firmware, calibrar, conectar USB al producto
> y ejecutar pruebas hardware-in-the-loop.
>
> La validación científica ECO-002 también continúa bloqueada: hay ecuaciones,
> unidades y casos documentados, pero todavía no existe una línea base aceptada
> mediante revisión independiente. Esa revisión, la reproducción independiente
> y la aceptación integrada se realizarán con el MVP completo, antes de la
> entrega académica; hasta entonces los modelos se presentan como provisionales.
>
> Utilizamos inteligencia artificial para apoyar arquitectura, documentación,
> generación de código y pruebas. Cada intervención queda registrada. El equipo
> conserva la autoría y debe revisar las ecuaciones, ejecutar las pruebas y
> aportar la evidencia física. La IA no reemplaza mediciones ni aprobación
> científica.

**Transición:** “Por eso los catorce días se organizan alrededor de la ruta crítica”.

## Diapositiva 7 — Plan de 14 días y cierre (5:55–6:45)

> Durante los dos primeros días congelaremos alcance, pinout, responsables y los
> modelos mínimos que entrarán al MVP. Entre los días tres y cinco construiremos
> el banco de sensores, firmware y comunicación USB con estados de error.
>
> Entre los días seis y diez integraremos los modelos, las reglas, el tablero y
> la consola en una única partida. Los últimos cuatro días serán exclusivamente
> para pruebas normales, límites, desconexión, seguridad, playtesting,
> correcciones y documentación.
>
> Nuestro resultado mínimo será observable: al cambiar una variable física,
> cambia una decisión energética; el sistema protege el caudal ecológico y deja
> una evidencia reproducible de lo ocurrido.
>
> EcoGrid convierte las ecuaciones en una conversación entre jugadores:
> **¿cómo mantenemos viva la ciudad sin agotar sus recursos?**

## Respuestas breves para preguntas probables

### ¿El sensor de luz mide irradiancia?

No todavía. Se presenta como un proxy de luz calibrado para seleccionar una
condición de gameplay. Convertirlo a W/m² exigiría calibración trazable.

### ¿Por qué no usan agua real?

Por seguridad y alcance. El caudal se representa mediante un control físico y un
modelo en SI; no se usan bombas ni agua cerca de la electrónica.

### ¿Qué está realmente terminado?

La base verificable incluye la consola local offline, el ciclo técnico de seis
rondas, validación fail-closed del protocolo y un núcleo C++ probado en host.
Sensores, USB real, modelos integrados, tablero y HIL siguen pendientes.

### ¿Cómo participa ingeniería ambiental?

El caudal ecológico limita físicamente el agua derivable y, por tanto, la
potencia hidroeléctrica. No es una bonificación cosmética.

### ¿Qué hizo la IA?

Apoyó diseño, documentación, código y pruebas. El proceso se registra; las
decisiones, verificaciones, mediciones y presentación final siguen siendo
responsabilidad del equipo.
