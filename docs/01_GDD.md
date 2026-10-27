# GDD — Game Design Document v0.2

## Premisa
De 2 a 4 jugadores cooperan alrededor de un tablero para mantener una ciudad alimentada por renovables durante seis rondas. La luz y temperatura reales, junto con controles físicos, cambian las consignas y resultados; una consola local secundaria calcula y explica las consecuencias.

## Fantasía de jugador
«Somos el equipo que mantiene viva la ciudad: leemos el tablero, operamos controles físicos y acordamos qué priorizar cuando cambian las condiciones reales».

## Experiencia deseada
- Partidas de seis rondas y 8–12 minutos, sujetas a playtesting.
- Decisiones frecuentes pero inteligibles; no menús llenos de ecuaciones.
- La tensión aumenta por eventos predecibles parcialmente, sin trampas irremediables.
- Resultado verificable: energía atendida/no atendida, caudal ecológico, estado de batería y registro de decisiones; el score complejo queda fuera del MVP.
- El equipo puede perder y mejorar al repetir una configuración documentada.

## Flujo de ronda
Revelar demanda/evento → leer tablero y variables reales → acordar prioridades → ajustar hidro y batería con controles físicos → confirmar → validar entradas → resolver modelos → mover fichas y recibir feedback en LEDs/consola.

## Alcance MVP (aprobable por equipo)
1. Tablero físico de ciudad, río, PV, batería/bus y cargas críticas/no críticas; cartas o marcadores de ronda y fichas de energía/estado.
2. Electrónica mínima integrada: microcontrolador compatible, sensor de luz, sensor de temperatura, potenciómetro o slider hidro, selector de batería, botón confirmar y LEDs.
3. Batería con SOC y límite de potencia, electricidad demandada y cargas críticas.
4. Proxy de luz calibrado para gameplay y temperatura ambiente medida; estados inválido y desconectado visibles.
5. Consigna hidro física, modo batería y prioridad de cargas; el tablero y los controles alteran la resolución de cada ronda.
6. Consola local offline secundaria con variables, unidades, alertas y explicación causal breve.
7. Se excluyen del MVP: eólica, mapa isométrico, campaña, móvil, audio, backend y score complejo.

## Acciones y consecuencias (no cosméticas)
| Acción | Beneficio | Costo/riesgo | Ingeniería implicada |
|---|---|---|---|
| Abrir compuerta de turbina | ↑ generación hidro | ↓ caudal bypass; límite ecológico | hidráulica/ambiental/control |
| Reducir carga no crítica | prioriza hospital/servicios | satisfacción ciudadana menor | electrónica/operación |
| Descargar batería | cubre déficit inmediato | baja SOC y energía restante | electrónica/energía |
| Cargar batería | reserva ante evento | deja de servir carga presente o usa excedente; pérdidas | electrónica/termo |
| Cambiar luz o temperatura medida | modifica la condición PV de la ronda | exige calibración y puede resultar inválida | termo/electrónica |

## Objetivos, derrota y puntuación
- **Meta:** terminar el horizonte simulado abasteciendo suficientemente la carga crítica y preservando los límites del ecosistema.
- **Victoria:** cumplimiento de umbrales de rendimiento; definir umbrales con playtesting y escenario calibrado, no números arbitrarios escondidos.
- **Derrota:** colapso energético crítico sostenido durante una ventana definida, o final de misión con desempeño insuficiente. Evitar fin de partida por un solo segundo erróneo.
- **Resultado MVP:** éxito cooperativo si se preserva el caudal ecológico y se alcanza el umbral documentado de cargas críticas atendidas; los umbrales quedan pendientes de calibración y playtesting.
- Motivos y resultados son visibles; jamás penalizar por una entrada natural o sensor inválido sin explicar.

## Tablero, controles y consola
El tablero es la interfaz principal: representa río, central de pasada, PV, batería/bus y cargas, con espacios para cartas y fichas. Los controles están fijados al montaje y los LEDs no dependen solo del color. La consola local muestra lectura validada, resolución de ronda y explicación; no reemplaza mover fichas ni acordar consignas.

## Dirección artística
Optimismo eco-futurista sin propaganda; cyan/azules para energía, verde para conservación, ámbar para atención y rojo para fallo. El tablero diferencia PV, río, hidro, batería/bus y cargas mediante forma, texto y color redundantes.

## Seguridad del MVP
USB de baja tensión, carcasa, cableado fijo y montaje protegido. No se usan agua real, bombas, calor peligroso ni batería de potencia.

## Accesibilidad y feria
Español, unidades visibles, texto grande y claro a distancia, controles identificables, contraste y símbolos además del color. Probar con participantes no técnicos que comprendan propósito y primera acción en menos de 90 segundos.

## Evitar
- Trivias, preguntas de opción múltiple como mecánica principal.
- Variables físicas convertidas en puntos sin ecuaciones.
- «Subir potencia de paneles» mágicamente a voluntad del jugador.
- Generalizaciones del tipo «toda extracción de agua causa daño permanente»: enseñar límites y compromisos con contexto.
