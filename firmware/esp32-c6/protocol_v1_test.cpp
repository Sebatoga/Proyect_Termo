#include "protocol_v1.hpp"

#include <cassert>
#include <cstddef>
#include <cstdint>
#include <cstring>
#include <iostream>
#include <limits>
#include <string>

namespace {

void encodesHelloExactly() {
  char output[256]{};
  assert(ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, "pending"));
  assert(std::string(output) ==
         "{\"type\":\"hello\",\"protocolVersion\":1,\"sequence\":0,\"uptimeMs\":0,"
         "\"calibrationVersion\":\"pending\",\"status\":\"valid\","
         "\"capabilities\":[\"inputs\",\"output\"]}\n");
}

void encodesDisconnectedInputsExactly() {
  char output[768]{};
  assert(ecogrid::firmware::encodeDisconnectedInputs(output, sizeof(output), 1, 100, "pending"));
  assert(std::string(output) ==
         "{\"type\":\"inputs\",\"protocolVersion\":1,\"sequence\":1,\"uptimeMs\":100,"
         "\"calibrationVersion\":\"pending\",\"status\":\"disconnected\",\"values\":{"
         "\"lightProxy\":{\"value\":null,\"status\":\"disconnected\"},"
         "\"temperature\":{\"value\":null,\"status\":\"disconnected\"},"
         "\"hydroSetpoint\":{\"value\":null,\"status\":\"disconnected\"},"
         "\"batteryMode\":{\"value\":null,\"status\":\"disconnected\"},"
         "\"loadPriority\":{\"value\":null,\"status\":\"disconnected\"},"
         "\"confirm\":{\"value\":null,\"status\":\"disconnected\"}}}\n");
}

void rejectsUnsafeCalibrationVersions() {
  char output[256] = "unchanged";
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, ""));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, "bad\"value"));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, "non-ascii-\xC3\xA9"));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, "123456789012345678901234567890123"));
  assert(output[0] == '\0');

  const std::string maximumVersion(ecogrid::firmware::kMaxCalibrationVersionLength, 'v');
  assert(ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, maximumVersion.c_str()));
  assert(std::string(output).find("\"calibrationVersion\":\"" + maximumVersion + "\"")
      != std::string::npos);

  char inputs[768] = "unchanged";
  assert(ecogrid::firmware::encodeDisconnectedInputs(
      inputs, sizeof(inputs), 1, 100, maximumVersion.c_str()));
  assert(std::string(inputs).find("\"calibrationVersion\":\"" + maximumVersion + "\"")
      != std::string::npos);

  const std::string permittedPunctuation = "A9-_.z";
  assert(ecogrid::firmware::encodeHello(
      output, sizeof(output), 0, 0, permittedPunctuation.c_str()));
  assert(std::string(output).find("\"calibrationVersion\":\"A9-_.z\"") != std::string::npos);
  assert(ecogrid::firmware::encodeDisconnectedInputs(
      inputs, sizeof(inputs), 1, 100, permittedPunctuation.c_str()));
  assert(std::string(inputs).find("\"calibrationVersion\":\"A9-_.z\"") != std::string::npos);

  const std::string oversizedVersion(ecogrid::firmware::kMaxCalibrationVersionLength + 1, 'v');
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, oversizedVersion.c_str()));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeDisconnectedInputs(
      inputs, sizeof(inputs), 1, 100, oversizedVersion.c_str()));
  assert(inputs[0] == '\0');

  const char* lineBreakVersion = "cal-v1\n{\"type\":\"injected\"}";
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, lineBreakVersion));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeDisconnectedInputs(
      inputs, sizeof(inputs), 1, 100, lineBreakVersion));
  assert(inputs[0] == '\0');
}

