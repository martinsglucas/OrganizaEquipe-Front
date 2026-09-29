import test from "node:test";
import assert from "node:assert/strict";

import { parseLinkSegments } from "../src/utils/linkifyText.mjs";

test("preserves text order and recognizes multiple HTTP(S) links", () => {
  assert.deepEqual(
    parseLinkSegments(
      "Antes https://example.com/um\ndepois http://example.org/dois fim"
    ),
    [
      { type: "text", value: "Antes " },
      { type: "link", value: "https://example.com/um" },
      { type: "text", value: "\ndepois " },
      { type: "link", value: "http://example.org/dois" },
      { type: "text", value: " fim" },
    ]
  );
});

test("keeps sentence punctuation and unmatched brackets outside links", () => {
  assert.deepEqual(
    parseLinkSegments(
      "Veja (https://example.com/path). E https://example.com/foo_(bar)."
    ),
    [
      { type: "text", value: "Veja (" },
      { type: "link", value: "https://example.com/path" },
      { type: "text", value: "). E " },
      { type: "link", value: "https://example.com/foo_(bar)" },
      { type: "text", value: "." },
    ]
  );
});

test("leaves unsupported, malformed, and HTML-like content inert", () => {
  const value =
    'javascript:alert(1) https:// <a href="https://example.com">site</a>';

  assert.deepEqual(parseLinkSegments(value), [{ type: "text", value }]);
});

test("keeps empty and link-free observations unchanged", () => {
  assert.deepEqual(parseLinkSegments(""), []);
  assert.deepEqual(parseLinkSegments("Somente texto\ncom quebra."), [
    { type: "text", value: "Somente texto\ncom quebra." },
  ]);
});
