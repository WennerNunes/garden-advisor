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