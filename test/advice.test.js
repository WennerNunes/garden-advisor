import { test } from "node:test";
import assert from "node:assert/strict";
import { getWateringAdvice } from "../src/advice.js";

test("no need to water after heavy rain yesterday and today", () => {
  const daily = { precipitation_sum: [6, 5, 0] };
  assert.equal(getWateringAdvice(daily), "No need to water");
});

test("exactly 10 mm counts as enough rain", () => {
  const daily = { precipitation_sum: [4, 6, 0] };
  assert.equal(getWateringAdvice(daily), "No need to water");
});

test("hold off when heavy rain is expected tomorrow", () => {
  const daily = { precipitation_sum: [1, 2, 12] };
  assert.equal(getWateringAdvice(daily), "Hold off: rain is expected tomorrow");
});

test("consider watering when there is little rain", () => {
  const daily = { precipitation_sum: [1, 2, 3] };
  assert.equal(
    getWateringAdvice(daily),
    "Consider watering, but check soil moisture first"
  );
});