import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map((match) => ({
  selectors: match[1].split(",").map((selector) => selector.trim()),
  declarations: match[2],
}));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function declaration(selector, property) {
  for (const rule of rules) {
    if (!rule.selectors.includes(selector)) continue;
    const declarationValue = rule.declarations.match(
      new RegExp(`(?:^|;)\\s*${escapeRegExp(property)}\\s*:\\s*([^;]+)\\s*(?:;|$)`),
    )?.[1];
    const value = declarationValue?.match(/#[0-9a-fA-F]{6}/)?.[0];
    if (value !== undefined) return value;
  }
  throw new Error(`Missing ${property} in ${selector}`);
}

function relativeLuminance(hex) {
  const [red, green, blue] = [1, 3, 5]
    .map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((channel) => (
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4
    ));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)]
    .sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

const pageText = declaration(":root", "color");
const pageBackground = declaration(":root", "background");

for (const [name, foreground, background] of [
  ["page text", pageText, pageBackground],
  ["button text", declaration("button", "color"), declaration("button", "background")],
  [
    "skip link",
    declaration(".skip-link", "color"),
    declaration(".skip-link", "background"),
  ],
  [
    "device panel label",
    declaration(".device-label", "color"),
    declaration(".device-panel", "background"),
  ],
  [
    "awaiting-input status",
    declaration('.device-status[data-level="awaiting-input"]', "color"),
    declaration(".device-panel", "background"),
  ],
  [
    "device input",
    declaration(".device-panel textarea", "color"),
    declaration(".device-panel textarea", "background"),
  ],
  [
    "simulation label",
    declaration(".simulation-label", "color"),
    declaration(".simulated-controls", "background"),
  ],
  [
    "round guide label",
    declaration(".round-guide-label", "color"),
    declaration(".round-guide", "background"),
  ],
  ["session notice", pageText, declaration(".session-notice", "background")],
  [
    "blocking notice",
    pageText,
    declaration('.session-notice[data-level="blocking"]', "background"),
  ],
]) {
  const ratio = contrast(foreground, background);
  test(`${name} contrast ${ratio.toFixed(2)}:1 meets WCAG AA normal-text threshold`, () => {
    assert.ok(ratio >= 4.5);
  });
}

const focusRatio = contrast(declaration("button:focus-visible", "outline"), pageBackground);
test(`focus indicator contrast ${focusRatio.toFixed(2)}:1 meets non-text threshold`, () => {
  assert.ok(focusRatio >= 3);
});
