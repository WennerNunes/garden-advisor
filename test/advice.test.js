import { test } from "node:test";
import assert from "node:assert/strict";
import { getWateringAdvice, getFrostAdvice } from "../src/advice.js";

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

test("frost likely when tomorrow's minimum is below zero", () => {
  const daily = { temperature_2m_min: [5, 4, -3] };
  assert.equal(
    getFrostAdvice(daily),
    "Frost likely: protect tender plants, new shrubs and pots"
  );
});

test("exactly 0°C counts as frost likely", () => {
  const daily = { temperature_2m_min: [5, 4, 0] };
  assert.equal(
    getFrostAdvice(daily),
    "Frost likely: protect tender plants, new shrubs and pots"
  );
});

test("frost risk when tomorrow's minimum is just above zero", () => {
  const daily = { temperature_2m_min: [5, 4, 1.5] };
  assert.equal(
    getFrostAdvice(daily),
    "Frost risk: ground frost possible even above 0°C"
  );
});

test("exactly 2°C counts as frost risk", () => {
  const daily = { temperature_2m_min: [5, 4, 2] };
  assert.equal(
    getFrostAdvice(daily),
    "Frost risk: ground frost possible even above 0°C"
  );
});

test("no frost warning on a mild night", () => {
  const daily = { temperature_2m_min: [5, 4, 6] };
  assert.equal(getFrostAdvice(daily), null);
});