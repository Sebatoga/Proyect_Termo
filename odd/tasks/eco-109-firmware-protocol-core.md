# ECO-109 Firmware Protocol Core

## Objective

Create the first bounded C++ firmware boundary for JSON Lines v1 without
assigning pins or claiming Arduino, USB serial, sensor, calibration, or bench
evidence.

## Constraints

- Board reported by the user: `Nano ESP32-C6 V1.0`, marking `V1711`.
- Do not infer GPIO, flash, integrated LED, or either USB port function.
- `SW761` remains excluded until its identity and electrical behavior are known.
- Keep all six values `disconnected` until their individual bench gates pass.
- No physics, gameplay, score, calibration mapping, baud, or timeout semantics.

## ECO109-1 — Host-testable safe protocol emission

- [x] Implement dependency-free C++17 encoders for `hello` and
  `inputs/disconnected` using caller-owned fixed buffers.
- [x] Reject empty, oversized, or unsafe `calibrationVersion` values.
- [x] Fail closed when output capacity is insufficient.
- [x] Compare the emitted stream byte-for-byte with the existing disconnected
  fixture and validate it with the canonical Node parser.
- [ ] Compile for the actual ESP32-C6 Arduino target after board support and USB
  configuration are verified.
- [ ] Add GPIO/sensor/output adapters only after a reviewed pinout and bench gate.

## Verification

- Host compile: `g++ -std=c++17 -Wall -Wextra -Werror -pedantic ...`.
- C++ behavior tests: `ECO109_PROTOCOL_TESTS=PASS tests=4`.
- Fixture comparison: byte-identical to
  `tools/device-simulator/fixtures/v1-device-disconnected.jsonl`.
- Existing protocol and host adapter: 27/27 PASS.
- Runtime boundary: host compiler only; Arduino/ESP32-C6 runtime is **NOT RUN**.

## Delivery slices

- ECO108-6: reconcile only the user-reported inventory and unresolved gates.
- ECO109-1: protocol source/tests plus its executable evidence and status hunks.
- Combined worktree size exceeds the 400-line review guard, so these remain two
  independent work units; no commit, push, PR, or merge was performed.

## Rollback

Remove `firmware/esp32-c6/` and this task entry, then revert only the related
status/documentation lines. Existing Node protocol fixtures remain unchanged.
