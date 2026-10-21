# Protocolo de validación científica, software y jugabilidad

## Escalera de evidencia
1. **Referencia independiente:** cálculo manual/hoja de cálculo o fuente fiable, con unidades y supuestos.
2. **Unitarias:** solar, hidro, viento, batería, controlador, normalizaciones.
3. **Integración:** balances por tick, conservación, caos climático y orden de prioridades.
4. **E2E en navegador:** menús, sliders, inicio/pausa/reinicio, una misión y resultado.
5. **Pruebas humanas:** 3–5 visitantes de distintos niveles, observación sin guiar, tiempo al primer control, errores de comprensión.
6. **Feria:** demo offline y monitor; backup del build, plan de contingencia, registro de errores.

## Matriz de pruebas propuestas
| Caso | Entradas | Esperado | Etapa |
|---|---|---|---|
| T-SOL-01 | G1000,A100,η.20,T25,β.004 | P20kW | F0/F1 |
| T-SOL-02 | mismas pero T35 | P19.2kW | F0/F1 |
| T-SOL-03 | G0 | P0, termodinámica sigue | F1 |
| T-HYD-01 | Qriver4,Qeco1,Qreq2,Hgross20,K.1,η.8 | Qturb2,Qbypass2,Hnet19.6,P307.6416kW | F0/F1 |
| T-HYD-02 | Qriver0.5,Qeco1,Qreq2 | Qturb0,Qbypass0.5, sin penalización humana | F1 |
| T-WIND-01 | v4,ρ1.225,A100,Cp.4,η.9 | P1.4112kW | F1 |
| T-WIND-02 | v0 y v>=cutout | P0 | F1 |
| T-BAT-01 | P_in120,ηch.95,dt60s | delta E +1.9kWh | F0/F1 |
| T-BAT-02 | P_out120,ηdis.90,dt60s | delta E -2.22222...kWh | F0/F1 |
| T-BAT-03 | SOC0/SOCmax | no negativo/no sobrepasar límite | F1 |
| T-BUS-01 | varios generadores/consumos | residual potencia dentro tolerancia | F1 |
| T-DET-01 | igual seed y acciones | mismo historial/score | F1 |
| T-DET-02 | pausa | sin energía ni tiempo transcurridos | F1 |
| T-UX-01 | jugador nuevo | entiende objetivo y primera interacción | F2 |
| T-E2E-01 | misión normal extremo | pantalla resultados sin errores | F1/F2 |
| T-OFF-01 | desconexión red, build local | juego funciona con activos locales | F3 |

## Reglas de tolerancia
- Resultados algebraicos: `max(1e-9, 1e-10 * abs(valor_esperado))` en unidades de la magnitud, salvo justificación; la necesidad de un criterio relativo/absoluto por variable se revisará.
- Integración temporal por Euler: validar convergencia variando dt y comportamiento físico; no exigir coincidencia exacta con ecuación analítica a dt finito.
- Balance de bus: propuesta `abs(residual_kW)<=max(1e-6,1e-8*max(1,demanda_kW))`.
- Balance de energía acumulada: usar dt en h y pérdidas declaradas, no comparar kW con kWh.

## Pruebas de aceptación de modelo
- Capturar por cada fenómeno: ecuación, valores de entrada, salida prevista, salida del sistema, error absoluto y relativo, unidades y revisión.
- Para pruebas visuales no reemplazar captura real por ilustración generada.
- Cambios de fórmulas sin tests/regresión actualizados impiden cerrar tarea.

## Prueba de jugabilidad
Para cada sesión: edad aproximada voluntaria si acepta, experiencia en juegos, objetivo entendido, tiempo primer input, fallos del UI, emociones/aburrimiento/confusión, comentarios textuales anónimos. No inferir evaluación de 3 usuarios de un solo ensayo.
