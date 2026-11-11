# ECO-101 product browser smoke

The harness reproducibly observes the root product shell, one Phaser canvas, and
two identical explicitly simulated six-round runs separated by ECO105-2 reset.
It does not add a browser dependency. ECO-101 remains in progress.

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
- Interaction: the first six loads and confirmations reached `completed`; reset
  then restored waiting round 1/6 with `DEVICE_DISCONNECTED`, zero accepted `dd`
  fields, zero trace rows, load enabled, confirm/reset disabled and focus on load.
- Replay: the second six-round run reproduced every visible status snapshot, the
  exact nine accepted fields and all six ordered trace rows/sequences. The same
  sole canvas node remained mounted; terminal load/confirm were disabled and
  reset was enabled.
- Desktop layout: the explanatory control copy retained at least 240 CSS pixels,
  the three actions did not overlap, and panel/trace geometry stayed horizontally
  contained.
- Mobile check: at 390 × 844 CSS pixels the document had no horizontal overflow,
  all three controls, canvas, observation panel and six trace rows had non-zero
  geometry contained within the viewport width.
- Canvas: backing size 960 × 540; displayed size 764 × 432, both non-zero.
- Screenshot after the second run: 800 × 450 PNG, 52,320 bytes, SHA-256
  `095877edf7ec5b75dc279a68d67ce4adbbe78a843cc1e5d0ea4520da0b1570fb`.
- Error signal: zero `Runtime.exceptionThrown`, console `error`, or JavaScript `Log.entryAdded` events observed through CDP.
- Negative regression: an impostor returned HTTP 200 with the exact title/canvas markers; strict-port Vite exited non-zero before Chrome/PASS, then the test rebound port 4173.

## Limits and rollback

The bounded error signal excludes network/resource failures that are not
JavaScript runtime or console errors. This is a local simulated technical replay,
not hardware reconnection, serial recovery/resynchronization, gameplay replay,
scientific reproducibility, accessibility approval, other-browser coverage,
prolonged performance, physics, calibration or physical integration.

Rollback removes this directory, the `test:browser-smoke` package script, and BOOTSTRAP-002 documentation entries without reverting BOOTSTRAP-001 commit `9956eb5` or the historical disposable spike.
