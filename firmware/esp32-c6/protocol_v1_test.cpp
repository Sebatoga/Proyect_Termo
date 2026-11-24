#include "protocol_v1.hpp"

#include <array>
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

void encodesCalibrationVersionAliasedInsideOutput() {
  char hello[256] = "sim-v1";
  assert(ecogrid::firmware::encodeHello(hello, sizeof(hello), 2, 3, hello));
  assert(std::string(hello).find("\"calibrationVersion\":\"sim-v1\"") != std::string::npos);

  char inputs[768] = "sim-v1";
  assert(ecogrid::firmware::encodeDisconnectedInputs(inputs, sizeof(inputs), 4, 5, inputs));
  assert(std::string(inputs).find("\"calibrationVersion\":\"sim-v1\"") != std::string::npos);

  char offsetHello[256] = "xsim-v1";
  assert(ecogrid::firmware::encodeHello(
      offsetHello, sizeof(offsetHello), 4, 5, offsetHello + 1));
  assert(std::string(offsetHello).find("\"calibrationVersion\":\"sim-v1\"")
      != std::string::npos);

  char offsetInputs[768] = "xsim-v1";
  assert(ecogrid::firmware::encodeDisconnectedInputs(
      offsetInputs, sizeof(offsetInputs), 4, 5, offsetInputs + 1));
  assert(std::string(offsetInputs).find("\"calibrationVersion\":\"sim-v1\"")
      != std::string::npos);

  const std::string maximumVersion(ecogrid::firmware::kMaxCalibrationVersionLength, 'v');
  char maximumHello[256]{};
  std::memcpy(maximumHello, maximumVersion.c_str(), maximumVersion.size() + 1);
  assert(ecogrid::firmware::encodeHello(
      maximumHello, sizeof(maximumHello), 6, 7, maximumHello));
  assert(std::string(maximumHello).find(
      "\"calibrationVersion\":\"" + maximumVersion + "\"") != std::string::npos);

  char maximumInputs[768]{};
  std::memcpy(maximumInputs, maximumVersion.c_str(), maximumVersion.size() + 1);
  assert(ecogrid::firmware::encodeDisconnectedInputs(
      maximumInputs, sizeof(maximumInputs), 8, 9, maximumInputs));
  assert(std::string(maximumInputs).find(
      "\"calibrationVersion\":\"" + maximumVersion + "\"") != std::string::npos);
}

