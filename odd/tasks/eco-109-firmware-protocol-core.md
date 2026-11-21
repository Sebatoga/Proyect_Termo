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

## ECO109-2 — Reproducible host verification command

- [x] Add `npm run test:firmware` to compile the C++17 core in a fresh temporary
  directory, run the four initial behavior checks, compare the emitted stream byte-for-byte
  against the disconnected fixture, and parse both JSON Lines with the canonical
  Node protocol parser.
- [x] Remove only the temporary directory created for that invocation, including
  on test failure.
- [ ] Compile for the actual ESP32-C6 Arduino target only after board support,
  USB configuration, and G1 electrical review are verified.

## Verification

- Host compile: `g++ -std=c++17 -Wall -Wextra -Werror -pedantic ...`.
- Initial ECO109-2 C++ behavior tests: `ECO109_PROTOCOL_TESTS=PASS tests=4`;
  ECO109-3 extends this to five checks.
- Fixture comparison: byte-identical to
  `tools/device-simulator/fixtures/v1-device-disconnected.jsonl`.
- Existing protocol and host adapter: 27/27 PASS.
- Runtime boundary: host compiler only; Arduino/ESP32-C6 runtime is **NOT RUN**.
- Repository entry point: `npm run test:firmware`; reports compiler/fixture/parser
  status and cleans its temporary output.
- ECO109-2 observed: `ECO109_HOST_VERIFICATION=PASS compiler=g++17 unit_tests=4
  fixture=byte-identical parser=2/2` with `g++ 13.3.0`.
- Current after ECO109-3: `ECO109_HOST_VERIFICATION=PASS compiler=g++17
  unit_tests=5 fixture=byte-identical parser=2/2`.

## ECO109-3 — C++ serialization boundary coverage

- [x] Verify `uint32_t` maximum sequence and uptime serialize as unsigned decimal
  values for both emitted message types.
- [x] Verify capacity of exactly the payload length fails closed (NUL terminator
  does not fit), while payload length plus one succeeds.
- [ ] ESP32-C6/Arduino build and physical transport remain blocked on G1.

## ECO109-4 — bounded writes on undersized buffers

- [x] Place canary bytes immediately before and after the caller-declared output
  capacity and verify both encoders leave them unchanged on insufficient capacity.
- [ ] Run memory sanitizers or the target toolchain only if available without
  crossing the board/G1 gate.

## ECO109-5 — calibration-version length boundary

- [x] Verify both encoders accept the declared maximum 32-character identifier.
- [x] Verify the allowlisted punctuation (`-_.`) and reject 33 characters or
  newline injection, clearing the destination buffer on invalid input.
- [ ] Do not infer a calibration format, range, or mapping from this identifier limit.

## ECO109-6 — parser accepts C++ boundary messages

- [x] Emit both boundary messages from the C++ executable and parse them through
  the canonical Node parser.
- [x] Assert `uint32_t` maximum sequence/uptime and 32-character identifier in
  parsed messages; retain the separate byte-identical disconnected fixture test.
- [ ] This remains host interoperability evidence, not ESP32-C6 transport evidence.

## Delivery slices

- ECO108-6: reconcile only the user-reported inventory and unresolved gates.
- ECO109-1: protocol source/tests plus its executable evidence and status hunks.
- Combined worktree size exceeds the 400-line review guard, so these remain two
  independent work units; no commit, push, PR, or merge was performed.

## Rollback

Remove `firmware/esp32-c6/` and this task entry, then revert only the related
status/documentation lines. Existing Node protocol fixtures remain unchanged.
