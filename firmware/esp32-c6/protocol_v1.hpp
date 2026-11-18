#pragma once

#include <cstddef>
#include <cstdint>

namespace ecogrid::firmware {

inline constexpr std::uint32_t kProtocolVersion = 1;
inline constexpr std::size_t kMaxCalibrationVersionLength = 32;

bool encodeHello(
    char* output,
    std::size_t capacity,
    std::uint32_t sequence,
    std::uint32_t uptimeMs,
    const char* calibrationVersion);

bool encodeDisconnectedInputs(
    char* output,
    std::size_t capacity,
    std::uint32_t sequence,
    std::uint32_t uptimeMs,
    const char* calibrationVersion);

}  // namespace ecogrid::firmware
