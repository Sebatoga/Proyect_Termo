# Cómo jugar EcoGrid: Ciudad al Límite

> **Manual público provisional — BOOT-001.** Este documento describe el flujo
> objetivo del juego para poder ensayarlo, no una versión terminada. Las reglas
> dependen del inventario y las decisiones humanas del gate G1, de la revisión
> científica ECO-002 y de playtesting. Los componentes, umbrales y valores que
> siguen pendientes no deben completarse por intuición ni presentarse como
> definitivos.

## El juego en un minuto

EcoGrid es un juego cooperativo de mesa con electrónica para **2–4 jugadores**.
El grupo opera durante **seis rondas** una ciudad alimentada por energía solar,
una central hidroeléctrica de pasada y una batería. La partida objetivo dura
**8–12 minutos**, duración todavía pendiente de playtesting.

En cada ronda el equipo observa una condición, decide qué cargas proteger,
ajusta los controles y confirma una única resolución. El reto no consiste en
recitar fórmulas: consiste en reconocer que la disponibilidad natural tiene
límites, que la batería no crea energía y que atender todo a la vez puede no ser
posible.

## Antes de usar este manual

Este recorrido puede servir para una prueba en papel o para preparar un ensayo
guiado. Todavía no certifica una partida física completa porque:

- **G1 está pendiente:** faltan inventario, modelos exactos, presupuesto,
  responsables, fechas, acceso de fabricación y dimensiones del tablero.
- **ECO-002 está bloqueada:** los modelos documentados son propuestas bajo
  revisión y no forman una baseline científica aceptada.
- **El balance está pendiente:** duración, dificultad, perfiles de misión y
  umbrales de victoria requieren playtesting reproducible.
- **El hardware no está seleccionado:** no se afirma que existan sensores,
  controles, LEDs, carcasa, firmware o montaje disponibles y funcionales.

Cuando falte electrónica, una persona facilitadora puede usar tarjetas rotuladas
como simulación de mesa. Esto ensaya el flujo, no el hardware ni su calibración.

## Misión cooperativa

La ciudad necesita energía para sus cargas críticas y no críticas. El equipo
debe aprovechar las fuentes disponibles, proteger la reserva y mantener el
caudal ecológico del río. Todas las personas ganan o pierden juntas.

La misión mínima busca dos resultados simultáneos:

1. atender suficientemente las cargas críticas y el conjunto de la demanda;
2. respetar el límite ambiental durante toda derivación hidroeléctrica.

## Componentes previstos

Reúna los componentes por función antes de preparar la mesa. Los nombres de
modelos, cantidades finales, tolerancias y conexiones quedan sujetos a G1.

| Categoría | Componentes previstos | Función durante la partida |
|---|---|---|
| Tablero | zonas de PV, río, central de pasada, batería/bus y cargas | hacer visible el recorrido de recursos y energía |
| Estado físico | fichas de energía, suministro, reserva y alertas | registrar consecuencias sin depender de memoria |
| Escenario | seis cartas o marcadores de ronda y una futura tarjeta de misión | definir orden, condición y criterios visibles |
| Decisión | marcadores de prioridad de cargas | indicar qué servicio se atiende primero |
| Entradas | luz, temperatura, control hidro, selector de batería y confirmación | modificar consignas o condiciones de la ronda |
| Respuesta | texto, símbolos, indicadores y futura consola local | mostrar estado válido, resultado y explicación |
| Seguridad | alimentación USB de baja tensión, carcasa y cableado fijo | reducir exposición y evitar piezas sueltas |

**Advertencia:** esta lista expresa funciones requeridas, no una lista de compra.
El hardware no ha sido seleccionado. El MVP excluye agua real, bombas, fuentes
de calor peligrosas y baterías de potencia.

## Preparación

1. Ubique el tablero para que todas las personas alcancen los controles y puedan
   leer texto y símbolos sin depender solo del color.
2. Separe las zonas de PV, río/hidro, batería/bus, cargas críticas y cargas no
   críticas.
3. Coloque las fichas iniciales y marcadores según la futura tarjeta de misión.
   Si todavía no existe una configuración revisada, rotule el ensayo como
   **prototipo de flujo sin balance definitivo**.
4. Ordene las seis cartas: base, temperatura alta, río bajo, pico de demanda,
   luz reducida y combinación final.
5. Deje visibles los estados de cada entrada: válida, inválida o desconectada.
6. Compruebe que el control hidro, el selector de batería y la confirmación puedan
   distinguirse por texto o forma, además de cualquier color.
7. Lea en voz alta la misión y señale dónde aparecerán `Scrit`, `Stotal`, el
   cumplimiento del caudal ecológico y el estado de reserva.
8. Acuerde quién mueve fichas y quién confirma. Los roles son ayudas de
   coordinación, no poderes exclusivos.
