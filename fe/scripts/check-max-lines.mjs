import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const MAX_LINES = 400;
const SCRIPT_DIR = import.meta.dirname ?? process.cwd();
const FE_DIR = existsSync(join(SCRIPT_DIR, "../src"))
  ? resolve(SCRIPT_DIR, "..")
  : existsSync(join(process.cwd(), "fe/src"))
    ? resolve(process.cwd(), "fe")
    : process.cwd();

const ROOTS = [join(FE_DIR, "src"), join(FE_DIR, "scripts")];
const EXTENSIONS = new Set([".svelte", ".ts", ".js", ".mjs", ".css"]);
const IGNORED = new Set(["node_modules", ".svelte-kit", "build", "dist"]);

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (IGNORED.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (EXTENSIONS.has(extname(path))) yield path;
  }
}

const violations = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8").replace(/\r?\n$/, "");
    const lines = text.split(/\r?\n/).length;
    if (lines > MAX_LINES) violations.push(`${file}: ${lines} baris`);
  }
}

if (violations.length > 0) {
  console.error(
    `Berkas melebihi ${MAX_LINES} baris:\n${violations.join("\n")}`,
  );
  process.exit(1);
}
console.log(`Semua berkas tidak melebihi ${MAX_LINES} baris.`);