void failsClosedWhenTheBufferIsTooSmall() {
  struct GuardedBuffer {
    char before;
    char output[16];
    char after;
  };
  static_assert(offsetof(GuardedBuffer, output) == 1);
  static_assert(offsetof(GuardedBuffer, after) == offsetof(GuardedBuffer, output) + 16);

  GuardedBuffer guardedDisconnected{0x5A, "unchanged", 0x5A};
  assert(!ecogrid::firmware::encodeDisconnectedInputs(
      guardedDisconnected.output, sizeof(guardedDisconnected.output), 1, 100, "pending"));
  assert(guardedDisconnected.output[0] == '\0');
  assert(guardedDisconnected.before == 0x5A);
  assert(guardedDisconnected.after == 0x5A);

  GuardedBuffer guardedHello{0x5A, "unchanged", 0x5A};
  assert(!ecogrid::firmware::encodeHello(
      guardedHello.output, sizeof(guardedHello.output), 1, 100, "pending"));
  assert(guardedHello.output[0] == '\0');
  assert(guardedHello.before == 0x5A);
  assert(guardedHello.after == 0x5A);

  assert(!ecogrid::firmware::encodeHello(nullptr, 0, 0, 0, "pending"));
}

void handlesUint32MaximumAndExactBufferCapacity() {
  constexpr auto maximum = std::numeric_limits<std::uint32_t>::max();

  char hello[256]{};
  assert(ecogrid::firmware::encodeHello(hello, sizeof(hello), maximum, maximum, "sim-v1"));
  assert(std::string(hello).find("\"sequence\":4294967295,\"uptimeMs\":4294967295") != std::string::npos);
  const auto helloLength = std::strlen(hello);
  assert(!ecogrid::firmware::encodeHello(hello, helloLength, maximum, maximum, "sim-v1"));
  assert(hello[0] == '\0');
  assert(ecogrid::firmware::encodeHello(hello, helloLength + 1, maximum, maximum, "sim-v1"));

  char inputs[768]{};
  assert(ecogrid::firmware::encodeDisconnectedInputs(inputs, sizeof(inputs), maximum, maximum, "sim-v1"));
  assert(std::string(inputs).find("\"sequence\":4294967295,\"uptimeMs\":4294967295") != std::string::npos);
  const auto inputsLength = std::strlen(inputs);
  assert(!ecogrid::firmware::encodeDisconnectedInputs(
      inputs, inputsLength, maximum, maximum, "sim-v1"));
  assert(inputs[0] == '\0');
  assert(ecogrid::firmware::encodeDisconnectedInputs(
      inputs, inputsLength + 1, maximum, maximum, "sim-v1"));
}

}  // namespace

int main(int argumentCount, char** arguments) {
  if (argumentCount == 2 && std::string(arguments[1]) == "--emit-disconnected") {
    char hello[256]{};
    char inputs[768]{};
    if (!ecogrid::firmware::encodeHello(hello, sizeof(hello), 0, 0, "sim-v1")
        || !ecogrid::firmware::encodeDisconnectedInputs(inputs, sizeof(inputs), 1, 100, "sim-v1")) {
      return 1;
    }
    std::cout << hello << inputs;
    return 0;
  }
  if (argumentCount == 2 && std::string(arguments[1]) == "--emit-boundary") {
    char hello[256]{};
    char inputs[768]{};
    const auto maximum = std::numeric_limits<std::uint32_t>::max();
    const std::string calibrationVersion(ecogrid::firmware::kMaxCalibrationVersionLength, 'v');
    if (!ecogrid::firmware::encodeHello(
            hello, sizeof(hello), maximum, maximum, calibrationVersion.c_str())
        || !ecogrid::firmware::encodeDisconnectedInputs(
            inputs, sizeof(inputs), maximum, maximum, calibrationVersion.c_str())) {
      return 1;
    }
    std::cout << hello << inputs;
    return 0;
  }

  encodesHelloExactly();
  encodesDisconnectedInputsExactly();
  rejectsUnsafeCalibrationVersions();
  failsClosedWhenTheBufferIsTooSmall();
  handlesUint32MaximumAndExactBufferCapacity();
  std::cout << "ECO109_PROTOCOL_TESTS=PASS tests=5\n";
}