9. Si se usa un montaje futuro, haga la inspección de seguridad y sincronización
   antes de comenzar. Si falla, no improvise conexiones durante la partida.

## Roles cooperativos opcionales

Pueden rotar en cada ronda u omitirse si el grupo decide en conjunto.

| Rol | Ayuda de coordinación |
|---|---|
| Coordinación | lee la carta y comprueba el acuerdo antes de confirmar |
| Energía | sigue PV, batería/bus y fichas servidas o no servidas |
| Río y ambiente | observa agua, consigna hidro y caudal ecológico |
| Registro | mueve fichas, anota alertas y conserva la explicación |

Ningún rol puede alterar una lectura, saltarse una protección ni confirmar sin
que el equipo conozca la decisión.

## Qué puede controlar el equipo

| El equipo controla | El equipo no controla directamente |
|---|---|
| prioridad entre cargas críticas y no críticas | condición de luz observada |
| consigna solicitada al control hidro | temperatura ambiente observada |
| modo permitido de la batería | caudal total que trae el río |
| momento de confirmar una decisión válida | demanda revelada por la ronda |
| debate, estrategia y movimiento correcto de fichas | pérdidas físicas y límites de los modelos |
| reintento tras resincronizar una ronda interrumpida | convertir una entrada inválida en válida por votación |

Controlar una consigna no garantiza obtener todo lo solicitado. El sistema debe
acotarla por disponibilidad, seguridad, reserva y restricciones ambientales.

## Uso de entradas y controles

| Entrada o control | Uso correcto |
|---|---|
| **Proxy de luz de gameplay** | durante prototipado selecciona una condición provisional; solo tras calibración final puede describirse con el alcance calibrado, nunca como irradiancia sin calibración metrológica |
| Temperatura | una lectura que pasa los controles de entrada modifica la condición térmica PV; modelo, sensor y rangos siguen provisionales hasta la validación final |
| Control hidro | solicita una derivación, luego acotada por agua disponible, capacidad y caudal ecológico; si el río no alcanza el mínimo, no se deriva ni se culpa al equipo |
| Batería | permite conservar reserva, cargar excedente o descargar ante déficit, siempre con límites y pérdidas; nunca carga y descarga a la vez |
| Confirmación | congela prioridad, hidro y batería para resolver una sola vez; un error técnico obliga a reintentar la misma ronda |

Una entrada fuera de rango o desconectada activa la pausa. Nunca se sustituye
por una lectura anterior ni se cambia después para corregir el resultado.

## Flujo de cada ronda

Use siempre esta secuencia. El camino principal no exige leer ecuaciones.

1. **Revelar:** muestre al grupo la carta de demanda o evento de la ronda.
2. **Leer:** observe tablero, proxy de luz calibrado para gameplay, temperatura,
   río, batería y estado de conexión.
3. **Comprobar:** no avance si una entrada requerida está inválida o
   desconectada.
4. **Acordar:** elija prioridad de cargas, consigna hidro y modo de batería.
5. **Ajustar:** lleve los controles físicos a la decisión acordada.
6. **Confirmar:** anuncie la decisión y pulse confirmación una sola vez.
7. **Resolver:** aplique PV → hidro → batería/bus → cargas → efectos de tablero.
8. **Explicar:** mueva fichas, muestre alertas y relate la causa del resultado.
9. **Registrar:** guarde suministro crítico, suministro total, condición
   ecológica, reserva y cualquier incidencia.
10. **Continuar:** avance solo cuando tablero y registro representen el mismo
    estado.

## Secuencia provisional de seis rondas

La secuencia fija facilita comparar estrategias. Sus perfiles exactos siguen
pendientes de calibración científica y playtesting.

| Ronda | Condición provisional | Pregunta que guía la decisión |
|---|---|---|
| 1 | Base | ¿Entendemos el tablero y qué cargas debemos priorizar? |
| 2 | Temperatura alta | ¿Cómo cambia el despacho si el aporte PV es menos favorable? |
| 3 | Río bajo | ¿Qué consigna hidro es posible sin vulnerar el caudal ecológico? |
| 4 | Pico de demanda | ¿Qué cargas protegemos y cuándo usamos la batería? |
| 5 | Luz reducida | ¿Cómo administramos la reserva sin inventar generación? |
| 6 | Combinación final | ¿Podemos sostener el balance y explicar todas las consecuencias? |

Las cartas no aplican penalizaciones arbitrarias además de los efectos del
modelo. La ronda final debe ser reproducible mediante escenario o semilla
versionada, no mediante una sorpresa oculta imposible de anticipar.

La referencia aislada usa las claves de máquina `base-demand`,
`high-temperature`, `low-river`, `demand-peak`, `reduced-light` y
`seeded-combination` para conservar este orden. Son identificadores semánticos
provisionales; no acreditan efectos, valores ni balance validados.

