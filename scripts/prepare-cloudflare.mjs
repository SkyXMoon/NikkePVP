import { mkdir, readFile, rm, writeFile, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const buildRoot = join(root, ".worker-build");
const publicDir = join(buildRoot, "public");
const generatedDir = join(buildRoot, "generated");

async function copyStaticAsset(name) {
  await cp(join(root, name), join(publicDir, name), { recursive: true });
}

async function prepareDataModule() {
  const source = await readFile(join(root, "data.js"), "utf8");
  const moduleSource = source
    .replace("const DATA_SOURCES =", "export const DATA_SOURCES =")
    .replace("const CHARACTERS =", "export const CHARACTERS =");
  await writeFile(join(generatedDir, "data.mjs"), moduleSource, "utf8");
}

async function preparePublicIndex() {
  const source = await readFile(join(root, "index.html"), "utf8");
  await writeFile(join(publicDir, "index.html"), source, "utf8");
}

await rm(buildRoot, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });
await mkdir(generatedDir, { recursive: true });

await prepareDataModule();
await preparePublicIndex();
await copyStaticAsset("data.js");
await copyStaticAsset("app.js");
await copyStaticAsset("styles.css");
await copyStaticAsset("assets");

console.log("Cloudflare build assets prepared in .worker-build/");
