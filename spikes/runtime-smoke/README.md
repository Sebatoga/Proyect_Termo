# Spike de compatibilidad del runtime

Spike descartable y aislado para comprobar que TypeScript, Vite, Vitest y Phaser pueden instalarse, compilarse y ejecutarse en este entorno.

## Ruta rápida

```bash
npm install
npm run typecheck
npm run test
npm run build
npm run dev -- --host 127.0.0.1
```

Abrir la URL local informada por Vite. La página debe crear un canvas de Phaser y mostrar `Phaser + Vite + TypeScript compatibility spike`.

## Límites

- No consume ECO-002 ni `datos/casos_referencia.json`.
- No implementa física, control, almacenamiento, caudal ambiental, puntuación ni gameplay.
- No crea una línea base científica.
- No ratifica ADR-005.
- No completa ECO-101 ni reemplaza el bootstrap de producción.
- La respuesta HTTP y el build no validan por sí solos la renderización visual del canvas; hace falta una comprobación manual en un navegador compatible.

## Verificación

Los scripts separan comprobación de tipos, test determinista y build. El servidor de desarrollo solo aporta evidencia de arranque y entrega HTTP local; este spike no incluye Playwright ni otro navegador automatizado.

## Rollback

Eliminar íntegramente `spikes/runtime-smoke/`. El spike no modifica ni es importado por código de producción o modelos científicos.
