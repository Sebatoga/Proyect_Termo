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

The isolated [`round-host-integration`](../round-host-integration/README.md)
harness verifies composition with the existing adapter without creating a
product dependency.

## Behavior

- Exactly six unique ordered rounds are required.
- Only closed `synthetic` events with `{ key }` data are accepted.
- Invalid, disconnected, missing, null, or unconfirmed input stays on the same round.
- A consumed sequence or token returns `INPUT_REPLAYED` without calling the resolver.
- A sequence below the last committed sequence returns
  `INPUT_SEQUENCE_NOT_INCREASING`. Reconnect/session epochs are outside this
  reference and require a new lifecycle instance; this module invents no epoch
  protocol.
- Descriptor-based capture rejects accessors, hidden/symbol/array-extra fields,
  sparse arrays, cycles, unsupported prototypes/values and non-finite numbers
  without invoking getters. Traversal is limited to depth 32, 2,048 nodes and
  4,096 entries; aggregate key limits are checked before individual descriptors.
- Construction requires exactly four own enumerable data options: `manifest`,
  `seed`, `resolverVersion`, and `resolve`. Accessors, hidden/symbol/extra fields,
  unsupported prototypes and hostile proxies fail with stable lifecycle codes.
- Recursive confirmation during snapshot capture, validation, resolution or
  result capture returns `RESOLUTION_IN_PROGRESS`. A `finally` cleanup clears the
  transaction guard after every success, rejection or failure so retry remains safe.
- Resolver inputs and all returned snapshots/history are deeply frozen copies.
- After round six, attempts return `LIFECYCLE_COMPLETED` without side effects.

## Verify

```bash
node --test tools/round-lifecycle/*.test.mjs
```

## Limits and rollback

This is not gameplay, product integration, hardware behavior, a scientific model, a score, a balance result, a solvability proof, or duration evidence. It imports no product or project tool. Remove `tools/round-lifecycle/` to roll it back; no runtime path depends on it.
