# Protocolo de validación científica, electrónica y jugabilidad híbrida

## Escalera de evidencia
1. **Referencia independiente:** cálculo manual/hoja de cálculo o fuente fiable, con unidades y supuestos.
2. **Banco:** sensores y controles con calibración, ruido, rangos, extremos y desconexión.
3. **Firmware/protocolo:** tramas USB serial correctas, corruptas, incompletas y con timeout.
4. **Unitarias/integración:** PV térmico, hidro, batería/bus, seis rondas y conservación.
5. **HIL/E2E:** luz y temperatura reales, controles físicos, LEDs, tablero y consola durante una partida completa.
6. **Personas/feria:** 3–5 visitantes, seguridad, operación offline, contingencia y registro de defectos.

## Matriz de pruebas propuestas
| Caso | Entradas | Esperado | Etapa |
|---|---|---|---|
| T-SOL-01 | G1000,A100,η.20,T25,β.004 | P20kW | F0/F1 |
| T-SOL-02 | mismas pero T35 | P19.2kW | F0/F1 |
| T-SOL-03 | proxy de luz mínimo/temperatura extrema válida | salida acotada; no se etiqueta como irradiancia | F1 |
| T-HYD-01 | Qriver4,Qeco1,Qreq2,Hgross20,K.1,η.8 | Qturb2,Qbypass2,Hnet19.6,P307.6416kW | F0/F1 |
| T-HYD-02 | Qriver0.5,Qeco1,Qreq2 | Qturb0,Qbypass0.5, sin penalización humana | F1 |
| T-BAT-01 | P_in120,ηch.95,dt60s | delta E +1.9kWh | F0/F1 |
| T-BAT-02 | P_out120,ηdis.90,dt60s | delta E -2.22222...kWh | F0/F1 |
| T-BAT-03 | SOC0/SOCmax | no negativo/no sobrepasar límite | F1 |
| T-BUS-01 | varios generadores/consumos | residual potencia dentro tolerancia | F1 |
| T-DET-01 | igual seed y acciones | mismo historial/score | F1 |
| T-SEN-01 | luz/temperatura en puntos de calibración | error y rango esperado vs obtenido registrados | S1/S2 |
| T-SEN-02 | señal estable y luego ruidosa | dispersión/filtrado medidos, sin ocultar incertidumbre | S1/S2 |
| T-SEN-03 | fuera de rango y desconectado | inválido explícito; no reutiliza dato silenciosamente | S2 |
| T-CTL-01 | slider y selector en extremos | mapeo acotado, sin consigna imposible | S1/S2 |
| T-SER-01 | mensaje USB serial válido | esquema, versión, unidades y estado aceptados | S2 |
| T-SER-02 | corrupto/incompleto/timeout | rechazo seguro, error visible y recuperación definida | S2 |
| T-HIL-01 | variar luz y temperatura en hardware | cambio causal en PV, tablero/consola y registro | S4 |
| T-E2E-01 | seis rondas con controles físicos | partida reproducible completa en 8–12 minutos | S4 |
| T-SAFE-01 | inspección energizada/desenergizada | baja tensión, carcasa, cableado y alivio conformes | S4 |
| T-OFF-01 | red desconectada | consola y partida operan con recursos locales | S4 |

## Reglas de tolerancia
- Resultados algebraicos: `max(1e-9, 1e-10 * abs(valor_esperado))` en unidades de la magnitud, salvo justificación; la necesidad de un criterio relativo/absoluto por variable se revisará.
- Integración temporal por Euler: validar convergencia variando dt y comportamiento físico; no exigir coincidencia exacta con ecuación analítica a dt finito.
- Balance de bus: propuesta `abs(residual_kW)<=max(1e-6,1e-8*max(1,demanda_kW))`.
- Balance de energía acumulada: usar dt en h y pérdidas declaradas, no comparar kW con kWh.

## Pruebas de aceptación de modelo
- Capturar por cada fenómeno: ecuación, valores de entrada, salida prevista, salida del sistema, error absoluto y relativo, unidades y revisión.
- Para pruebas visuales no reemplazar captura real por ilustración generada.
- Cambios de fórmulas sin tests/regresión actualizados impiden cerrar tarea.
- Casos límite: PV sin luz útil y temperatura extrema válida; hidro con `Qriver<Qeco`, consigna cero/máxima y salto neto no positivo; batería en SOC mínimo/máximo y balance con pérdidas.
- Cada banco, HIL y E2E registra versión de firmware/calibración, montaje, entradas, **esperado/obtenido**, tolerancia, evidencia, responsable, fecha y PASS/FAIL. Una expectativa sin observación no es prueba.

## Prueba de jugabilidad
Para cada sesión: edad aproximada voluntaria si acepta, experiencia en juegos, objetivo entendido, tiempo primer input, fallos del UI, emociones/aburrimiento/confusión, comentarios textuales anónimos. No inferir evaluación de 3 usuarios de un solo ensayo.
