# ECO-101 product browser smoke

The harness reproducibly observes the root product shell, Phaser canvas, and the explicitly simulated BOOTSTRAP-009 interaction in installed Chrome without adding a browser dependency. ECO-101 remains in progress.

## Reproduce

```bash
npm run test:browser-smoke
node --test evidencias/ECO-101/product-browser-smoke/port-impostor.test.mjs
```

The harness starts root Vite on `127.0.0.1:4173` with `--strictPort`, waits for Vite ownership and the exact `<title>EcoGrid | Consola local</title>` marker, then uses Chrome DevTools Protocol to observe the DOM and capture the screenshot. Every path terminates its child process groups; the occupied-port regression additionally proves the port can be rebound.

## Observed result

- Browser: `Google Chrome 156.0.8078.47`.
- Result: `PASS`.
- Product checks: title marker, `EcoGrid: Ciudad al Límite`, `Consola local secundaria`, visible simulated-mode label, initial waiting state, confirmation unavailable, and a canvas under `#game-container` all present.
- Interaction: loading a simulated input exposed `ready` and confirmation available; confirming advanced to round 2, required a new input, enabled load, and disabled confirm.
- Mobile check: at 390 × 844 CSS pixels the document had no horizontal overflow, both controls remained visible, and the canvas retained non-zero dimensions.
- Canvas: backing size 960 × 540; displayed size 764 × 432, both non-zero.
- Screenshot after interaction: 800 × 450 PNG, 30,759 bytes, SHA-256 `0313813a447197e25801576d8c551687ed1b21ecf74e116bfd2361aefa852570`.
- Error signal: zero `Runtime.exceptionThrown`, console `error`, or JavaScript `Log.entryAdded` events observed through CDP.
- Negative regression: an impostor returned HTTP 200 with the exact title/canvas markers; strict-port Vite exited non-zero before Chrome/PASS, then the test rebound port 4173.

## Limits and rollback

The bounded error signal excludes network/resource failures that are not JavaScript runtime or console errors. This verifies one deterministic simulated interaction, not assistive-technology accessibility, other browsers/devices, prolonged performance, gameplay effects, physics, serial, calibration, or hardware.

Rollback removes this directory, the `test:browser-smoke` package script, and BOOTSTRAP-002 documentation entries without reverting BOOTSTRAP-001 commit `9956eb5` or the historical disposable spike.
