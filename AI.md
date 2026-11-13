# How I Used AI

I used Claude (Anthropic) as an assistant throughout this project. It helped me work faster, but the idea, the gardening rules, the key decisions and the final checks were mine.

## Where the idea came from
I wanted a project based on my years working as a gardener. The AI suggested a weather-based garden advisor, and I shaped the idea and the rules from there. The thresholds (10 mm of rain, 0°C and 2°C for frost) come from my own experience, not from the AI.

## Where AI helped
- **Research:** finding suitable free APIs (postcodes.io and Open-Meteo).
- **Writing code:** the AI wrote code from my instructions and explained every line before I used it.
- **Good practices:** suggesting fixed test data, testing exact boundaries, one commit per step, exit codes for errors, and proving the CI by breaking the code on purpose in a separate branch.
- **Documentation:** drafting README.md and organising my notes for RESEARCH.md, based on my decisions. I reviewed every section.

## How I checked the work
- I ran the tests (`node --test`) after every change.
- I compared the real output with my own rules. For example, 3.9 mm + 4.1 mm = 8 mm, which is below 10 mm, so "Consider watering" was correct.
- I checked the exit code with `echo $LASTEXITCODE` to confirm that errors return 1.
- I watched the CI fail on a pull request with a deliberate bug, then closed it without merging.

## Shared decisions
- **Frost:** the AI pointed out that Open-Meteo's daily minimum runs from midnight to midnight. I decided to use tomorrow's minimum because, as a gardener, I know frost forms in the early hours of the morning.
- **Branch protection:** the AI explained that a rule for everyone would also block my own pushes. I chose to keep myself on the bypass list for this solo project and to document that trade-off.

## When things went wrong
- **A confusing instruction:** at one point the AI's step-by-step edits were unclear. I said so, and we switched to replacing the whole file, one step at a time.
- **Lost lines:** when I added my day 3 notes, three lines from day 2 were deleted by accident. I found them with `git show` and restored them.

## What I learned
- Software needs structure, clear reasoning and tests. Tests are a safety net: they check the rules automatically every time the code changes.
- Knowing the code is not enough without version control. Git and GitHub are what make the work real and shareable.
- Working with AI: break the work into small steps, check every result, and remember that I am responsible for what I submit.