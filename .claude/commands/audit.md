Run a full CLAUDE.md audit on the entire project. Check every file in src/, functions/, scripts/.

For each file report:
- Functions over 30 lines — list function name and line count
- Magic strings used more than once — list the string and locations
- Magic numbers representing domain concepts — list them
- Type assertions without // safe: comment — list them
- Constants declared but not fully replacing all usages — list them

Report format: PASS or FAIL per file with specific violations.
Do not summarize. List every violation found.
After reporting — wait for user approval before fixing anything.
