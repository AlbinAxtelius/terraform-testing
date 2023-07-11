import { build } from "esbuild";
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = readdirSync(join(__dirname, "..", "src", "functions"))
  .filter((x) => x.endsWith(".ts"))
  .map((x) => join(__dirname, "..", "src", "functions", x));

build({
  outdir: join(__dirname, "..", "dist", "functions"),
  entryPoints: files,
  outExtension: { ".js": ".mjs" },
});
