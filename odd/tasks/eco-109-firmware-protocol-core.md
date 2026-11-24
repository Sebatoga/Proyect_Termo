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

## ECO109-7 — runner cleanup after compiler failure

- [x] Isolate `TMPDIR`/`TMP`/`TEMP` and `PATH`; assert cleanup on runner success,
  when `g++` cannot be launched, and when a stub compiler exits with status 23.
- [x] Remove only the test-owned temporary directory in the test's `finally`.
- [ ] This checks host cleanup behavior only; it does not verify Arduino or hardware.

## ECO109-8 — invalid encoder arguments

- [x] Verify both encoders reject a null calibration identifier and clear a
  writable output buffer.
- [x] Verify zero capacity rejects without writing to a non-null destination;
  null destination is rejected for both encoders.
- [ ] This is a host API-boundary test, not a board or memory-safety audit.

## ECO109-9 — optional host sanitizers

- [x] Add an opt-in runner mode compiled with AddressSanitizer and
  UndefinedBehaviorSanitizer, without making those runtimes mandatory for the
  normal firmware-host command.
- [x] Run the same C++ behavior, fixture, and parser checks under instrumentation.
- [ ] Sanitized host execution is not ESP32-C6 validation or electrical safety evidence.

## ECO109-10 — reject unsupported host executable arguments

- [x] Return a nonzero usage error for unrecognized CLI arguments instead of
  silently running the default behavior checks.
- [x] Assert status, empty stdout, and exact usage output in the host runner.
- [ ] This protects the test harness CLI contract only; it does not add a device
  command or protocol behavior.

## ECO109-11 — deterministic numeric serialization sweep

- [x] Emit `hello`/`inputs` pairs at decimal-width transitions and around the
  signed/unsigned 32-bit boundary.
- [x] Parse every emitted line with the canonical Node parser and compare exact
  sequence/uptime values, message types, and calibration identifier.
- [ ] This is host interoperability coverage; it does not establish device
  uptime behavior, sequence policy, or physical transport.

## ECO109-12 — safe JSON integer parsing

- [x] Require `sequence` and `uptimeMs` to be nonnegative safe integers in the
  JavaScript parser.
- [x] Verify `Number.MAX_SAFE_INTEGER` acceptance, the next integer rejection,
  and safe fallback sequence values in parse errors.
- [ ] This prevents JavaScript precision loss only; it does not choose a general
  protocol-width maximum or establish device behavior.

## ECO109-13 — keep transport numbers separate from physical ranges

- [x] Verify finite extreme numeric values pass the transport parser without
  assigning calibration, physical units, or model-domain bounds.
- [x] Verify the observation view labels all six displayed fields as transport
  values and states that they do not modify the game.
- [x] Run focused protocol/observation tests, full Vitest suite, typecheck, build,
  and whitespace check.
- [ ] This is a software-boundary regression only; it does not establish sensor
  range, calibration, physical plausibility, or hardware behavior.
- Result: focused Vitest `14/14` PASS; full Vitest `108/108` PASS;
  `npm run typecheck` PASS; `npm run build` PASS with the known Phaser chunk-size
  warning (`1,222.79 kB`); `git diff --check` PASS.

## Delivery slices

- ECO108-6: reconcile only the user-reported inventory and unresolved gates.
- ECO109-1: protocol source/tests plus its executable evidence and status hunks.
- ECO109-2 through ECO109-6 host runner and serialization boundaries:
  commit `5207af7` (`test(firmware): verify protocol boundaries on host`).
- ECO109-13 adds protocol/UI regression coverage without changing parser policy
  or assigning physical-domain limits.

## ECO109-14 — verify protocol error and direction recovery

- [x] Reject a device-to-host `output` message at the host adapter boundary,
  clear previously accepted values, and recover on the next expected input
  sequence.
- [x] Surface a versioned device `error` message and clear stale values without
  interpreting its content as a physical measurement.
- [x] Run focused observation/protocol tests, typecheck, and whitespace check.
- Result: focused Vitest `16/16` PASS; `npm run typecheck` PASS;
  `git diff --check` PASS.
- [ ] Host protocol behavior only; no serial, device, sensor, calibration, or
  hardware evidence.

## ECO109-15 — fail closed on a partially disconnected snapshot

- [x] Verify that one disconnected field disconnects the complete host snapshot
  and clears every previously accepted value.
- [x] Verify recovery is possible when the next contiguous sequence supplies a
  complete valid input snapshot.
- [x] Run focused observation/protocol tests, typecheck, and whitespace check.
- Result: focused Vitest `17/17` PASS; `npm run typecheck` PASS;
  `git diff --check` PASS.
