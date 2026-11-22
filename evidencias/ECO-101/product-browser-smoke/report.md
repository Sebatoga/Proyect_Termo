# ECO-101 product browser smoke

The harness reproducibly observes local malformed-input rejection and recovery,
the six ordered provisional round guides, redundant session notices, one Phaser
canvas, and two identical simulated six-round runs separated by reset. It does
not add a browser dependency. ECO-101 remains in progress.

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
- Notices: disconnected, malformed-input and new-input-required states displayed
  visible labels, titles and action text. Ready and completed states hid and
  cleared the notice rather than leaving stale instructions.
- Interaction: the first six loads and confirmations reached `completed`; reset
  then restored waiting round 1/6 with `DEVICE_DISCONNECTED`, zero accepted `dd`
  fields, zero trace rows, load enabled, confirm/reset disabled and focus on load.
- Replay: the second six-round run reproduced every visible status snapshot, the
  exact nine accepted fields and all six ordered trace rows/sequences. The same
  sole canvas node remained mounted; terminal load/confirm were disabled and
  reset was enabled.
- Keyboard focus: loading moved focus to confirmation; intermediate confirmation
  moved it back to load; malformed-input diagnostics focused load; final
  confirmation focused reset. Reset returned focus to load.
- Action semantics: the three primary controls remained native non-submit
  buttons inside a fieldset with a visible legend and linked help text.
- Round guides: each ready state displayed the exact ordered title, question and
  event key in the dedicated visible panel. The second run reproduced all six
  guide snapshots.
- Desktop layout: explanatory copy retained at least 240 CSS pixels; diagnostic
  summary/button and the three primary actions had non-zero, contained,
  non-overlapping geometry; panel/trace geometry stayed contained.
- Reflow checks: at both 390 × 844 and 320 × 844 CSS pixels the document had no
  horizontal overflow. Status, action fieldset/help, all three primary controls,
  diagnostic summary/button, canvas, observation panel and six trace rows had
  non-zero horizontally contained geometry; interactive controls did not overlap.
- Device transport observation: the browser pasted a valid `hello`/`inputs`
  fixture, observed six values, rejected malformed JSON and cleared all six,
  reset the adapter, then processed explicit disconnect and verified all values
  remained empty. Game status, accepted simulated values, and round trace were
  unchanged. The panel, input and action buttons remained horizontally contained
  at 390 px and 320 px. This is manual fixture input, not serial or hardware I/O.
- After reset the pasted buffer was empty, focus returned to the device textarea,
  and Chrome observed `:focus-visible` with a nonzero outline. The smoke captures
  the game-loop terminal focus before running this independent transport flow.
- A valid `hello` without `inputs` is reported as “Saludo aceptado; entradas
  pendientes”, with six empty values and no visible issue; it is not mislabeled
  as a rejected frame or physical connection.
- After a valid sequence 1 snapshot, a malformed line clears all six values;
  the next valid sequence 2 snapshot recovers without adapter reset. Sequence
  gaps remain fail-closed. No game state, accepted simulated input, or trace
  changes during this transport test.
- Canvas: backing size 960 × 540; displayed size 764 × 432, both non-zero.
- Screenshot after the second run: 800 × 450 PNG, 63,378 bytes, SHA-256
  `f273c39d9d2b92d1f63bd8879d449510334bd367ac479cf22dd83d902d587a68`.
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
