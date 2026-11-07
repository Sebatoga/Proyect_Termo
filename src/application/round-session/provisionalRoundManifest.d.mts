import type { RoundLifecycleManifest } from "./roundLifecycle.mjs";

export const PROVISIONAL_EVENT_KEYS: readonly [
  "base-demand",
  "high-temperature",
  "low-river",
  "demand-peak",
  "reduced-light",
  "seeded-combination",
];

export const PROVISIONAL_ROUND_MANIFEST: RoundLifecycleManifest;