- [ ] This checks only software handling of protocol status; it is not sensor
  disconnect, calibration, USB, or hardware evidence.

## ECO109-16 — reject partially invalid snapshots

- [x] Verify a schema-valid `inputs` message with one invalid field is rejected
  as a whole rather than exposing its other values.
- [x] Verify previously accepted values are cleared and a subsequent complete
  snapshot with the next contiguous sequence recovers.
- [x] Run focused observation/protocol regressions.
- Result: focused Vitest `18/18` PASS; full Vitest `112/112` PASS;
  `npm run typecheck` PASS; `git diff --check` PASS. Host firmware and
  sanitizer commands PASS (`g++17`, ASan/UBSan, 5 unit checks, byte-identical
  fixture, parser 36/36, deterministic numeric sweep 16).
- [ ] This verifies software fail-closed behavior only; it does not classify
  physical sensor faults or establish calibration/ranges.

## ECO109-17 — preserve aliased calibration input during encoding

- [x] Reproduce and fix overlapping `snprintf` source/destination use when the
  caller stores `calibrationVersion` inside the output buffer.
- [x] Copy the validated identifier into a bounded local buffer before writing
  the encoded line; cover both `hello` and disconnected `inputs`, including the
  maximum 32-character identifier alias and a source pointer beginning one byte
  inside the destination buffer.
- [x] Run normal and ASan/UBSan host verification.
- Result: `npm run test:firmware` and `npm run test:firmware:sanitized` PASS;
  six C++ host behavior checks, byte-identical fixture, parser `36/36`, sweep
  `16`.
- Regression batch: firmware runner 3/3, Vitest 114/114, typecheck, build,
  product Chrome smoke and offline Chrome smoke PASS; docs-link tests 4/4 and
  repository audit 124 files/35 links/0 broken; ECO-002 structural/whitespace
  validators and `git diff --check` PASS.
- Build emitted the existing Vite warning for the Phaser bundle
  (`1,222.79 kB` minified, above the 500 kB advisory threshold); this test-only
  change does not alter the bundle.
- The first offset-pointer fixture used an array too small for the complete JSON
  line and correctly failed for insufficient capacity; expanding it to the
  serializer capacities (256/768 bytes) made the intended overlap case pass.
- [ ] Host memory/serialization evidence only; no ESP32-C6 build, USB, sensor,
  calibration, or hardware evidence.
- The earlier ECO108-6/ECO109-1 combined worktree exceeded the 400-line review
  guard and remained separate; that historical note predates the commits above.

## ECO109-18 — pin calibration identifier character boundaries

- [x] Exercise the first/last ASCII letters and digits plus all permitted
  punctuation through both encoders: `A-Z`, `a-z`, `0-9`, `-`, `_`, `.`.
- [x] Sweep every non-NUL ASCII byte from `0x01` through `0x7f` as a one-byte
  identifier and assert that only the allowlist is accepted by both encoders.
- [x] Reject whitespace, slash, backslash, tab, and colon for both `hello` and
  disconnected `inputs`, with output cleared on failure.
- [x] Run normal and ASan/UBSan host verification.
- Result: `npm run test:firmware` and `npm run test:firmware:sanitized` PASS;
  six C++ host behavior checks, byte-identical fixture, parser `36/36`, sweep
  `16`.
- Test-fixture note: the first expected output omitted the allowed hyphen and
  failed its assertion; correcting the expected string made both test commands
  pass. The exhaustive sweep then passed for all 127 non-NUL ASCII bytes in each
  encoder. No production behavior changed.
- [ ] This confirms the software identifier allowlist only; it does not define
  calibration semantics or establish ESP32-C6/hardware evidence.

## ECO109-19 — add an optimized strict-warning host profile

- [x] Add `npm run test:firmware:strict` without installing a second compiler.
- [x] Compile with `-O2 -Wconversion -Wsign-conversion -Wshadow -Wformat=2`
  in addition to the existing C++17 warnings-as-errors profile.
- [x] Verify byte-identical fixture, canonical parser acceptance, numeric sweep,
  and temporary-directory cleanup under the strict profile.
- Result: strict host runner PASS; runner cleanup/profile tests `4/4`; six C++
  behavior checks, fixture byte-identical, parser `36/36`, numeric sweep `16`.
- [ ] This is an additional GCC host profile only, not an ESP32-C6 toolchain,
  Arduino, USB, or hardware check.

## Rollback

Remove `firmware/esp32-c6/` and this task entry, then revert only the related
status/documentation lines. Existing Node protocol fixtures remain unchanged.
