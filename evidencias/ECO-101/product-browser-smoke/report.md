# ECO-101 product browser smoke

The harness reproducibly observes local malformed-input rejection and recovery,
one Phaser canvas, and two identical simulated six-round runs separated by reset.
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
- Diagnostic: native details opened; the fixed local malformed message produced
  `MALFORMED_JSON`, zero accepted rows, unchanged empty trace, enabled load,
  disabled confirm/reset, and live text `Rondas confirmadas: 0`. A subsequent
  valid load reached ready before the separate confirmation. After round 1, the
  same rejection preserved one trace row and announced `Rondas confirmadas: 1`.
- Interaction: the first six loads and confirmations reached `completed`; reset
  then restored waiting round 1/6 with `DEVICE_DISCONNECTED`, zero accepted `dd`
  fields, zero trace rows, load enabled, confirm/reset disabled and focus on load.
- Replay: the second six-round run reproduced every visible status snapshot, the
  exact nine accepted fields and all six ordered trace rows/sequences. The same
  sole canvas node remained mounted; terminal load/confirm were disabled and
  reset was enabled.
- Desktop layout: explanatory copy retained at least 240 CSS pixels; diagnostic
  summary/button and the three primary actions had non-zero, contained,
  non-overlapping geometry; panel/trace geometry stayed contained.
- Mobile check: at 390 × 844 CSS pixels the document had no horizontal overflow,
  all three primary controls, diagnostic summary/button, canvas, observation panel
  and six trace rows had non-zero contained geometry without overlap.
- Canvas: backing size 960 × 540; displayed size 764 × 432, both non-zero.
- Screenshot after the second run: 800 × 450 PNG, 62,611 bytes, SHA-256
  `eb46f30ced36d3ce71322df06cbc88f6bc23c259089f0cab31d35b15175ef7c8`.
- Error signal: zero `Runtime.exceptionThrown`, console `error`, or JavaScript `Log.entryAdded` events observed through CDP.
- Negative regression: an impostor returned HTTP 200 with the exact title/canvas markers; strict-port Vite exited non-zero before Chrome/PASS, then the test rebound port 4173.

## Limits and rollback

The bounded error signal excludes network/resource failures that are not
JavaScript runtime or console errors. This is local malformed simulated-message
rejection/recovery and technical replay, not sensors, connection, hardware,
serial recovery/resynchronization, gameplay replay,
scientific reproducibility, accessibility approval, other-browser coverage,
prolonged performance, physics, calibration or physical integration.

Rollback removes this directory, the `test:browser-smoke` package script, and BOOTSTRAP-002 documentation entries without reverting BOOTSTRAP-001 commit `9956eb5` or the historical disposable spike.
