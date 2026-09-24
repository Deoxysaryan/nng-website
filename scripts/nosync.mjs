#!/usr/bin/env node
/**
 * Keeps node_modules and .next out of iCloud.
 *
 * Why: this folder lives inside ~/Documents, which macOS syncs to iCloud. With a
 * fuller disk macOS evicts synced files, and a dependency tree of 20,000 small
 * files turns into 20,000 downloads. Builds, type checks and lint then stall.
 * A folder whose name ends in .nosync is ignored by iCloud, so the real folders
 * are kept inside node_modules.nosync and .next.nosync with symlinks in their place.
 * node_modules is nested one level down (node_modules.nosync/node_modules) so the
 * real path still contains a /node_modules/ segment, which Turbopack and other
 * tools use to tell dependencies from source.
 *
 * npm replaces the node_modules symlink with a real folder on every install,
 * so run this after "npm install":  npm run nosync
 *
 * Safe to run any time. Does nothing off macOS or outside iCloud folders.
 */
import { existsSync, lstatSync, renameSync, rmSync, symlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const inICloud = /\/(Documents|Desktop)\//.test(ROOT + "/") || ROOT.includes("Mobile Documents");

if (process.platform !== "darwin" || !inICloud || process.env.CI || process.env.NNG_NO_NOSYNC) {
  console.log("nosync: nothing to do here.");
  process.exit(0);
}

for (const name of ["node_modules", ".next"]) {
  const link = join(ROOT, name);
  const holder = join(ROOT, `${name}.nosync`);
  const real = name === "node_modules" ? join(holder, "node_modules") : holder;
  const target = name === "node_modules" ? "node_modules.nosync/node_modules" : `${name}.nosync`;
  const stat = existsSync(link) || isLink(link) ? lstatSync(link) : null;

  if (stat?.isSymbolicLink()) {
    if (!existsSync(real)) mkdirSync(real, { recursive: true });
    console.log(`nosync: ${name} already a symlink.`);
    continue;
  }
  mkdirSync(holder, { recursive: true });
  if (stat?.isDirectory()) {
    rmSync(real, { recursive: true, force: true });
    renameSync(link, real);
  } else if (!existsSync(real)) {
    mkdirSync(real, { recursive: true });
  }
  symlinkSync(target, link);
  console.log(`nosync: ${name} moved to ${target} and linked.`);
}

function isLink(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}
