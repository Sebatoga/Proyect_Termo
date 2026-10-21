# Campaña, escenarios y balance inicial v0.1

## Reglas de escenarios
1. Escenarios descritos mediante datos y semillas versionadas, no lógica escondida en widgets.
2. Cada misión debe probar **una decisión nueva** sin romper la continuidad física.
3. Clima, demanda y caudal son funciones predefinidas/interpolables del tiempo simulado; eventos con duración y causa, no cambios aleatorios mágicos en potencia.
4. La dificultad es una relación entre disponibilidad renovable, capacidad de batería y cargas; todos los escenarios deben ser **solubles** con buenas decisiones y **derrotables** por malas decisiones (se valida con agentes de prueba/replays).
5. No hacer que el jugador dependa de un pronóstico de extrema precisión que el juego oculta.

## Misiones propuestas (M1 inicialmente jugable, resto ampliación)
| ID | Nombre y propósito | Restricción física enseñada | Giro de gameplay | Estado |
|---|---|---|---|---|
| M1 | Primer Turno — entender suministro | potencia vs demanda, reserva BMS, bypass | tutorial y ajuste de compuerta | concepto |
| M2 | Ola de Calor — sostener ciudad | balance térmico PV, rendimiento por T, cargas de climatización | demanda crítica crece; batería y carga no crítica | concepto |
| M3 | Río en Tensión — respetar ecosistema | Q disponible, Qeco, pérdidas hidráulicas ~Q² | sequía exige reducir hidro | concepto |
| M4 | Viento Extremo — planificar reservas | v³, nominal, cut-out | viento alto NO implica siempre más energía | concepto |
| M5 | Crepúsculo — preservar batería | G disminuye a 0, almacenamiento con pérdidas | ahorrar antes de anochecer | concepto |
| M6 | Ciudad Resiliente — desafío final | sistemas acoplados | ola de calor + río bajo + viento errático | concepto |

## Evento vs efecto físico
- **Ola de calor:** aumenta temperatura ambiente, quizás demanda de climatización según perfil; temperatura celda evoluciona por ODE, no salta instantáneamente por una etiqueta.
- **Nubosidad:** reduce G W/m², PV responde según la fórmula; sin «reducción de 50% arbitraria» adicional después del cálculo.
- **Calma de viento:** v por debajo cut-in, energía eólica 0; batería y otras fuentes soportan red.
- **Temporal de viento:** v se acerca/supera cut-out, turbina desconecta por protección; evitar daño aleatorio que no se pueda anticipar.
- **Sequía:** Qriver baja; la compuerta se limita automáticamente para mantener bypass; si Qriver<Qeco, no se turbina.
- **Pico de demanda:** sube kW de carga de la ciudad, diferencia crítica/no crítica visible.

## Perfil de parámetros orientativos para M1 (NO datos medidos)
| Parámetro | Propuesta inicial | Comentario |
|---|---|---|
| Tsim | 6 horas | sesión ~6 min a 60 s simulados/1 s real |
| PV: A, ηref | 450 m², 0.20 | a G800, T25 → ~72 kW antes de otras pérdidas |
| Eólica: área, Cp, eta | 314 m², 0.42, 0.90 | viento medio 10 m/s → ~72.7 kW antes de potencia nominal |
| Hidro: Qriver, Qeco, Qturb inicial | 3.5, 1, 1.2 m³/s | bypass inicial 2.3 m³/s |
| Hidro: Hgross, K, eta | 15m, 0.12s²/m⁵, 0.80 | potencia ~139.6 kW, estimación |
| Batería: capacidad, SOC, Pmax | 400 kWh, 45%, 100 kW | pérdidas de carga/descarga explícitas |
| Demanda: crítica/no crítica | 120 / 140 kW | valores para calibrar dificultades |

Todos los valores se someten a consistencia y fuentes verificables; cambios requieren registro. Mantener `M1` equilibrada para que la solución óptima use alguna vez batería o racionamiento, no dejarla trivial.

## Dos diseños de dificultad
- **Normal:** eventos señalados ~30 s antes, penalizaciones progresivas, tiempo para decidir.
- **Difícil:** pronóstico menos exacto, restricciones más estrechas y demanda mayor, sin violar física ni aumentar aleatoriamente potencia instalada.

## Métricas de playtest
- % de partidas ganadas, cantidad de acciones significativas, tiempo de confusión, frecuencia de cambios de batería/compuerta, distribución de scores, incidentes más difíciles, intención de rejugar.
- Balancear con mismos escenarios/seed cuando se comparen estrategias.
- Registrar al menos un replay de política «hacer nada», política «extraer máximo permitido» y política «priorizar ecológico» para detectar exploits.
