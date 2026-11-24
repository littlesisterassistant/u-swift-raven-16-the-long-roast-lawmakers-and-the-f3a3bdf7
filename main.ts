// Write the entry sentence to the output directory.
//
// Standard library only. Writes one satirical sentence, exactly as-is with
// no trailing newline, to MAKEFUN_OUTPUT_DIR (default /output) as entry.txt,
// checks it is 1 to 320 characters and not only whitespace, then reads it
// back and verifies the written bytes match.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The chairman of the AI Regulation Committee spent three hours trying to convert his own bill to PDF, then voted to ban the algorithm that could have done it in one click.";

function fail(message: string): never {
  console.error("error: " + message);
  process.exit(1);
}

const chars = [...LINE];
if (chars.length < 1 || chars.length > 320) {
  fail("line is " + chars.length + " characters, must be 1 to 320");
}
if (LINE.trim().length === 0) {
  fail("line is only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
try {
  mkdirSync(outDir, { recursive: true });
} catch (error) {
  fail("cannot create output dir: " + String(error));
}
const dest = join(outDir, "entry.txt");
try {
  writeFileSync(dest, LINE, "utf8");
} catch (error) {
  fail("cannot write " + dest + ": " + String(error));
}

const written = readFileSync(dest, "utf8");
if (written !== LINE) {
  fail("read-back check failed: written text differs from the line");
}
if (written.endsWith("\n") || written.endsWith("\r")) {
  fail("read-back check failed: entry.txt ends with a newline");
}

console.log("wrote entry.txt (" + chars.length + " characters): " + LINE);
