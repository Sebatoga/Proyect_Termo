const MANIFEST_VERSION = "round-lifecycle-manifest/v1";
const EVENT_TYPES = new Set(["synthetic"]);
const VALUE_FIELDS = Object.freeze([
  "lightProxy", "temperature", "hydroSetpoint", "batteryMode", "loadPriority", "confirm",
]);
const CAPTURE_LIMITS = Object.freeze({ maxDepth: 32, maxNodes: 2048, maxEntries: 4096 });
const OPTION_FIELDS = Object.freeze(["manifest", "seed", "resolverVersion", "resolve"]);

const isRecord = (value) => value !== null && typeof value === "object"
  && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const hasOnly = (value, fields) => isRecord(value)
  && Object.keys(value).length === fields.length
  && Object.keys(value).every((field) => fields.includes(field));

export class LifecycleValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "LifecycleValidationError";
    this.code = code;
  }
}

const reject = (code, message) => { throw new LifecycleValidationError(code, message); };

function capturePlainData(root, invalidCode, limitCode) {
  const seen = new WeakSet();
  const containers = [];
  const holder = { value: undefined };
  const stack = [{ source: root, target: holder, key: "value", depth: 0 }];
  let nodes = 0;
  let entries = 0;

  try {
    while (stack.length > 0) {
      const { source, target, key, depth } = stack.pop();
      nodes += 1;
      if (depth > CAPTURE_LIMITS.maxDepth || nodes > CAPTURE_LIMITS.maxNodes) {
        return { ok: false, code: limitCode };
      }
      if (source === null || typeof source === "string" || typeof source === "boolean") {
        target[key] = source;
        continue;
      }
      if (typeof source === "number") {
        if (!Number.isFinite(source)) return { ok: false, code: invalidCode };
        target[key] = source;
        continue;
      }
      if (typeof source !== "object" || seen.has(source)) return { ok: false, code: invalidCode };
      seen.add(source);

      const array = Array.isArray(source);
      const prototype = Object.getPrototypeOf(source);
      if (prototype !== (array ? Array.prototype : Object.prototype)) {
        return { ok: false, code: invalidCode };
      }
      const keys = Reflect.ownKeys(source);
      if (keys.some((property) => typeof property === "symbol")) {
        return { ok: false, code: invalidCode };
      }

      let dataKeys;
      if (array) {
        if (!keys.includes("length")) return { ok: false, code: invalidCode };
        dataKeys = keys.filter((property) => property !== "length");
        entries += dataKeys.length;
        if (entries > CAPTURE_LIMITS.maxEntries) return { ok: false, code: limitCode };
        const lengthDescriptor = Object.getOwnPropertyDescriptor(source, "length");
        if (!lengthDescriptor || !("value" in lengthDescriptor)
          || !Number.isSafeInteger(lengthDescriptor.value) || lengthDescriptor.value < 0) {
          return { ok: false, code: invalidCode };
        }
        if (dataKeys.length !== lengthDescriptor.value
          || dataKeys.some((property, index) => property !== String(index))) {
          return { ok: false, code: invalidCode };
        }
      } else {
        dataKeys = keys;
        entries += dataKeys.length;
        if (entries > CAPTURE_LIMITS.maxEntries) return { ok: false, code: limitCode };
      }

      const captured = array ? new Array(dataKeys.length) : {};
      target[key] = captured;
      containers.push(captured);
      for (let index = dataKeys.length - 1; index >= 0; index -= 1) {
        const property = dataKeys[index];
        const descriptor = Object.getOwnPropertyDescriptor(source, property);
        if (!descriptor || !("value" in descriptor) || !descriptor.enumerable) {
          return { ok: false, code: invalidCode };
        }
        if (!array) Object.defineProperty(captured, property, {
          value: undefined, enumerable: true, writable: true, configurable: true,
        });
        stack.push({ source: descriptor.value, target: captured, key: property, depth: depth + 1 });
      }
    }
    for (let index = containers.length - 1; index >= 0; index -= 1) Object.freeze(containers[index]);
    return { ok: true, value: holder.value };
  } catch {
    return { ok: false, code: invalidCode };
  }
}

