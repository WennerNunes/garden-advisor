# Research Log

This file records what I needed to learn while building this project, where I looked, what went wrong and what I learned.

---

## Day 1 – Choosing the project and setting up (9 Nov 2026)

### Choosing the problem
Before moving into tech, I ran my own gardening business for 8 years. One question I answered almost every day was: "Do I need to water today, or is frost coming?" I decided to turn that knowledge into a small tool: you enter a UK postcode, and it gives gardening advice based on the weather forecast.

I chose this because it is a real problem I understand well, so I can focus my learning on the technical side.

### Choosing the technology
I considered Python, because it is common in DevOps, but I am still a beginner in it. I already know JavaScript from front-end development, so I chose **Node.js** for a command-line tool. My goal is to focus my learning on things that are new to me:
- running JavaScript outside the browser with Node.js
- calling APIs from the terminal
- automated tests
- CI/CD with GitHub Actions

I also chose a command-line app instead of a web page because it fits a DevOps role better.

### Checking my tools
- `node -v` showed **v22.20.0**. I learned that `fetch` is built into Node from version 18, so I don't need an extra library to call APIs.
- `git --version` showed 2.48.1. I also checked that my Git name and email were set, so my commits are linked to my GitHub account.

### Setting up the project
- `git init` – starts version control in the folder (creates a hidden `.git` folder).
- `npm init -y` – creates `package.json`, the project's "ID card". The `-y` accepts the default answers.
- I added `"type": "module"` to `package.json` so I can use `import`/`export`, the same syntax I use in front-end code.

### Problems I ran into
1. **Missing comma in JSON.** After adding `"type": "module"`, VS Code showed a red error on the *next* line. The real problem was the missing comma on the line before.
   *Lesson:* an error is often caused by the line just before where it appears.
2. **VS Code "Restricted Mode".** VS Code showed a warning that it could not load the schema for `package.json`. I opened the Problems panel (Ctrl + Shift + M) and read the message: schema downloads are disabled in untrusted workspaces. I trusted the folder and the warning disappeared.
   *Lesson:* read the full message before trying to fix something.
3. **`git add` without the dot.** Git answered "Nothing specified, nothing added" and suggested `git add .`.
   *Lesson:* Git error messages often include the solution.
4. **LF/CRLF warning.** Git warned that "LF will be replaced by CRLF". I learned that Windows and Linux use different invisible characters for line breaks. It does not break my code, but it matters because servers (and GitHub Actions) run on Linux.

### Next steps
- Create the GitHub repository and push the project
- Learn how to get coordinates from a postcode (postcodes.io API)
- Learn how to get the weather forecast (Open-Meteo API)

---

## Day 2 – Exploring the APIs and defining the rules (10 Nov 2026)

I didn't have access to my computer today, so I used my phone to prepare. I created the GitHub repository and explored both APIs in the browser before writing any code.

### Creating the GitHub repository
I created a public repository called `garden-advisor` without a README, .gitignore or licence. My project already exists on my computer, and if GitHub created files first, the two histories would be different and my first push would be rejected.

### Exploring postcodes.io
I opened `https://api.postcodes.io/postcodes/WD31AA` in the browser to understand the response before writing code.
- The response has dozens of fields (region, district, NHS area...), but my code only needs two: latitude and longitude. Taking only what I need keeps the code simple and easier to test.
- I learned how nested JSON works: `data.result.latitude` means "inside the response, go into `result`, and take `latitude`".
- I tested an invalid postcode (`XX99XX`). It returned status **404** with the message "Postcode not found". In code, `response.ok` is false for this, so I can show a clear error message instead of crashing.

### Exploring Open-Meteo
I opened the forecast URL with `daily=temperature_2m_min,temperature_2m_max,precipitation_sum` and `past_days=1`.
- The `daily` object has **parallel arrays**: position 0 in each list is the same day.
- With `past_days=1`, position 0 is yesterday and position 1 is today. This lets me know how much it rained in the last 24 hours.
- The API adjusts the coordinates slightly to the nearest point in its grid, and returns the units in `daily_units` (°C and mm).
- Real data showed a frost risk (-0.1°C) on Saturday, which confirmed the tool is useful.

### Defining the gardening rules
The rules come from my 8 years as a gardener:
- **Watering:** skip watering after 10 mm or more of rain in 24 hours. If heavy rain is expected tomorrow, it's better to wait. Otherwise, the tool suggests checking soil moisture before watering.
- **Frost:** take precautions at **2°C or below**, because ground frost can happen while the air is still slightly above zero. At **0°C or below**, frost is likely, especially for tender plants, new shrubs and pots.

I kept the rules simple on purpose. Soil type matters (sandy soils need watering more often, clay soils hold moisture longer), but I left it as a future improvement.

I decided to store the thresholds as named constants (`RAIN_THRESHOLD_MM`, `FROST_RISK_C`, `FROST_LIKELY_C`) instead of "magic numbers", so they are easy to find, explain and adjust.

### Writing the code
I pushed the project to GitHub, renamed the branch from `master` to `main`, and wrote the first code:
- `src/postcode.js` gets the coordinates from postcodes.io.
- `src/weather.js` gets the forecast from Open-Meteo.
- `garden.js` connects them: the output of the first API (coordinates) becomes the input of the second (forecast).

### Problems I ran into
1. **`MODULE_NOT_FOUND` error.** I named a file `jarden.js` instead of `garden.js`. The error message showed the exact path Node was looking for, which helped me find the typo.
   *Lesson:* the first line of an error usually tells you what is wrong; the `at ...` lines (stack trace) show where.
2. **Following a stack trace.** When I tested an invalid postcode, the stack trace showed the error started in `postcode.js` line 5 and was called from `garden.js` line 4. I learned how to follow it back to the source.
3. **Forecasts change during the day.** The rain values for the same days were different one hour later (2.5 mm became 0.7 mm). This means I can't test my rules with live data, so I will use fixed test data instead.

## Day 3 – Wednesday 11 November 2026

### What I built
- `src/advice.js`: watering and frost rules as pure functions. They take the Open-Meteo `daily` object and return advice text, with no API calls inside.
- `test/advice.test.js`: 9 tests using Node's built-in test runner (`node --test`).
- `garden.js`: connected the rules to the APIs and printed a readable summary.
- Clean error messages and exit codes (brought forward from Thursday's plan).

### Key decisions
- **Fixed test data.** The live forecast changes during the day, so the tests use hand-written `daily` objects in the same shape as the API response. Tests are fast, repeatable and do not need the internet.
- **Testing the boundaries.** Separate tests for exactly 10 mm, 0°C and 2°C confirm the rules use `>=` and `<=` as intended.
- **Tomorrow's minimum for frost.** Open-Meteo's daily minimum runs from midnight to midnight, so tonight's frost (in the early hours) appears in tomorrow's value (index 2).
- **Order of checks.** "Frost likely" (≤ 0°C) is checked before "Frost risk" (≤ 2°C). Otherwise, -3°C would only produce the weaker warning.
- **`null` means no frost warning.** Watering always has advice; frost only appears when there is a risk.
- **Data before advice.** The output shows rain and temperatures first, so the user can see why they got that advice.

### Error handling
- **Missing postcode:** checked before any API call, with a usage example.
- **Unknown postcode:** one clear line instead of a stack trace.
- **No internet:** Node's "fetch failed" is turned into a helpful message.
- Errors go to `console.error` and the program exits with code 1, so scripts and CI can detect a failure (checked with `echo $LASTEXITCODE`).

### Next
- GitHub Actions workflow to run the tests on every push.