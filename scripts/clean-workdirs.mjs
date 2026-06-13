import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const targets = [".next", ".turbo"];

for (const target of targets) {
  const resolved = path.resolve(process.cwd(), target);

  if (existsSync(resolved)) {
    rmSync(resolved, { recursive: true, force: true });
    console.log(`Removed ${target}`);
  }
}
