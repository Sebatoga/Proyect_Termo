# Dirección de arte e interfaz — EcoGrid v0.1

## Principio del producto
No debe parecer un dashboard corporativo ni un trivial. Se busca una **ciudad viva** que reacciona a las decisiones del jugador. El panel de control acompaña el paisaje, no lo reemplaza. Cada indicador tiene un correlato visible en escena.

## Referencias estéticas (descripción, no activos obtenidos)
- Estrategia 2D isométrica ligera, bordes limpios, escenarios coloridos, microanimaciones de plantas y edificios.
- Dirección *eco-futurista urbana*: arquitectura compacta, árboles, red visible, central de pasada con río continuo, cielo y clima dinámicos.
- Evitar contaminación «malvada» y tonos sombríos permanentes: la crisis surge de restricciones ingenieriles realistas, no de estereotipos.

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

## Jerarquía de pantalla (escritorio 1366×768 como caso de prueba)
```
┌───────────────────────────────────────────────────────────────────────┐
│  EC O G R I D   |  TIEMPO SIM |  ESTADO CIUDAD |  DEMANDA / POTENCIA │
├───────────────────────┬───────────────────────────────────────────────┤
│ CLIMA / PRONÓSTICO    │                                               │
│ Sol | viento | río    │  MAPA VIVO: ciudad, plantas, cauce, batería    │
│ Temperatura celda     │  animación de actividad, cables y alertas      │
│ Alertas explicables   │                                               │
├───────────────────────┴───────────────────────────────────────────────┤
│ TURBINA Q      | MODO BATERÍA | CARGAS NO CRÍTICAS | PAUSA  AYUDA    │
└───────────────────────────────────────────────────────────────────────┘
```

**Prioridad:** primera fila clara, mapa dominante (al menos 50% área útil), acciones a un clic. No tapar las plantas con paneles. Ajustar a tamaño real, no solo mockup.

## Reglas de HUD
- Unidades siempre: `kW` potencia instantánea, `kWh` energía acumulada, `m³/s` caudal, `°C` temperatura, `%` SOC.
- La demanda y el suministro deben distinguir potencia instantánea de energía acumulada.
- Mostrar **potencia producida** (renovables), **potencia entregada** a ciudad y **potencia no atendida** por separado; evitar sumar batería dos veces.
- Batería: barra SOC, potencia de carga/descarga con signo o texto, límite de potencia visible.
- Caudal: bypass vs turbina en dos canales del río; avisar explícitamente si compuerta se limita por Qeco.
- Solar: al hacer hover/tap explicación «temperatura elevada reduce rendimiento del panel» con valor °C y kW; no fingir calor ambiental como irradiancia.
- Pronóstico: indicar si es incertidumbre o información perfecta según escenario; no cambiar cifras que el motor ya determinó sin actualizar origen.

## Estados visuales (obligatorios)
- **Normal:** cifras legibles, ritmo tranquilo, edificios iluminados.
- **Atención:** borde ámbar, ícono/etiqueta y evento explicativo (ej. «viento insuficiente»).
- **Crítico:** etiqueta roja + causa + recomendación no prescriptiva; indicar carga crítica no atendida.
- **Recuperación:** texto positivo y transición suave, no explosionar partículas.
- **Pausa:** overlay «SIMULACIÓN EN PAUSA»; sin avance físico ni temporizador simulado.

## Animación, sonido y feedback
- Generación eólica: rotación representativa proporcional a viento dentro del margen de operación; detener con viento por debajo cut-in o por seguridad cut-out. Evitar prometer RPM física si no modelada.
- Hidro: río fluye siempre que Qriver>0; intensidad representativa. Animación de turbina en función de caudal derivado.
- PV: variación visual sol/nubes; temperatura no se comunica solo con resplandor rojo.
- Batería: transferencia de energía dirigida cargando vs descargando (no dibujar flujo en ambas direcciones).
- Eventos: un sonido discreto por cambio, con cooldown; opción silencio y reducir movimiento.

## Accesibilidad y feria
- Ratón/trackpad primero, teclado en controles críticos; objetivos táctiles sugeridos ≥44 CSS px, texto base ≥16 px cuando sea posible.
- Phaser Canvas puede ser poco accesible: exponer controles y texto esencial mediante elementos HTML semánticos encima/fuera del canvas.
- Estado visible al enfocar controles y acciones con teclado. No animaciones parpadeantes. Opción reducir movimiento.
- En feria probar a resolución 1366×768, 1920×1080 y móvil si se anuncia soporte. Objetivo de legibilidad a 1–2 m con monitor del stand.

## Checklist antes de afirmar UI «final»
Mapa reconocible, interacción feedback <1 tick, idioma natural, cifras con unidades, fuentes legibles, no solapamientos, controles no tapan alertas, transición a resultados, reiniciar misma semilla, sonido mute, contraste, FPS probado y capturas reales.