## Cómo se resuelve una decisión

La resolución conceptual sigue este orden:

1. **PV:** la entrada de luz validada selecciona una condición de gameplay y la
   temperatura afecta el comportamiento térmico propuesto.
2. **Hidro:** el río y el mínimo ecológico determinan qué parte puede derivarse;
   la consigna acotada y las pérdidas determinan el aporte hidro.
3. **Batería y bus:** se reúnen los aportes disponibles y se aplica el modo de
   batería sin violar reserva, capacidad ni pérdidas.
4. **Cargas:** se atienden según la prioridad acordada; toda demanda no atendida
   queda visible, no desaparece del registro.
5. **Tablero:** se mueven fichas y se muestran suministro, déficit, reserva,
   vertimiento o alertas con una explicación breve.

Este orden representa conservación y causalidad. No concede energía extra por
una buena discusión ni resta energía dos veces por una misma pérdida.

## Victoria mínima y resultado anti-trampa

La futura tarjeta de misión debe imprimir sus umbrales antes de empezar. Hasta
que ECO-002 y el playtesting los sustenten, esos campos permanecen **pendientes**
y ninguna cifra de ensayo se convierte en regla general.

- `Scrit` expresa la proporción de energía crítica requerida que fue atendida.
- `Stotal` expresa la proporción de toda la energía demandada que fue atendida.
- El registro ambiental indica `conforme`, `incumplimiento atribuible al equipo`
  o `indisponibilidad natural`, y si la evidencia es verificable.

Hay victoria cooperativa mínima solo si, al terminar las seis rondas:

1. `Scrit` alcanza el umbral impreso en la tarjeta de misión;
2. `Stotal` alcanza su propio umbral impreso;
3. el estado ambiental verificable permanece conforme; una indisponibilidad
   natural verificable no se atribuye al equipo ni cuenta como incumplimiento; y
4. no quedan rondas sin resolver ni estados técnicos ambiguos.

Exigir `Scrit` y `Stotal` evita la trampa de atender únicamente una categoría o
de apagar toda la ciudad para aparentar conservación. La reserva final y el
vertimiento se muestran como diagnóstico o, si una futura misión lo declara,
como desempate. **Todavía no forman un score ponderado.**

Regla anti-trampa adicional: si la demanda externa total es positiva y el equipo
no entrega ningún servicio, no puede ganar aunque los umbrales provisionales de
la misión fueran cero. Esta condición no fija umbrales de cobertura ni demuestra
que la dificultad esté balanceada.

Esta estructura multidimensional sin pesos fue adoptada en ADR-011. La
referencia ejecutable permite ensayar el resultado, pero no convierte sus
umbrales provisionales en reglas oficiales ni demuestra que la misión esté
balanceada.

Las coberturas se obtienen sumando servicio y demanda de todas las rondas antes
de dividir; no se promedian porcentajes por ronda. Si no hubo demanda en una
dimensión, su cobertura se muestra como completa, pero una misión sin demanda
total externa termina en derrota conservadora y no en victoria trivial. Si hubo
demanda total positiva y no se sirvió, `Stotal` es cero.

## Derrota e incompleta no significan lo mismo

### Derrota jugable

Una partida es derrota cuando las seis rondas se resolvieron con entradas
válidas y el resultado incumple al menos una condición de victoria definida en
la tarjeta. El equipo debe poder ver qué faltó y qué decisión podría revisar.

Una futura misión podrá declarar un colapso sostenido, pero su ventana y umbral
deben estar impresos y probados. Un instante aislado no causa derrota automática.

### Partida incompleta

Una partida es **incompleta** si una entrada desconectada/incompleta, error de
protocolo, desincronización, tarjeta faltante o estado ambiguo impide verificarla.
No cuenta como derrota, victoria ni dato de balance sin registrar la incidencia.
También queda incompleta si la evidencia ambiental no es verificable o el
registro contiene cantidades inválidas, IDs repetidos o un número de rondas
distinto del declarado por la misión.

## Desconexión, lectura inválida o error

Si una entrada requerida aparece inválida, desconectada o incompleta:

1. pause la ronda antes de resolver y no mueva fichas de resultado;
2. conserve visibles la carta y las decisiones anunciadas;
3. no reutilice silenciosamente el último valor válido;
4. identifique la entrada afectada y muestre un aviso comprensible;
5. resincronice tablero, controles y estado recibido desde una referencia
   observable, sin inventar el estado anterior;
6. valide de nuevo todas las entradas requeridas; y
7. reintente **la misma ronda**, sin avanzar carta ni contar doble el resultado.

Si la recuperación no es segura, termine el ensayo como partida incompleta y
registre la causa. Reiniciar la electrónica no autoriza a reconstruir de memoria
un valor físico desconocido.

## Ejemplo completo de una ronda