void rejectsUnsafeCalibrationVersions() {
  char output[256] = "unchanged";
  char inputs[768] = "unchanged";
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, ""));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, "bad\"value"));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, "non-ascii-\xC3\xA9"));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, "123456789012345678901234567890123"));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, nullptr));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeDisconnectedInputs(
      inputs, sizeof(inputs), 1, 100, nullptr));
  assert(inputs[0] == '\0');

  const std::string maximumVersion(ecogrid::firmware::kMaxCalibrationVersionLength, 'v');
  assert(ecogrid::firmware::encodeHello(output, sizeof(output), 0, 0, maximumVersion.c_str()));
  assert(std::string(output).find("\"calibrationVersion\":\"" + maximumVersion + "\"")
      != std::string::npos);

  assert(ecogrid::firmware::encodeDisconnectedInputs(
      inputs, sizeof(inputs), 1, 100, maximumVersion.c_str()));
  assert(std::string(inputs).find("\"calibrationVersion\":\"" + maximumVersion + "\"")
      != std::string::npos);

  const std::string permittedCharacters = "AZaz09-_.";
  assert(ecogrid::firmware::encodeHello(
      output, sizeof(output), 0, 0, permittedCharacters.c_str()));
  assert(std::string(output).find(
      "\"calibrationVersion\":\"AZaz09-_.\"") != std::string::npos);
  assert(ecogrid::firmware::encodeDisconnectedInputs(
      inputs, sizeof(inputs), 1, 100, permittedCharacters.c_str()));
  assert(std::string(inputs).find(
      "\"calibrationVersion\":\"AZaz09-_.\"") != std::string::npos);

  const std::array<const char*, 5> forbiddenCharacters = {
      "bad value", "bad/value", "bad\\value", "bad\tvalue", "bad:value"};
  for (const char* invalidVersion : forbiddenCharacters) {
    assert(!ecogrid::firmware::encodeHello(
        output, sizeof(output), 0, 0, invalidVersion));
    assert(output[0] == '\0');
    assert(!ecogrid::firmware::encodeDisconnectedInputs(
        inputs, sizeof(inputs), 1, 100, invalidVersion));
    assert(inputs[0] == '\0');
  }

  const auto isAllowedAscii = [](unsigned int value) {
    const bool letter = (value >= 'A' && value <= 'Z')
        || (value >= 'a' && value <= 'z');
    const bool digit = value >= '0' && value <= '9';
    return letter || digit || value == '-' || value == '_' || value == '.';
  };
  for (unsigned int value = 1; value <= 0x7f; ++value) {
    const char candidate[] = {static_cast<char>(value), '\0'};
    const bool expected = isAllowedAscii(value);
    const bool helloAccepted = ecogrid::firmware::encodeHello(
        output, sizeof(output), 0, 0, candidate);
    assert(helloAccepted == expected);
    if (!expected) assert(output[0] == '\0');

    const bool inputsAccepted = ecogrid::firmware::encodeDisconnectedInputs(
        inputs, sizeof(inputs), 1, 100, candidate);
    assert(inputsAccepted == expected);
    if (!expected) assert(inputs[0] == '\0');
  }

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

  char zeroCapacityHello[16] = "unchanged";
  char zeroCapacityInputs[16] = "unchanged";
  assert(!ecogrid::firmware::encodeHello(
      zeroCapacityHello, 0, 0, 0, "pending"));
  assert(zeroCapacityHello[0] == 'u');
  assert(!ecogrid::firmware::encodeDisconnectedInputs(
      zeroCapacityInputs, 0, 1, 100, "pending"));
  assert(zeroCapacityInputs[0] == 'u');
  assert(!ecogrid::firmware::encodeHello(nullptr, 0, 0, 0, "pending"));
  assert(!ecogrid::firmware::encodeDisconnectedInputs(nullptr, 0, 1, 100, "pending"));
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
  if (argumentCount == 2 && std::string(arguments[1]) == "--emit-numeric-sweep") {
    constexpr std::array<std::uint32_t, 16> values = {
        0,
        1,
        9,
        10,
        99,
        100,
        999,
        1000,
        9999,
        10000,
        99999,
        100000,
        2147483647,
        2147483648,
        std::numeric_limits<std::uint32_t>::max() - 1,
        std::numeric_limits<std::uint32_t>::max(),
    };

    for (std::size_t index = 0; index < values.size(); ++index) {
      char hello[256]{};
      char inputs[768]{};
      const auto sequence = values[index];
      const auto uptime = values[values.size() - index - 1];
      if (!ecogrid::firmware::encodeHello(
              hello, sizeof(hello), sequence, uptime, "sweep-v1")
          || !ecogrid::firmware::encodeDisconnectedInputs(
              inputs, sizeof(inputs), sequence, uptime, "sweep-v1")) {
        return 1;
      }
      std::cout << hello << inputs;
    }
    return 0;
  }
  if (argumentCount != 1) {
    std::cerr << "Usage: protocol-test "
                 "[--emit-disconnected|--emit-boundary|--emit-numeric-sweep]\n";
    return 2;
  }

  encodesHelloExactly();
  encodesDisconnectedInputsExactly();
  encodesCalibrationVersionAliasedInsideOutput();
  rejectsUnsafeCalibrationVersions();
  failsClosedWhenTheBufferIsTooSmall();
  handlesUint32MaximumAndExactBufferCapacity();
  std::cout << "ECO109_PROTOCOL_TESTS=PASS tests=6\n";
}
