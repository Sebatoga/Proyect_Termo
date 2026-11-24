# Contrato científico verificable v0.2 — SI obligatorio

**Carácter:** contrato candidato para desarrollo, aún bloqueado por ECO-002 y no aceptado como baseline. No reemplaza cálculos de diseño real. Bibliografía, supuestos, rangos y vectores se documentan ahora; la validación científica independiente y la aceptación integrada se ejecutarán cuando el MVP esté completo y antes de la entrega académica (ADR-013). Ningún parámetro inventado se presenta como medición.

## A. Tiempo y unidades
- El MVP resuelve seis rondas; cada ronda usa un intervalo simulado declarado y pendiente de calibración, separado de sus 8–12 minutos de tiempo real.
- `dt_h = dt_sim_s/3600` para pasar potencia kW a energía kWh.
- La simulación usa ticks de paso fijo con acumulador, independiente de FPS; no acelerar la física si caen frames. En pausa, `dt_sim_s=0`.
- Aleatoriedad: generador sembrado reproducible; pronóstico determinista de escenario o incertidumbre documentada.

## B. Termodinámica — panel solar con capacidad térmica
Entradas híbridas: sensor de temperatura validado y `proxy de luz calibrado para gameplay`. El proxy no es irradiancia física. Solo una calibración trazable podría convertirlo a `G [W/m²]`; mientras tanto selecciona una condición de escenario rotulada como estimación de gameplay.
Temperatura dinámica de módulo (modelo concentrado / lumped):

`C_th [J/K] * dT_cell/dt [K/s] = alpha*A*G [W] - h*A*(T_cell-T_air) [W] - P_elec_W [W]`

`P_pv_W = A[m²] * G[W/m²] * eta_ref * max(0, (1 - beta_per_K*(T_cell_C - 25°C)))`.

- `A`: área m²; `G`: irradiancia W/m², **>=0**; `eta_ref`: eficiencia a 25 °C, fracción; `beta_per_K`: coeficiente termométrico positivo 1/K; `alpha`: absorptividad; `h`: coeficiente convectivo W/(m² K); `C_th`: capacidad térmica efectiva J/K.
- `T_next = T + dt_s*(P_abs - P_conv - P_elec)/C_th`; documentar restricciones de estabilidad de Euler explícito (por ejemplo `dt_s*h*A/C_th << 1`) y subpasos si fuera necesario. Balance modelo simplificado, sin irradiación infrarroja ni pérdidas específicas de inversor salvo parámetro declarado.
- Limitar entradas físicamente válidas y no esconder inestabilidades mediante clamp masivo. Si PV supera capacidad del inversor, aplicar limitador de salida y usar la potencia realmente retirada en balance térmico solo si se modela esa interacción explícitamente.
- De noche G=0 → P_pv=0, pero hay intercambio térmico con ambiente; temperatura puede bajar.
- Hipótesis: panel homogéneo, coeficientes constantes por escenario, sin sombreados finos ni MPPT detallado. Representar potencia neta en barra tras pérdidas definidas.
- Una entrada ausente, fuera de rango o no finita produce estado inválido/desconectado y la ronda no se resuelve con un valor silenciosamente sustituido.

**Vector de referencia eléctrico (sin dinámica térmica):** A=100 m², G=1000 W/m², eta_ref=0.20, beta=0.004/K, T=25 °C → P=20.0 kW; si T=35 °C → P=19.2 kW. Deben cumplirse con tolerancia <=1e-9 en pruebas unitarias puras (la tolerancia computacional podrá revisarse de forma explícita).

## C. Mecánica de fluidos — hidroeléctrica de pasada
- `Q_river_m3s`: caudal total antes de derivación; `Q_eco_min_m3s`: mínimo de bypass ecológico (requisito ambiental simplificado); `Q_turb_req_m3s`: consigna jugador.
- `Q_turb = clamp(Q_turb_req, 0, min(Q_turb_max, max(0, Q_river - Q_eco_min)))`.
- `Q_bypass = Q_river - Q_turb`; `Q_bypass >= min(Q_river, Q_eco_min)`; si río trae menos del mínimo requerido, detener derivación: se mantiene el caudal natural, no inventar agua ni sancionar al jugador.
- `H_net_m = max(0, H_gross_m - K_loss * Q_turb^2)`, con `K_loss` en **s²/m⁵**. El término es pérdida simplificada derivada de pérdidas hidráulicas ~ Q², no Darcy-Weisbach completo.
- `P_hydro_W = eta_turb_gen * rho_water[kg/m³] * g[m/s²] * Q_turb[m³/s] * H_net[m]`.
- Modelo estacionario hidráulico por tick, sin golpe de ariete, variación de nivel, sedimentación ni curva detallada de turbina. Describir por qué aplican esas hipótesis.
- No modelar una presa/embalse visual como si se conservara masa en un volumen no calculado. En MVP **central de pasada**, no embalse con volumen controlable.

