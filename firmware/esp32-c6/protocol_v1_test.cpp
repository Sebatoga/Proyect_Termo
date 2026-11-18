#include "protocol_v1.hpp"

#include <cassert>
#include <iostream>
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
}

void failsClosedWhenTheBufferIsTooSmall() {
  char output[16] = "unchanged";
  assert(!ecogrid::firmware::encodeDisconnectedInputs(output, sizeof(output), 1, 100, "pending"));
  assert(output[0] == '\0');
  assert(!ecogrid::firmware::encodeHello(nullptr, 0, 0, 0, "pending"));
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

  encodesHelloExactly();
  encodesDisconnectedInputsExactly();
  rejectsUnsafeCalibrationVersions();
  failsClosedWhenTheBufferIsTooSmall();
  std::cout << "ECO109_PROTOCOL_TESTS=PASS tests=4\n";
}
