import assert from "node:assert/strict";
import test from "node:test";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CopyButton } from "../src/components/copy-button";

globalThis.React = React;

test("CopyButton renders Copy as the default initial state", () => {
  const markup = renderToStaticMarkup(createElement(CopyButton, { text: "npm install skillmarket" }));

  assert.match(markup, />Copy\s*</);
  assert.doesNotMatch(markup, /Copied/);
});
