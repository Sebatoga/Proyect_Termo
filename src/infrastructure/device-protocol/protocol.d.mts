export type ProtocolStatus = "valid" | "invalid" | "disconnected";
export type BatteryMode = "idle" | "charge" | "discharge";
export type LoadPriority = "critical" | "balanced" | "comfort";
export type InputField =
  | "lightProxy"
  | "temperature"
  | "hydroSetpoint"
  | "batteryMode"
  | "loadPriority"
  | "confirm";

export const PROTOCOL_VERSION: 1;
export const STATUSES: readonly ProtocolStatus[];
export const BATTERY_MODES: readonly BatteryMode[];
export const LOAD_PRIORITIES: readonly LoadPriority[];
export const INPUT_FIELDS: readonly InputField[];

export interface ProtocolMessageBase {
  readonly protocolVersion: 1;
  readonly sequence: number;
  readonly uptimeMs: number;
  readonly calibrationVersion: string;
  readonly status: ProtocolStatus;
}

export interface HelloMessage extends ProtocolMessageBase {
  readonly type: "hello";
  readonly capabilities: readonly string[];
}

export interface InputReading {
  readonly value: number | string | boolean | null;
  readonly status: ProtocolStatus;
}

export interface InputsMessage extends ProtocolMessageBase {
  readonly type: "inputs";
  readonly values: Readonly<Record<InputField, InputReading>>;
}

export interface OutputMessage extends ProtocolMessageBase {
  readonly type: "output";
  readonly leds: Readonly<Record<string, unknown>>;
}

export interface ErrorMessage extends ProtocolMessageBase {
  readonly type: "error";
  readonly code: string;
  readonly detail: string | undefined;
}

export type ProtocolMessage = HelloMessage | InputsMessage | OutputMessage | ErrorMessage;
export type ParseResult =
  | Readonly<{ ok: true; message: ProtocolMessage }>
  | Readonly<{ ok: false; error: ErrorMessage }>;

export function errorMessage(code: string, sequence?: number): ErrorMessage;
export function parseLine(line: string): ParseResult;
export function validateSequence(
  previous: number | null,
  current: number,
): "SEQUENCE_INVALID" | null;
