# Partida mínima de seis rondas y eventos reproducibles

## Reglas de escenarios
1. Una sola partida dura 8–12 minutos y completa seis rondas; no hay campaña en el MVP.
2. Cartas/eventos mínimos usan datos y semillas versionadas, no lógica escondida en UI o firmware.
3. Clima, demanda y caudal son funciones predefinidas/interpolables del tiempo simulado; eventos con duración y causa, no cambios aleatorios mágicos en potencia.
4. La dificultad relaciona disponibilidad renovable, batería y cargas; la partida debe ser **soluble** con buenas decisiones y **derrotable** con malas decisiones, validado mediante replays reproducibles.
5. No hacer que el jugador dependa de un pronóstico de extrema precisión que el juego oculta.

## Secuencia MVP propuesta
| Ronda | Carta/evento mínimo | Decisión observable |
|---|---|---|
| 1 | demanda base | reconocer tablero, lecturas y prioridad |
| 2 | temperatura elevada | ajustar despacho ante menor rendimiento PV |
| 3 | río bajo | limitar derivación y respetar caudal ecológico |
| 4 | pico de demanda | elegir cargas críticas y modo de batería |
| 5 | luz reducida | administrar reserva sin inventar generación |
| 6 | combinación sembrada | sostener balance y explicar el resultado |

La secuencia es propuesta hasta playtesting. Cada ronda usa lectura/estado real validado, controles físicos y una resolución única en tablero, LEDs y consola. Una entrada inválida pausa o aplica la contingencia documentada; nunca altera el resultado silenciosamente.

## Evento vs efecto físico
- **Ola de calor:** aumenta temperatura ambiente, quizás demanda de climatización según perfil; temperatura celda evoluciona por ODE, no salta instantáneamente por una etiqueta.
- **Nubosidad:** reduce G W/m², PV responde según la fórmula; sin «reducción de 50% arbitraria» adicional después del cálculo.
- **Sequía:** Qriver baja; la compuerta se limita automáticamente para mantener bypass; si Qriver<Qeco, no se turbina.
- **Pico de demanda:** sube kW de carga de la ciudad, diferencia crítica/no crítica visible.

## Perfil de parámetros orientativos para M1 (NO datos medidos)
| Parámetro | Propuesta inicial | Comentario |
|---|---|---|
| Rondas/duración | 6 / 8–12 min | validar mediante playtesting |
| PV: A, ηref | 450 m², 0.20 | a G800, T25 → ~72 kW antes de otras pérdidas |
| Hidro: Qriver, Qeco, Qturb inicial | 3.5, 1, 1.2 m³/s | bypass inicial 2.3 m³/s |
| Hidro: Hgross, K, eta | 15m, 0.12s²/m⁵, 0.80 | potencia ~139.6 kW, estimación |
| Batería: capacidad, SOC, Pmax | 400 kWh, 45%, 100 kW | pérdidas de carga/descarga explícitas |
| Demanda: crítica/no crítica | 120 / 140 kW | valores para calibrar dificultades |

Todos los valores se someten a consistencia y fuentes verificables; cambios requieren registro. Mantener `M1` equilibrada para que la solución óptima use alguna vez batería o racionamiento, no dejarla trivial.

## Métricas de playtest
- % de partidas ganadas, cantidad de acciones significativas, tiempo de confusión, frecuencia de cambios de batería/compuerta, distribución de scores, incidentes más difíciles, intención de rejugar.
- Balancear con la misma secuencia/semilla y calibración cuando se comparen estrategias.
- Registrar al menos un replay de política «hacer nada», política «extraer máximo permitido» y política «priorizar ecológico» para detectar exploits.
