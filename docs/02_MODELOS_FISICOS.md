# Contrato científico verificable v0.1 — SI obligatorio

**Carácter:** modelo simplificado propuesto, aún no calibrado experimentalmente. No reemplaza cálculos de diseño real. Para cada ecuación se mantendrán: bibliografía técnica, derivación o referencia, supuestos, rangos, test vector y análisis de sensibilidad. Ningún parámetro inventado se presenta como medición.

## A. Tiempo y unidades
- Paso de integración: `dt_sim_s = 60 s` por 1 s de reloj de juego (propuesta); simulación en segundos, temperatura °C para diferencias; energía almacenada kWh; potencia mostrada kW.
- `dt_h = dt_sim_s/3600` para pasar potencia kW a energía kWh.
- La simulación usa ticks de paso fijo con acumulador, independiente de FPS; no acelerar la física si caen frames. En pausa, `dt_sim_s=0`.
- Aleatoriedad: generador sembrado reproducible; pronóstico determinista de escenario o incertidumbre documentada.

## B. Termodinámica — panel solar con capacidad térmica
Temperatura dinámica de módulo (modelo concentrado / lumped):

`C_th [J/K] * dT_cell/dt [K/s] = alpha*A*G [W] - h*A*(T_cell-T_air) [W] - P_elec_W [W]`

`P_pv_W = A[m²] * G[W/m²] * eta_ref * max(0, (1 - beta_per_K*(T_cell_C - 25°C)))`.

- `A`: área m²; `G`: irradiancia W/m², **>=0**; `eta_ref`: eficiencia a 25 °C, fracción; `beta_per_K`: coeficiente termométrico positivo 1/K; `alpha`: absorptividad; `h`: coeficiente convectivo W/(m² K); `C_th`: capacidad térmica efectiva J/K.
- `T_next = T + dt_s*(P_abs - P_conv - P_elec)/C_th`; documentar restricciones de estabilidad de Euler explícito (por ejemplo `dt_s*h*A/C_th << 1`) y subpasos si fuera necesario. Balance modelo simplificado, sin irradiación infrarroja ni pérdidas específicas de inversor salvo parámetro declarado.
- Limitar entradas físicamente válidas y no esconder inestabilidades mediante clamp masivo. Si PV supera capacidad del inversor, aplicar limitador de salida y usar la potencia realmente retirada en balance térmico solo si se modela esa interacción explícitamente.
- De noche G=0 → P_pv=0, pero hay intercambio térmico con ambiente; temperatura puede bajar.
- Hipótesis: panel homogéneo, coeficientes constantes por escenario, sin sombreados finos ni MPPT detallado. Representar potencia neta en barra tras pérdidas definidas.

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

## D. Eólica — flujo y extracción mecánica
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

**Vectores:** con dt=60 s, entrada de carga 120kW ηch=.95 → +1.9kWh. Salida de descarga 120kW ηdis=.9 → −2.222222222...kWh. Si una batería está vacía no puede entregar potencia.

## F. Ingeniería ambiental — proteger recurso y explicar decisiones
- En MVP el impacto ambiental verificable gira en torno a **Q_bypass >= Qeco mínimo** y a calidad de servicio sostenible. La penalización ecológica no puede sustituir la prohibición física en el modelo; si se permite modo experimental de incumplimiento, que sea un escenario didáctico separado y explicitado.
- Evitar confundir «caudal ecológico mínimo» con «calidad ecológica completa»: no simula hábitat, temperatura del río, estacionalidad biológica ni calidad química.
- Mostrar aviso si `Qriver<Qeco`: no hay agua derivable, restricción natural; no sancionar al jugador por ello.
- Otros indicadores (emisiones evitadas, huella hídrica) deben permanecer fuera de la puntuación hasta definir línea base, factores verificables y alcances.

## G. Score (propuesta, debe quedar definido antes de programar)
- `S_crit = 100 * E_crit_servida/E_crit_requerida` (si denominador 0: establecer caso y prueba de diseño).
- `S_total = 100 * E_servida/E_demandada`.
- `S_eco`: 100 mientras se respete caudal ecológico en todas las extracciones; reducir solo si existe un modo explícito de sobreexplotación y una métrica definida. **Ojo**: si todo incumplimiento queda bloqueado, `S_eco` sería constante y no discrimina. Antes de implementar, rediseñar componente ambiental en términos de *margen de conservación* o *beneficios ambientales verificables*, sin premiar por apagar toda la ciudad. Registrar decisión en ADR.
- `S_recursos`: definir integral de energía desperdiciada/vertida normalizada por oportunidad disponible con metas razonables; no penalizar vertimiento hidro inevitable por caudal natural.
- `S_final = 0.50*Scrit + 0.20*Stotal + 0.20*Seco + 0.10*Srecursos`, todos 0–100, **solo tras resolver problemas de incentivos y denominadores**.
- Los pesos son decisión jugable **no una ley física**, sujetos a validación con usuarios.

## H. Casos límite obligatorios
G=0; G extrema dentro del rango; panel caliente; PV comienza frío; v=0 / justo cut-in / justo cut-out / sobre cut-out; río Q=0 y Q<Qeco; compuerta totalmente cerrada; pérdida neta de carga alta; batería 0/100%; eficiencia =1 y <1; demanda 0; Δt=0 y tick repetido; datos negativos/NaN rechazados; clima extremo con apagón; pausa y reanudación; semilla repetida → resultados idénticos.

## I. Verificación independiente
Cada módulo tendrá al menos: ecuación documentada, ejemplo manual/calc. independiente, test automatizado, prueba de límite, análisis dimensional, comparación simulador↔referencia, revisión del especialista, gráfico para el póster. Ver `docs/09_PLAN_PRUEBAS.md` y `datos/casos_referencia.json`.
