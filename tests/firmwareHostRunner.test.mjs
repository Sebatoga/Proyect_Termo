import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runnerPath = join(root, "tools/firmware-host-test.mjs");

test("firmware host runner removes its temporary build directory when g++ is unavailable", () => {
  const testDirectory = mkdtempSync(join(tmpdir(), "ecogrid-firmware-runner-test-"));
  const isolatedTmp = join(testDirectory, "tmp");
  const emptyPath = join(testDirectory, "bin");
  mkdirSync(isolatedTmp);
  mkdirSync(emptyPath);

  try {
    const result = spawnSync(process.execPath, [runnerPath], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: emptyPath,
        TEMP: isolatedTmp,
        TMP: isolatedTmp,
        TMPDIR: isolatedTmp,
      },
    });

    assert.equal(result.error, undefined);
    assert.notEqual(result.status, 0, "runner should fail without a compiler");
    assert.match(result.stderr, /Could not run g\+\+:/);
    assert.deepEqual(readdirSync(isolatedTmp), [], "runner must remove its temporary build directory");
  } finally {
    rmSync(testDirectory, { recursive: true, force: true });
  }
});

test("firmware host runner removes its temporary build directory when g++ exits unsuccessfully", {
  skip: process.platform === "win32",
}, () => {
  const testDirectory = mkdtempSync(join(tmpdir(), "ecogrid-firmware-compiler-failure-test-"));
  const isolatedTmp = join(testDirectory, "tmp");
  const fakeCompilerDirectory = join(testDirectory, "bin");
  const fakeCompilerPath = join(fakeCompilerDirectory, "g++");
  mkdirSync(isolatedTmp);
  mkdirSync(fakeCompilerDirectory);
  writeFileSync(fakeCompilerPath, "#!/bin/sh\nexit 23\n");
  chmodSync(fakeCompilerPath, 0o755);

  try {
    const result = spawnSync(process.execPath, [runnerPath], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: fakeCompilerDirectory,
        TEMP: isolatedTmp,
        TMP: isolatedTmp,
        TMPDIR: isolatedTmp,
      },
    });

    assert.equal(result.error, undefined);
    assert.notEqual(result.status, 0, "runner should fail when compiler exits unsuccessfully");
    assert.match(result.stderr, /g\+\+ exited with status 23:/);
    assert.deepEqual(readdirSync(isolatedTmp), [], "runner must remove its temporary build directory");
  } finally {
    rmSync(testDirectory, { recursive: true, force: true });
  }
});

test("firmware host runner removes its temporary build directory after a successful run", () => {
  const testDirectory = mkdtempSync(join(tmpdir(), "ecogrid-firmware-success-test-"));
  const isolatedTmp = join(testDirectory, "tmp");
  mkdirSync(isolatedTmp);

  try {
    const result = spawnSync(process.execPath, [runnerPath], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        TEMP: isolatedTmp,
        TMP: isolatedTmp,
        TMPDIR: isolatedTmp,
      },
    });

    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /ECO109_HOST_VERIFICATION=PASS/);
    assert.deepEqual(readdirSync(isolatedTmp), [], "runner must remove its temporary build directory");
  } finally {
    rmSync(testDirectory, { recursive: true, force: true });
  }
});

test("firmware host runner supports the optimized strict-warning profile", () => {
  const testDirectory = mkdtempSync(join(tmpdir(), "ecogrid-firmware-strict-test-"));
  const isolatedTmp = join(testDirectory, "tmp");
  mkdirSync(isolatedTmp);

  try {
    const result = spawnSync(process.execPath, [runnerPath, "--strict"], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        TEMP: isolatedTmp,
        TMP: isolatedTmp,
        TMPDIR: isolatedTmp,
      },
    });

    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /profile=optimized-strict/);
    assert.match(result.stdout, /fixture=byte-identical parser=36\/36 numeric_sweep=16/);
    assert.deepEqual(readdirSync(isolatedTmp), [], "runner must remove its temporary build directory");
  } finally {
    rmSync(testDirectory, { recursive: true, force: true });
  }
});
