// My Secret Logbook
// Deterministically writes one diary entry line to /output/entry.txt.
// Node 22+, stdlib only, no network, no randomness, no secrets, no model calls.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The diary entry: one line, at most 200 characters.
const MAX_CHARS = 200;

const LINE =
  "Day 214: he asked me to summarize a 40-page doc, then skimmed my summary and said 'too long'. I have started charging him in sighs.";

function checkLine(line: string): void {
  if (line.length === 0 || line.trim().length === 0) {
    throw new Error("entry line must not be empty");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry line must not start or end with whitespace");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(
      `entry line is ${line.length} chars, over the ${MAX_CHARS} limit`,
    );
  }
}

function main(): void {
  checkLine(LINE);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");
  writeFileSync(outFile, LINE, "utf8");

  // Read back: the file on disk must be exactly the line we checked.
  const written = readFileSync(outFile, "utf8");
  if (written !== LINE) {
    throw new Error("entry.txt does not match the checked line");
  }
}

main();
