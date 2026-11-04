const MANIFEST_VERSION = "round-lifecycle-manifest/v1";
const EVENT_TYPES = new Set(["synthetic"]);
const VALUE_FIELDS = Object.freeze([
  "lightProxy", "temperature", "hydroSetpoint", "batteryMode", "loadPriority", "confirm",
]);

const isRecord = (value) => value !== null && typeof value === "object"
  && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const hasOnly = (value, fields) => isRecord(value)
  && Object.keys(value).length === fields.length
  && Object.keys(value).every((field) => fields.includes(field));
const clone = (value) => structuredClone(value);
const freezeDeep = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freezeDeep(child);
  }
  return value;
};
const immutable = (value) => freezeDeep(clone(value));

export class LifecycleValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "LifecycleValidationError";
    this.code = code;
  }
}

const reject = (code, message) => { throw new LifecycleValidationError(code, message); };

function validateManifest(manifest) {
  if (!hasOnly(manifest, ["schemaVersion", "rounds"])) reject("MANIFEST_SHAPE_INVALID", "Manifest fields are invalid.");
  if (manifest.schemaVersion !== MANIFEST_VERSION) reject("MANIFEST_VERSION_UNSUPPORTED", "Manifest version is unsupported.");
  if (!Array.isArray(manifest.rounds) || manifest.rounds.length !== 6) reject("ROUND_COUNT_INVALID", "Manifest must contain exactly six rounds.");
  const ids = new Set();
  for (const round of manifest.rounds) {
    if (!hasOnly(round, ["id", "event"]) || typeof round.id !== "string" || round.id.length === 0) {
      reject("ROUND_SHAPE_INVALID", "Each round requires only a non-empty id and event.");
    }
    if (ids.has(round.id)) reject("ROUND_ID_DUPLICATE", "Round ids must be unique.");
    ids.add(round.id);
    if (!hasOnly(round.event, ["type", "data"])) reject("EVENT_SHAPE_INVALID", "Event fields are invalid.");
    if (!EVENT_TYPES.has(round.event.type)) reject("EVENT_TYPE_UNSUPPORTED", "Event type is unsupported.");
    if (!hasOnly(round.event.data, ["key"]) || typeof round.event.data.key !== "string"
      || round.event.data.key.length === 0) reject("EVENT_DATA_INVALID", "Synthetic event data requires only a non-empty key.");
  }
  return immutable(manifest);
}

function validateTrace(seed, resolverVersion, resolver) {
  if (typeof seed !== "string" || seed.length === 0) reject("SEED_INVALID", "Seed must be a non-empty string.");
  if (typeof resolverVersion !== "string" || resolverVersion.length === 0) reject("RESOLVER_VERSION_INVALID", "Resolver version must be a non-empty string.");
  if (typeof resolver !== "function") reject("RESOLVER_INVALID", "Resolver must be a function.");
}

function snapshotIssue(snapshot) {
  if (!hasOnly(snapshot, ["transport", "inputStatus", "acceptedSequence", "calibrationVersion", "values", "issue"])) return "INPUT_SHAPE_INVALID";
  if (snapshot.transport !== "connected") return "INPUT_DISCONNECTED";
  if (snapshot.inputStatus !== "valid" || snapshot.issue !== null) return "INPUT_INVALID";
  if (!Number.isSafeInteger(snapshot.acceptedSequence) || snapshot.acceptedSequence < 0) return "INPUT_SEQUENCE_INVALID";
  if (typeof snapshot.calibrationVersion !== "string" || snapshot.calibrationVersion.length === 0) return "CALIBRATION_VERSION_INVALID";
  if (!hasOnly(snapshot.values, VALUE_FIELDS)) return "CONTROL_SHAPE_INVALID";
  const { lightProxy, temperature, hydroSetpoint, batteryMode, loadPriority, confirm } = snapshot.values;
  if (![lightProxy, temperature, hydroSetpoint].every(Number.isFinite)
    || typeof batteryMode !== "string" || batteryMode.length === 0
    || typeof loadPriority !== "string" || loadPriority.length === 0
    || typeof confirm !== "boolean") return "CONTROL_VALUE_INVALID";
  return null;
}

function isPlainData(value, seen = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  const children = Array.isArray(value) ? value : (isRecord(value) ? Object.values(value) : null);
  return children !== null && children.every((child) => isPlainData(child, seen));
}

export function createRoundLifecycle({ manifest, seed, resolverVersion, resolve }) {
  const acceptedManifest = validateManifest(manifest);
  validateTrace(seed, resolverVersion, resolve);
  let history = immutable([]);

  const state = () => immutable({
    schemaVersion: "round-lifecycle-state/v1",
    manifestVersion: acceptedManifest.schemaVersion,
    seed,
    resolverVersion,
    roundIndex: history.length,
    currentRoundId: history.length < 6 ? acceptedManifest.rounds[history.length].id : null,
    status: history.length < 6 ? "waiting-input" : "completed",
    history,
  });
  const response = (ok, reason) => immutable({ ok, reason, state: state() });

  return Object.freeze({
    snapshot: state,
    confirm(snapshot, token) {
      if (history.length === 6) return response(false, "LIFECYCLE_COMPLETED");
      const issue = snapshotIssue(snapshot);
      if (issue) return response(false, issue);
      if (typeof token !== "string" || token.length === 0) return response(false, "INPUT_TOKEN_INVALID");
      if (!snapshot.values.confirm) return response(false, "CONFIRMATION_REQUIRED");
      if (history.some((entry) => entry.input.sequence === snapshot.acceptedSequence
        || entry.input.token === token)) return response(false, "INPUT_REPLAYED");

      const round = acceptedManifest.rounds[history.length];
      const resolverInput = immutable({
        seed, resolverVersion, round,
        input: {
          sequence: snapshot.acceptedSequence,
          token,
          calibrationVersion: snapshot.calibrationVersion,
          controls: snapshot.values,
        },
      });
      let result;
      try {
        result = resolve(resolverInput);
      } catch {
        return response(false, "RESOLVER_FAILED");
      }
      if (!isPlainData(result)) return response(false, "RESOLVER_RESULT_INVALID");
      history = immutable([...history, { roundId: round.id, input: resolverInput.input, result }]);
      return response(true, history.length === 6 ? "LIFECYCLE_COMPLETED" : "ROUND_RESOLVED");
    },
  });
}