**Vector referencia:** Qriver=4 m³/s; Qeco=1; Qsol=2; Hgross=20 m; K_loss=0.1 s²/m⁵; η=0.8; ρ=1000 kg/m³; g=9.81 → Hnet=19.6 m, P=307.6416 kW, bypass=2 m³/s.

## D. Eólica — fuera del MVP
El siguiente modelo se conserva como trabajo posterior y no integra el producto HYBRID-001:
`P_wind_aero_W = 0.5 * rho_air * A_swept * Cp * v^3`; `P_wind_elec_W = min(P_rated_W, P_wind_aero_W * eta_elec)` solo si `cut_in <= v < cut_out`; fuera, P=0.
- `rho_air` kg/m³, `A_swept` m², `v` m/s, `Cp` (0<Cp<=0.593 teórico Betz), `eta_elec` fracción; límites explícitos cut-in / cut-out. Se omite curva detallada de potencia, pitch y transitorios mecánicos. Ratificar transición a potencia nominal en pruebas.
- Viento cero y viento de desconexión deben dar cero; no crear electricidad durante calma.

**Vector referencia:** rho_air=1.225, A=100 m², Cp=.4, η=.9, v=4 m/s, potencia nominal>=2kW, cutin=3, cutout=25 → `1.4112 kW`.

## E. Electrónica y gestión de energía — bus DC/AC equivalente
- Fuentes `P_pv`, `P_wind`, `P_hydro` en kW netos tras conversiones definidas.
- Batería con SOC en kWh: capacidad usable `E_max`, `0 <= E <= E_max`; límites `P_charge_max`, `P_discharge_max`; eficiencia `eta_ch`/`eta_dis`.
- Carga: entrada eléctrica `P_ch_in_kW`, `E_next=E+P_ch_in*eta_ch*dt_h`; limitar por (Emax-E)/(eta_ch*dt_h).
- Descarga: salida a bus `P_dis_out_kW`, `E_next=E-(P_dis_out/eta_dis)*dt_h`; limitar por `E*eta_dis/dt_h`.
- Prohibir cargar y descargar simultáneamente. No crear energía al pasar entre unidades. Definir caso SOC 0% y 100%, y pérdidas positivas con eficiencias <1.
- Despacho en cada tick: ofrecer fuentes → decidir batería (modo auto/reserva/descarga) → servir cargas críticas primero → no críticas → reservar excedentes en batería si procede → curtailment. Puede haber pérdidas de distribución parametrizadas, **no contabilizadas dos veces**.
- Balance obligatorio por tick del bus, todas en kW: `P_ren + P_dis_out = P_load_served + P_ch_in + P_curtail + P_net_losses`. Si hay déficit, `P_demand = P_load_served + P_unserved` (mismo intervalo y unidades).
- Balance energético batería: las diferencias de E deben coincidir con carga/descarga + pérdidas; no permitir SOC fuera de rango.
- La ingeniería electrónica **tiene decisiones funcionales**: lógica de controlador, selección de cargas, límites de corriente/potencia, BMS simplificado, protección ante consignas inválidas, sensores virtuales explícitos con estados, no solamente decorativos.
- El selector físico de batería y la prioridad de cargas cambian el despacho de ronda. El potenciómetro/slider hidro cambia `Q_turb_req`; el botón confirmar congela una consigna válida.

## F. Frontera de medición y control
- Firmware adquiere luz, temperatura y controles; aplica calibración identificada, rango, marca temporal y estado `valid`, `invalid` o `disconnected`.
- El protocolo USB serial transporta datos, no reglas físicas. El adaptador host valida esquema/unidades antes de crear entradas del dominio TypeScript puro.
- Modelos exactos de componentes, curvas de calibración, tolerancias y presupuesto están pendientes de inventario y ensayo; no se presuponen en este contrato.

**Vectores:** con dt=60 s, entrada de carga 120kW ηch=.95 → +1.9kWh. Salida de descarga 120kW ηdis=.9 → −2.222222222...kWh. Si una batería está vacía no puede entregar potencia.

## G. Ingeniería ambiental — proteger recurso y explicar decisiones
- En MVP el impacto ambiental verificable gira en torno a **Q_bypass >= Qeco mínimo** y a calidad de servicio sostenible. La penalización ecológica no puede sustituir la prohibición física en el modelo; si se permite modo experimental de incumplimiento, que sea un escenario didáctico separado y explicitado.
- Evitar confundir «caudal ecológico mínimo» con «calidad ecológica completa»: no simula hábitat, temperatura del río, estacionalidad biológica ni calidad química.
- Mostrar aviso si `Qriver<Qeco`: no hay agua derivable, restricción natural; no sancionar al jugador por ello.
- Otros indicadores (emisiones evitadas, huella hídrica) deben permanecer fuera de la puntuación hasta definir línea base, factores verificables y alcances.

