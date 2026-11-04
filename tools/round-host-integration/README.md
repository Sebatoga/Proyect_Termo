# Host-to-round integration harness

This dependency-free Node ESM harness composes the existing fail-closed host
adapter with the deterministic six-round lifecycle. It is isolated integration
evidence, not a product path.

## API and behavior

`createRoundHostIntegration(lifecycleOptions)` passes the options directly to
the existing lifecycle constructor and exposes four operations:

- `ingest(line)` sends one device-to-host JSON Line only through the host
  adapter. It never calls the resolver or advances a round.
- `confirm(token)` forwards only the adapter's current normalized snapshot to
  the lifecycle. The snapshot must contain `confirm: true`, and the token must
  be valid and unused.
- `disconnect()` clears adapter values and makes the integration session
  `reset-required`.
- `snapshot()` returns an immutable integration view containing the adapter and
  lifecycle snapshots.

`ingest`, `confirm`, and `disconnect` share one synchronous transaction guard.
Reentrant mutation returns `INTEGRATION_BUSY` without changing adapter,
lifecycle, or reset state. `ingest` rejects non-string input as
`INPUT_LINE_INVALID` before adapter parsing. Once reset is required, all three
mutations return `SESSION_RESET_REQUIRED` without touching the cleared adapter;
only a new harness instance starts another session epoch. The guard is cleared
in `finally` after every success or rejection so ordinary retry remains safe.

Malformed, unsupported, invalid-direction, invalid-sequence, disconnected,
null-control, stale, unconfirmed, or replayed input remains fail-closed. After a
disconnect, create a new harness instance before accepting a reset sequence;
the prior lifecycle is never silently reused across connection epochs.

## Verify

```bash
node --test tools/round-host-integration/*.test.mjs
```

## Limits and rollback

This harness contains no serial I/O, retry policy, timing behavior, UI, product
stack, physical model, scoring, event balance, gameplay, or hardware claim.
Remove `tools/round-host-integration/` and its documentation links to roll it
back; existing adapter and lifecycle modules remain independent.
