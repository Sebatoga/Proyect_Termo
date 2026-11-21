# ESP32-C6 firmware protocol core

This directory contains a host-testable C++17 boundary for the provisional
EcoGrid JSON Lines v1 protocol. It does not assign GPIO pins or configure USB,
UART, ADC, OneWire, LEDs, buttons, timing, or calibration.

The current slice emits only:

- `hello` with the existing protocol capabilities;
- an explicit `disconnected` input snapshot that clears all six values.

Both encoders write into caller-owned fixed buffers, append one newline, reject
unsafe calibration identifiers, and fail closed on insufficient capacity.

## Host verification

From the repository root:

```bash
npm run test:firmware
```

From another working directory, use `npm --prefix /path/to/Proyect_Termo run
test:firmware`.

It compiles in a fresh OS temporary directory, runs the C++ behavior checks,
compares nominal emitted JSON Lines byte-for-byte with the checked-in fixture,
and validates both nominal and boundary messages with the canonical Node parser.
It removes only the temporary directory it created. It requires a host `g++`
C++17 compiler; this is not an ESP32-C6/Arduino build or a hardware test.

The underlying commands remain available for diagnosis:

```bash
g++ -std=c++17 -Wall -Wextra -Werror -pedantic \
  firmware/esp32-c6/protocol_v1.cpp \
  firmware/esp32-c6/protocol_v1_test.cpp \
  -o /tmp/ecogrid-protocol-v1-test
/tmp/ecogrid-protocol-v1-test
/tmp/ecogrid-protocol-v1-test --emit-disconnected \
  | diff - tools/device-simulator/fixtures/v1-device-disconnected.jsonl
```

Arduino integration remains blocked until the exact board pinout, USB mode,
serial configuration, and electrical schematic are verified. Sensor values stay
`disconnected` until their individual bench gates pass.
