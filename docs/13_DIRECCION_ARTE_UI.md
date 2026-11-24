# Dirección de arte e interfaz — EcoGrid v0.1

## Principio del MVP híbrido
El tablero físico y su señalización conducen la partida; la consola local es secundaria, sobria y explicativa. Cada indicador vincula entrada física, consecuencia científica y decisión sin depender solo del color.

## Prioridad de diseño
1. Zonas legibles para PV, río/hidro, batería/bus y cargas.
2. Controles rotulados con acción, rango y estado; LEDs acompañados por texto/icono.
3. Fichas y cartas distinguibles a 1–2 m, con seis rondas visibles.
4. Consola con ronda, lecturas válidas/erróneas, suministro, reserva y explicación breve.

Mapa isométrico, campaña, móvil, audio, animación y arte elaborado están fuera del MVP. No consumir tiempo de tablero, carcasa, seguridad o pruebas para producirlos.

## Tokens visuales propuestos (no inmutables)
| Significado | Hex | Uso y advertencia |
|---|---|---|
| Fondo noche | #101C2D | HUD y juego con contraste suficiente |
| Superficies | #1B3046 | contenedores, separadores |
| Cian energético | #21C6DE | flujo eléctrico positivo, énfasis |
| Verde ambiental | #51D298 | río respetado y progresión |
| Amarillo advertencia | #FFC35B | suministro bajo, temp elevada |
| Rojo error | #F06577 | caída crítica o acción rechazada |
| Texto principal | #F3F7FC | texto legible en fondo oscuro |
| Texto secundario | #B9C8D8 | evitar texto pequeño con contraste insuficiente |

No codificar semántica solo por color: usar icono, texto y patrón. Validar contraste con comprobación real (objetivo AA WCAG: 4.5:1 texto normal y 3:1 gráficos relevantes cuando proceda).

## Jerarquía de consola secundaria
```
┌───────────────────────────────────────────────────────────────────────┐
│  EC O G R I D   | RONDA 2/6 | CONEXIÓN/ENTRADAS | DEMANDA / POTENCIA │
├───────────────────────┬───────────────────────────────────────────────┤
│ LUZ (PROXY) / TEMP.   │ PV | HIDRO | BATERÍA | CARGAS                 │
│ rangos y validez      │ valores con unidades y límites                │
│ alerta + causa        │ consecuencia de la decisión confirmada        │
├───────────────────────┴───────────────────────────────────────────────┤
│ CONSIGNA LEÍDA | MODO BATERÍA | RESULTADO / EXPLICACIÓN               │
└───────────────────────────────────────────────────────────────────────┘
```

La consola no duplica controles físicos ni reemplaza fichas/tablero. Opera offline y muestra desconexión, dato inválido y timeout sin conservar silenciosamente el último valor.

## Reglas de HUD
- Unidades siempre: `kW` potencia instantánea, `kWh` energía acumulada, `m³/s` caudal, `°C` temperatura, `%` SOC.
- La demanda y el suministro deben distinguir potencia instantánea de energía acumulada.
- Mostrar **potencia producida** (renovables), **potencia entregada** a ciudad y **potencia no atendida** por separado; evitar sumar batería dos veces.
- Batería: barra SOC, potencia de carga/descarga con signo o texto, límite de potencia visible.
- Caudal: bypass vs turbina en dos canales del río; avisar explícitamente si compuerta se limita por Qeco.
- Solar: hasta la calibración metrológica final, rotularlo **proxy de luz provisional para gameplay**; no llamarlo irradiancia. Mostrar cómo la temperatura afecta el rendimiento dentro del modelo candidato.
- Pronóstico: indicar si es incertidumbre o información perfecta según escenario; no cambiar cifras que el motor ya determinó sin actualizar origen.

## Estados visuales (obligatorios)
- **Normal:** cifras legibles, ritmo tranquilo, edificios iluminados.
- **Atención:** borde ámbar, ícono/etiqueta y evento explicativo (ej. «viento insuficiente»).
- **Crítico:** etiqueta roja + causa + recomendación no prescriptiva; indicar carga crítica no atendida.
- **Recuperación:** texto positivo y transición suave, no explosionar partículas.
- **Pausa:** overlay «SIMULACIÓN EN PAUSA»; sin avance físico ni temporizador simulado.

## Feedback mínimo
- Confirmación física: LED más etiqueta/leyenda; normal, atención y error distinguibles sin color.
- Hidro: tablero diferencia caudal ecológico, derivado y bypass mediante canales/fichas.
- PV y batería: flechas/fichas muestran generación y carga/descarga sin flujo imposible.
- Consola: explicación breve y foco visible; evitar animaciones no esenciales.

## Accesibilidad y feria
- Controles físicos operables y rotulados; consola con teclado/foco si incluye acciones, texto base ≥16 px cuando sea posible.
- Phaser Canvas puede ser poco accesible: exponer controles y texto esencial mediante elementos HTML semánticos encima/fuera del canvas.
- Estado visible al enfocar controles y acciones con teclado. No animaciones parpadeantes. Opción reducir movimiento.
- En feria probar tablero y consola a la distancia real de uso y en el computador objetivo. No se anuncia soporte móvil.

## Checklist antes de afirmar UI «final»
Zonas y seis rondas reconocibles, controles/LEDs rotulados, unidades, proxy de luz bien nombrado, errores visibles, contraste, legibilidad a distancia, misma semilla, carcasa segura y evidencia real.
