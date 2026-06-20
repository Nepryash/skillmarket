import assert from "node:assert/strict";
import test from "node:test";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  HeroFocusCarousel,
  carouselTasks,
  getCarouselWindow
} from "../src/components/hero-focus-carousel";

globalThis.React = React;

test("carousel defines the six approved changing headline phrases", () => {
  assert.deepEqual(
    carouselTasks.map((task) => task.headline),
    [
      "edit your videos",
      "build your apps",
      "write your scripts",
      "design your visuals",
      "plan your projects",
      "automate your work"
    ]
  );
});

test("getCarouselWindow wraps previous and next tasks around the task list", () => {
  assert.deepEqual(getCarouselWindow(0), {
    previous: carouselTasks[5],
    active: carouselTasks[0],
    next: carouselTasks[1]
  });
  assert.deepEqual(getCarouselWindow(5), {
    previous: carouselTasks[4],
    active: carouselTasks[5],
    next: carouselTasks[0]
  });
});

test("carousel renders changing headline and synchronized command journey", () => {
  const markup = renderToStaticMarkup(createElement(HeroFocusCarousel));

  assert.match(markup, /Find tools that/);
  assert.match(markup, /edit your videos/);
  assert.match(markup, /Describe your video/);
  assert.match(markup, /Compare editing options/);
  assert.match(markup, /aria-pressed="true"/);
});
