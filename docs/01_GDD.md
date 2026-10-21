# GDD — Game Design Document v0.1

## Premisa
Una pequeña ciudad depende enteramente de fuentes renovables. El jugador dirige el centro de control EcoGrid y debe sobrevivir a crisis climáticas, gestionar demanda y mantener el río sano. Cada decisión tiene un costo eléctrico o ambiental visible.

## Fantasía de jugador
«Soy el operador que mantiene viva la ciudad; debo decidir en segundos qué priorizar cuando cambia el clima».

## Experiencia deseada
- Sesiones cortas 4–8 minutos; objetivo base ~6 minutos, sujeto a playtesting.
- Decisiones frecuentes pero inteligibles; no menús llenos de ecuaciones.
- La tensión aumenta por eventos predecibles parcialmente, sin trampas irremediables.
- Resultado verificable: puntuación, energía atendida/no atendida, caudal ecológico, eficacia de almacenamiento, registro de eventos.
- El jugador puede perder y mejorar al repetir con misma semilla.

## Loop principal (20–40 s)
Observar pronóstico y demanda → elegir consignas (turbina, batería, prioridad de cargas) → ver potencia/caudal/temperatura → atender incidente → recibir feedback y puntaje parcial.

## Alcance MVP (aprobable por equipo)
1. Menú y selección simple de dificultad / tutorial.
2. Una ciudad con 3 instalaciones animadas: fotovoltaica, eólica, hidro de pasada.
3. Batería con SOC y límite de potencia, electricidad demandada y cargas críticas.
4. Reloj simulado fijo, clima por escenario con semilla; nubes/calor/viento/caudal.
5. Dos acciones significativas: consigna de derivación hidro y modo batería, más prioridad de cargas ante déficit. El MVP puede incorporar control de curtailment como tercer ajuste.
6. Incidentes: ola de calor, caída de viento, sequía, pico de demanda (al menos cuatro perfiles).
7. Panel legible: MW/kW, kWh, °C, m³/s, estado de suministro, índice ambiental.
8. Puntuación más pantalla de resultados y explicación de por qué cambió.
9. Pausa, reinicio, audio activable/desactivable, versión offline probada.
10. Tutorial interactivo corto; la versión avanzada puede mostrar ecuaciones/hipótesis.

## Acciones y consecuencias (no cosméticas)
| Acción | Beneficio | Costo/riesgo | Ingeniería implicada |
|---|---|---|---|
| Abrir compuerta de turbina | ↑ generación hidro | ↓ caudal bypass; límite ecológico | hidráulica/ambiental/control |
| Reducir carga no crítica | prioriza hospital/servicios | satisfacción ciudadana menor | electrónica/operación |
| Descargar batería | cubre déficit inmediato | baja SOC y energía restante | electrónica/energía |
| Cargar batería | reserva ante evento | deja de servir carga presente o usa excedente; pérdidas | electrónica/termo |
| Activar refrigeración de PV (post-MVP) | baja temperatura de celda | consumo eléctrico y caudal de refrigeración | termo/fluidos/electrónica |

## Objetivos, derrota y puntuación
- **Meta:** terminar el horizonte simulado abasteciendo suficientemente la carga crítica y preservando los límites del ecosistema.
- **Victoria:** cumplimiento de umbrales de rendimiento; definir umbrales con playtesting y escenario calibrado, no números arbitrarios escondidos.
- **Derrota:** colapso energético crítico sostenido durante una ventana definida, o final de misión con desempeño insuficiente. Evitar fin de partida por un solo segundo erróneo.
- **Score propuesto (0–100):** 50 puntos por energía crítica abastecida (kWh), 20 por demanda total servida, 20 por cumplimiento de restricciones ambientales y 10 por uso responsable de recursos. Definir métricas cuantificadas, normalización y casos de borde en `docs/02_MODELOS_FISICOS.md` antes de implementar score.
- Puntaje, motivos y resultados son visibles; jamás penalizar por fenómenos naturales fuera del control del jugador sin explicar.

## Interfaz/escenas
Pantalla de inicio → tutorial opcional → ciudad (centro) + indicadores (arriba) + controles directos (lateral/inferior) → pausa → resultados + explicación + repetir semilla.
Vista 2D pseudoisométrica o isométrica ligera; sin 3D complejo. Diseño de tarjetas y símbolos de estado, no únicamente cambios de color. Diferenciar planta solar, eólica, hidro, batería, ciudad y río.

## Dirección artística
Optimismo eco-futurista sin propaganda; cyan/azules para energía, verde para conservación, ámbar para atención, rojo para fallo; alto contraste y etiquetado redundante. Efectos ligeros: luces de edificios, nubes, viento, nivel de río. No renderizar miles de partículas.

## Audio
Ambiente moderado, un sonido por evento y feedback de cambios; silencioso por defecto si el navegador bloquea autoplay; botón mute permanente. Ningún asset con licencia dudosa.

## Accesibilidad y feria
Español, unidades visibles, texto grande y claro a distancia, botones grandes, contraste, no depender del color, explicaciones simples con modo experto opcional. Ratón siempre; táctil tras validación de interfaz. Prueba con un jugador no técnico en menos de 90 segundos para comprender propósito y primera acción.

## Evitar
- Trivias, preguntas de opción múltiple como mecánica principal.
- Variables físicas convertidas en puntos sin ecuaciones.
- «Subir potencia de paneles» mágicamente a voluntad del jugador.
- Generalizaciones del tipo «toda extracción de agua causa daño permanente»: enseñar límites y compromisos con contexto.