## H. Score (fuera del MVP; propuesta histórica)
- `S_crit = 100 * E_crit_servida/E_crit_requerida` (si denominador 0: establecer caso y prueba de diseño).
- `S_total = 100 * E_servida/E_demandada`.
- `S_eco`: 100 mientras se respete caudal ecológico en todas las extracciones; reducir solo si existe un modo explícito de sobreexplotación y una métrica definida. **Ojo**: si todo incumplimiento queda bloqueado, `S_eco` sería constante y no discrimina. Antes de implementar, rediseñar componente ambiental en términos de *margen de conservación* o *beneficios ambientales verificables*, sin premiar por apagar toda la ciudad. Registrar decisión en ADR.
- `S_recursos`: definir integral de energía desperdiciada/vertida normalizada por oportunidad disponible con metas razonables; no penalizar vertimiento hidro inevitable por caudal natural.
- `S_final = 0.50*Scrit + 0.20*Stotal + 0.20*Seco + 0.10*Srecursos`, todos 0–100, **solo tras resolver problemas de incentivos y denominadores**.
- Los pesos son decisión jugable **no una ley física**; cualquier evaluación de balance se reserva para el playtest final.

## I. Casos límite obligatorios
G=0; G extrema dentro del rango; panel caliente; PV comienza frío; v=0 / justo cut-in / justo cut-out / sobre cut-out; río Q=0 y Q<Qeco; compuerta totalmente cerrada; pérdida neta de carga alta; batería 0/100%; eficiencia =1 y <1; demanda 0; Δt=0 y tick repetido; datos negativos/NaN rechazados; clima extremo con apagón; pausa y reanudación; semilla repetida → resultados idénticos.

## J. Verificación independiente al cierre
Al completar el MVP y antes de la entrega, cada módulo deberá contar con:
ecuación documentada, ejemplo/cálculo independiente, pruebas automatizadas y de
límite, análisis dimensional, comparación simulador↔referencia y revisión
competente. Los checks de regresión ejecutados durante desarrollo son controles
de implementación, no aceptación científica. Ver el calendario de cierre en
`docs/09_PLAN_PRUEBAS.md` y `docs/10_ENTREGABLES_ACADEMICOS.md`.

## K. Trazabilidad científica ECO-002

**Estado actual:** propuesta educativa, no baseline aceptada. El gate vigente es
`ECO-002-GATE-20261122-03` (`blocked_with_traceability`). Los IDs siguientes
permiten rastrear el contrato sin convertir la investigación documental en
aprobación científica.

| Parte del contrato | Referencias del expediente | Evidencia y límite vigente |
|---|---|---|
| Balance térmico PV y potencia | `SCI-EQ-PV-001`–`SCI-EQ-PV-003` r1; `DIM-PV-001`–`DIM-PV-003` r1; `BND-PV-001`–`BND-PV-005` r1; `PROV-014`–`PROV-016` y `PROV-020` r1; `GAP-015` r3 | Sandia/PVWatts son referencias empíricas/modelo-versionadas, no validación del balance transitorio concentrado de EcoGrid. Módulo, montaje, coeficientes, dominio y paso siguen pendientes. |
| Disponibilidad hidro, bypass, cabeza y potencia | `SCI-EQ-HYD-001`–`SCI-EQ-HYD-004` r1; `DIM-HYD-001`–`DIM-HYD-003` r1; `BND-HYD-001`–`BND-HYD-004` r1; `PROV-018`, `PROV-019`, `PROV-021` r1; `GAP-013` r5 | USBR/JICA y Leon–Zhu apoyan relaciones acotadas, incluida dependencia penstock `Q²` bajo condiciones declaradas. No aprueban `K_loss` universal, frontera de caudal, salida W/kW ni el dominio del modelo candidato. |
| Batería y bus | `SCI-EQ-BAT-001`–`SCI-EQ-BAT-002` r1; `SCI-EQ-BUS-001`–`SCI-EQ-BUS-002` r1; `BND-BAT-001`–`BND-BAT-005` r1; `BND-BUS-001`–`BND-BUS-002` r1; `CALC-BUS-001` r1; `GAP-004`, `GAP-016` r1 | El cuaderno ofrece contabilidad documental para un escenario ficticio. Límites, eficiencias, convenciones de signo, fronteras de pérdida y reproducción siguen sin aceptación independiente. |
| Caudal ambiental | `SCI-PAR-ENV-001`–`SCI-PAR-ENV-002` r1; `BND-ENV-001` r1; `PROV-006`, `PROV-009`, `PROV-010` r1; `GAP-013` r5 | El bypass es una restricción física simplificada, separada del score ECO-004. `Qeco=1 m³/s` es ficticio; no se eligió cuenca ni autoridad aplicable. |

Los cuadernos `CALC-PV-001`, `CALC-HYD-001`, `CALC-WIND-001` y `CALC-BUS-001`
son cálculos/contrastes documentales, no tests ejecutados ni evidencia
experimental. ECO-003 puede explorarlos únicamente como candidatos provisionales
de desarrollo; no son baseline científica ni autorizan afirmaciones de validez.
La revisión, reproducción independiente y aceptación se programan para el cierre
del MVP, antes de la entrega académica.