function captureOptions(options) {
  try {
    if (options === null || typeof options !== "object"
      || Object.getPrototypeOf(options) !== Object.prototype) {
      return { ok: false, code: "OPTIONS_DATA_INVALID" };
    }
    const keys = Reflect.ownKeys(options);
    if (keys.some((property) => typeof property === "symbol")) {
      return { ok: false, code: "OPTIONS_DATA_INVALID" };
    }
    if (keys.length !== OPTION_FIELDS.length
      || !keys.every((property) => OPTION_FIELDS.includes(property))) {
      return { ok: false, code: "OPTIONS_SHAPE_INVALID" };
    }
    const captured = {};
    for (const property of OPTION_FIELDS) {
      const descriptor = Object.getOwnPropertyDescriptor(options, property);
      if (!descriptor || !("value" in descriptor) || !descriptor.enumerable) {
        return { ok: false, code: "OPTIONS_DATA_INVALID" };
      }
      Object.defineProperty(captured, property, {
        value: descriptor.value, enumerable: true, writable: false, configurable: false,
      });
    }
    return { ok: true, value: Object.freeze(captured) };
  } catch {
    return { ok: false, code: "OPTIONS_DATA_INVALID" };
  }
}

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
  return manifest;
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

export function createRoundLifecycle(options) {
  const optionsCapture = captureOptions(options);
  if (!optionsCapture.ok) reject(optionsCapture.code, "Lifecycle options are unsafe or invalid.");
  const { manifest, seed, resolverVersion, resolve } = optionsCapture.value;
  const manifestCapture = capturePlainData(
    manifest, "MANIFEST_DATA_INVALID", "MANIFEST_DATA_LIMIT_EXCEEDED",
  );
  if (!manifestCapture.ok) reject(manifestCapture.code, "Manifest data is unsafe or exceeds limits.");
  const acceptedManifest = validateManifest(manifestCapture.value);
  validateTrace(seed, resolverVersion, resolve);
  let history = Object.freeze([]);
  let resolving = false;

  const state = () => Object.freeze({
    schemaVersion: "round-lifecycle-state/v1",
    manifestVersion: acceptedManifest.schemaVersion,
    seed,
    resolverVersion,
    roundIndex: history.length,
    currentRoundId: history.length < 6 ? acceptedManifest.rounds[history.length].id : null,
    status: history.length < 6 ? "waiting-input" : "completed",
    history,
  });
  const response = (ok, reason) => Object.freeze({ ok, reason, state: state() });

  return Object.freeze({
    snapshot: state,
    confirm(snapshot, token) {
      if (resolving) return response(false, "RESOLUTION_IN_PROGRESS");
      resolving = true;
      try {
        if (history.length >= 6) return response(false, "LIFECYCLE_COMPLETED");
        const snapshotCapture = capturePlainData(
          snapshot, "INPUT_DATA_INVALID", "INPUT_DATA_LIMIT_EXCEEDED",
        );
        if (!snapshotCapture.ok) return response(false, snapshotCapture.code);
        if (history.length >= 6) return response(false, "LIFECYCLE_COMPLETED");
        const acceptedSnapshot = snapshotCapture.value;
        const issue = snapshotIssue(acceptedSnapshot);
        if (issue) return response(false, issue);
        if (typeof token !== "string" || token.length === 0) return response(false, "INPUT_TOKEN_INVALID");
        if (!acceptedSnapshot.values.confirm) return response(false, "CONFIRMATION_REQUIRED");
        if (history.some((entry) => entry.input.sequence === acceptedSnapshot.acceptedSequence
          || entry.input.token === token)) return response(false, "INPUT_REPLAYED");
        const lastSequence = history.at(-1)?.input.sequence;
        if (lastSequence !== undefined && acceptedSnapshot.acceptedSequence <= lastSequence) {
          return response(false, "INPUT_SEQUENCE_NOT_INCREASING");
        }

        if (history.length >= 6) return response(false, "LIFECYCLE_COMPLETED");
        const round = acceptedManifest.rounds[history.length];
        const acceptedInput = Object.freeze({
          sequence: acceptedSnapshot.acceptedSequence,
          token,
          calibrationVersion: acceptedSnapshot.calibrationVersion,
          controls: acceptedSnapshot.values,
        });
        const resolverInput = Object.freeze({
          seed, resolverVersion, round,
          input: acceptedInput,
        });
        if (history.length >= 6) return response(false, "LIFECYCLE_COMPLETED");
        let result;
        try {
          result = resolve(resolverInput);
        } catch {
          return response(false, "RESOLVER_FAILED");
        }
        const resultCapture = capturePlainData(
          result, "RESOLVER_RESULT_INVALID", "RESOLVER_RESULT_LIMIT_EXCEEDED",
        );
        if (!resultCapture.ok) return response(false, resultCapture.code);
        if (history.length >= 6) return response(false, "LIFECYCLE_COMPLETED");
        const entry = Object.freeze({
          roundId: round.id, input: acceptedInput, result: resultCapture.value,
        });
        history = Object.freeze([...history, entry]);
        return response(true, history.length >= 6 ? "LIFECYCLE_COMPLETED" : "ROUND_RESOLVED");
      } finally {
        resolving = false;
      }
    },
  });
}
