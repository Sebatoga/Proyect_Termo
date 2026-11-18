#!/usr/bin/env node
import { createInterface } from "node:readline";
import { createHostAdapter } from "./adapter.mjs";

const adapter = createHostAdapter();
const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });

for await (const line of lines) {
  process.stdout.write(`${JSON.stringify(adapter.ingest(line))}\n`);
}
