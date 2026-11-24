#include "protocol_v1.hpp"

#include <cinttypes>
#include <cstdio>

namespace ecogrid::firmware {
namespace {

bool validCalibrationVersion(const char* value) {
  if (value == nullptr) return false;
  std::size_t length = 0;
  while (length <= kMaxCalibrationVersionLength && value[length] != '\0') ++length;
  if (length == 0 || length > kMaxCalibrationVersionLength) return false;

  for (std::size_t index = 0; index < length; ++index) {
    const unsigned char character = static_cast<unsigned char>(value[index]);
    const bool asciiLetter = (character >= 'A' && character <= 'Z')
        || (character >= 'a' && character <= 'z');
    const bool asciiDigit = character >= '0' && character <= '9';
    if (!asciiLetter && !asciiDigit && character != '-' && character != '_' && character != '.') {
      return false;
    }
  }
  return true;
}

bool formattedSuccessfully(char* output, std::size_t capacity, int written) {
  if (written < 0 || static_cast<std::size_t>(written) >= capacity) {
    if (output != nullptr && capacity > 0) output[0] = '\0';
    return false;
  }
  return true;
}

bool validOutput(
    char* output,
    std::size_t capacity,
    const char* calibrationVersion,
    char* stableCalibrationVersion) {
  if (output == nullptr || capacity == 0 || !validCalibrationVersion(calibrationVersion)) {
    if (output != nullptr && capacity > 0) output[0] = '\0';
    return false;
  }

  std::size_t index = 0;
  while (calibrationVersion[index] != '\0') {
    stableCalibrationVersion[index] = calibrationVersion[index];
    ++index;
  }
  stableCalibrationVersion[index] = '\0';
  return true;
}

}  // namespace

bool encodeHello(
    char* output,
    std::size_t capacity,
    std::uint32_t sequence,
    std::uint32_t uptimeMs,
    const char* calibrationVersion) {
  char stableCalibrationVersion[kMaxCalibrationVersionLength + 1]{};
  if (!validOutput(output, capacity, calibrationVersion, stableCalibrationVersion)) return false;
  const int written = std::snprintf(
      output,
      capacity,
      "{\"type\":\"hello\",\"protocolVersion\":%" PRIu32 ",\"sequence\":%" PRIu32
      ",\"uptimeMs\":%" PRIu32 ","
      "\"calibrationVersion\":\"%s\",\"status\":\"valid\","
      "\"capabilities\":[\"inputs\",\"output\"]}\n",
      kProtocolVersion,
      sequence,
      uptimeMs,
      stableCalibrationVersion);
  return formattedSuccessfully(output, capacity, written);
}

bool encodeDisconnectedInputs(
    char* output,
    std::size_t capacity,
    std::uint32_t sequence,
    std::uint32_t uptimeMs,
    const char* calibrationVersion) {
  char stableCalibrationVersion[kMaxCalibrationVersionLength + 1]{};
  if (!validOutput(output, capacity, calibrationVersion, stableCalibrationVersion)) return false;
  const int written = std::snprintf(
      output,
      capacity,
      "{\"type\":\"inputs\",\"protocolVersion\":%" PRIu32 ",\"sequence\":%" PRIu32
      ",\"uptimeMs\":%" PRIu32 ","
      "\"calibrationVersion\":\"%s\",\"status\":\"disconnected\",\"values\":{"
      "\"lightProxy\":{\"value\":null,\"status\":\"disconnected\"},"
      "\"temperature\":{\"value\":null,\"status\":\"disconnected\"},"
      "\"hydroSetpoint\":{\"value\":null,\"status\":\"disconnected\"},"
      "\"batteryMode\":{\"value\":null,\"status\":\"disconnected\"},"
      "\"loadPriority\":{\"value\":null,\"status\":\"disconnected\"},"
      "\"confirm\":{\"value\":null,\"status\":\"disconnected\"}}}\n",
      kProtocolVersion,
      sequence,
      uptimeMs,
      stableCalibrationVersion);
  return formattedSuccessfully(output, capacity, written);
}

}  // namespace ecogrid::firmware
