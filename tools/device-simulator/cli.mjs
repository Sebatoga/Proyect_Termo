#!/usr/bin/env node
import { createInterface } from "node:readline";
import { errorMessage, parseLine, serializeScenario, validateSequence } from "./protocol.mjs";

const [command, argument] = process.argv.slice(2);

if (command === "emit") {
  try { process.stdout.write(serializeScenario(argument)); }
  catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
} else if (command === "validate") {
  let previous = null;
  const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
  for await (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed.ok) {
      process.stdout.write(`${JSON.stringify(parsed.error)}\n`);
      continue;
    }
    const sequenceCode = validateSequence(previous, parsed.message.sequence);
    if (sequenceCode) {
      process.stdout.write(`${JSON.stringify(errorMessage(sequenceCode, parsed.message.sequence))}\n`);
      continue;
    }
    process.stdout.write(`${JSON.stringify(parsed.message)}\n`);
    previous = parsed.message.sequence;
  }
} else {
  process.stderr.write("Usage: node cli.mjs emit <nominal|disconnected> | validate\n");
  process.exitCode = 1;
}
