export const PROVISIONAL_EVENT_KEYS = Object.freeze([
  "base-demand",
  "high-temperature",
  "low-river",
  "demand-peak",
  "reduced-light",
  "seeded-combination",
]);

const rounds = PROVISIONAL_EVENT_KEYS.map((key, index) => Object.freeze({
  id: `round-${index + 1}`,
  event: Object.freeze({
    type: "synthetic",
    data: Object.freeze({ key }),
  }),
}));

export const PROVISIONAL_ROUND_MANIFEST = Object.freeze({
  schemaVersion: "round-lifecycle-manifest/v1",
  rounds: Object.freeze(rounds),
});
