# Garden Advisor

![Tests](https://github.com/WennerNunes/garden-advisor/actions/workflows/test.yml/badge.svg)

A command-line tool that gives gardening advice for a UK postcode, based on the weather forecast.

The rules come from my years working as a gardener: they answer the two questions I asked myself every day — *do I need to water?* and *is frost coming tonight?*

## How it works

1. The postcode is converted into coordinates with [postcodes.io](https://postcodes.io).
2. The forecast for yesterday, today and tomorrow comes from [Open-Meteo](https://open-meteo.com).
3. Simple gardening rules turn the forecast into advice.

Both APIs are free and need no API key.

## Requirements

- Node.js 22 or later
- An internet connection

There are no dependencies to install.

## Getting started

```bash
git clone https://github.com/WennerNunes/garden-advisor.git
cd garden-advisor
node garden.js "SW1A 1AA"
```

You can also run `npm start -- "SW1A 1AA"`. Use quotes when the postcode has a space.

### Example output

```
Garden advice for SW1A 1AA

Rain: yesterday 0 mm, today 0 mm, tomorrow 0 mm
Tomorrow: 1.2°C to 9.8°C

Watering: Consider watering, but check soil moisture first
Frost: Frost risk: ground frost possible even above 0°C
```

The data is shown before the advice, so you can see why you got it.

## The rules

**Watering**

| Condition | Advice |
|---|---|
| Rain yesterday + today ≥ 10 mm | No need to water |
| Otherwise, rain tomorrow ≥ 10 mm | Hold off: rain is expected tomorrow |
| Otherwise | Consider watering, but check soil moisture first |

**Frost** (based on tomorrow's minimum temperature)

| Condition | Advice |
|---|---|
| ≤ 0°C | Frost likely: protect tender plants, new shrubs and pots |
| ≤ 2°C | Frost risk: ground frost possible even above 0°C |
| Above 2°C | No frost warning |

Why tomorrow's minimum? Open-Meteo's daily minimum runs from midnight to midnight, so tonight's frost, which forms in the early hours, appears in tomorrow's value.

The thresholds are named constants (`RAIN_THRESHOLD_MM`, `FROST_RISK_C`, `FROST_LIKELY_C`) at the top of `src/advice.js`, so they are easy to find and adjust.

## Project structure

```
garden.js                    Entry point: reads the postcode and prints the advice
src/postcode.js              Postcode → coordinates (postcodes.io)
src/weather.js               Coordinates → forecast (Open-Meteo)
src/advice.js                Gardening rules (pure functions, no network calls)
test/advice.test.js          Tests for the rules
.github/workflows/test.yml   CI workflow
```

## Tests

```bash
npm test
```

There are 9 tests, using Node's built-in test runner. They use fixed data instead of the live forecast, because the forecast changes during the day. They also check the exact boundaries (10 mm, 0°C and 2°C), so a change from `>=` to `>` would be caught.

> **Windows tip:** if PowerShell blocks `npm`, run `npm.cmd test` instead, or use `node --test`.

## Error handling

- **No postcode:** shows a usage example before calling any API.
- **Unknown postcode:** one clear message instead of a stack trace.
- **No internet:** a helpful message instead of Node's "fetch failed".

Errors go to `stderr` and the program exits with code 1, so scripts and CI can detect a failure.

## Continuous integration

A GitHub Actions workflow runs the tests on every push and pull request to `main`, on a clean Ubuntu machine with Node 22.

To prove it works, I opened a pull request ([#1](https://github.com/WennerNunes/garden-advisor/pull/1)) that broke a rule on purpose. The check failed in seconds, and the PR was closed without merging.

A repository ruleset protects `main`: the `test` check is required, and deletions and force pushes are blocked. As this is a solo project, the repository admin is on the bypass list; in a team, I would remove that and require pull requests.

## Limitations and future improvements

- **Soil type:** sandy soils dry out faster than clay, so the watering threshold could change by soil.
- **Time of year:** plants need less water in winter and frost matters more in spring.
- **Web front end:** because the rules are pure functions, `src/advice.js` could power a web page without changes.

## More documentation

- [RESEARCH.md](RESEARCH.md): my daily log of decisions and problems.
- [AI.md](AI.md): how I used AI in this project.