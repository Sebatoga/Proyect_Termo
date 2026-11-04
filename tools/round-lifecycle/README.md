# Six-round lifecycle reference

This isolated Node ESM reference coordinates a provisional six-round sequence. It validates normalized snapshots, requires explicit confirmation, calls an injected synthetic resolver once, appends immutable history, and advances.

## Quick path

```js
import { createRoundLifecycle } from "./round-lifecycle.mjs";

const lifecycle = createRoundLifecycle({
  manifest,
  seed: "caller-owned-seed",
  resolverVersion: "synthetic-v1",
  resolve: ({ round, input }) => ({ round: round.id, sequence: input.sequence }),
});

const response = lifecycle.confirm(normalizedHostSnapshot, "input-token-1");
```

The manifest fixture shows the closed v1 shape. A valid snapshot matches the host-adapter snapshot boundary but this module does not import the adapter. The caller supplies both trace values and a stable token.

## Behavior

- Exactly six unique ordered rounds are required.
- Only closed `synthetic` events with `{ key }` data are accepted.
- Invalid, disconnected, missing, null, or unconfirmed input stays on the same round.
- A consumed sequence or token returns `INPUT_REPLAYED` without calling the resolver.
- Resolver inputs and all returned snapshots/history are deeply frozen copies.
- After round six, attempts return `LIFECYCLE_COMPLETED` without side effects.

## Verify

```bash
node --test tools/round-lifecycle/*.test.mjs
```

## Limits and rollback

This is not gameplay, product integration, hardware behavior, a scientific model, a score, a balance result, a solvability proof, or duration evidence. It imports no product or project tool. Remove `tools/round-lifecycle/` to roll it back; no runtime path depends on it.