El grupo revela **Ronda 3: río bajo**. La carta advierte que el recurso hídrico
es limitado, pero no inventa una cifra científica. El registro muestra el proxy
de luz y la temperatura como válidos, el control hidro conectado y la batería
con reserva disponible en una categoría visible de gameplay.

Coordinación pregunta qué debe protegerse. El grupo mantiene primero las cargas
críticas y decide conservar parte de la batería para rondas posteriores. Río y
ambiente propone una consigna hidro moderada; antes de confirmar, recuerda que
la central solo puede usar el agua restante después del caudal ecológico.

Las personas ajustan prioridad, control hidro y modo de batería. Registro repite
la decisión y se pulsa confirmar. La resolución procesa primero la condición PV,
luego acota la derivación hidro, después equilibra batería/bus y finalmente
asigna energía a las cargas.

El resultado indica que las cargas críticas quedan atendidas, parte de las no
críticas queda sin atender y la batería conserva reserva. El tablero muestra el
agua no derivada y confirma el respeto del caudal ecológico. No se asignan kW,
kWh, caudales, porcentajes ni puntos ficticios: una implementación posterior
deberá obtenerlos de perfiles revisados y mostrar sus unidades.

El equipo mueve las fichas, registra servicio crítico, servicio total, reserva y
estado ambiental, explica por qué no pudo atender todo y avanza a la ronda 4.

## Referencia rápida imprimible

**Objetivo:** complete seis rondas, supere los umbrales impresos de `Scrit` y
`Stotal` y respete siempre el caudal ecológico.

**En cada ronda:**

1. Revele la carta.
2. Lea entradas y estados.
3. Acuerde cargas, hidro y batería.
4. Ajuste y confirme.
5. Resuelva PV → hidro → batería/bus → cargas → tablero.
6. Explique, registre y avance.

**Si hay error:** pause → no reutilice el último valor → resincronice → valide
→ reintente la misma ronda. Si no se recupera, marque **incompleta**.

**Recordatorios:**

- La luz es un proxy calibrado para gameplay, no una magnitud solar medida.
- La consigna hidro nunca pasa por encima del agua disponible ni del caudal
  ecológico.
- La batería desplaza energía con límites y pérdidas; no la crea.
- Confirmar resuelve una vez; ningún cambio posterior reescribe la ronda.
- Reserva y vertimiento informan o desempatan; aún no son score ponderado.

## Límites educativos

EcoGrid enseña relaciones causales, pero no diseña, dimensiona ni pronostica una
instalación real. PV omite detalles de módulos e inversores; hidro representa
una central de pasada sin embalse, transitorios ni ecología total; batería/bus
usa límites y pérdidas simplificados. Un caudal mínimo no demuestra salud
integral del ecosistema.

Ecuaciones, unidades, hipótesis y pruebas quedan en la documentación técnica. El
camino principal usa controles, símbolos y explicaciones sin exigir leerlas.

## Reglas pendientes antes de cerrar el manual

- Definir y justificar los umbrales por misión para `Scrit` y `Stotal`.
- Decidir si existe colapso anticipado y cuál es su ventana sostenida.
- Balancear perfiles de demanda, condiciones naturales, reserva y dificultad.
- Diseñar la futura tarjeta de misión y las categorías visibles de estado.
- Determinar si reserva o vertimiento funcionan como desempate y en qué orden.
- Ratificar componentes, rangos, controles y procedimiento de sincronización
  después de G1.
- Sustituir cualquier facilitación en papel por entradas integradas solo cuando
  exista evidencia de banco, calibración, protocolo y seguridad.
- Revisar los modelos y sus valores mediante el gate científico ECO-002.

## Pruebas necesarias

- Ensayo no técnico: comprender misión y primera acción sin leer ecuaciones.
- Playtesting: seis rondas en 8–12 minutos con misión y secuencia repetibles.
- Replays de «no hacer nada», «extraer máximo» y «priorizar el ambiente» para
  detectar victorias triviales o incentivos dañinos.
- Casos normal, extremo y de entrada inválida/desconectada con esperado/obtenido.
- Río bajo el caudal ecológico: no derivar ni inventar agua, y no culpar al equipo.
- Batería vacía/llena, límites, pérdidas y carga/descarga no simultáneas.
- Pausa, resincronización y reintento sin duplicar fichas ni resultados.
- Prueba integral futura con controles, tablero, indicadores y consola: cada
  cambio confirmado debe producir una consecuencia visible en esa ronda.
- Inspección de baja tensión, carcasa y cableado fijo antes de probar con público.
- Registro de versión de misión, escenario, calibración y reglas para que cada
  resultado pueda repetirse y explicarse.

Hasta completar esas pruebas, este manual sigue siendo una guía provisional de
flujo y una base para detectar dudas, no evidencia de producto terminado.
