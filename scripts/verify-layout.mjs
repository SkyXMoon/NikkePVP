import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const screenshotPath = resolve(root, "layout-mobile-check.png");
const viewports = [
  { name: "mobile", width: 390, height: 900 },
  { name: "tablet", width: 760, height: 900 },
];

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

function getPlaywrightRequire() {
  const candidates = [
    resolve(root, "node_modules/playwright/index.js"),
    process.env.PLAYWRIGHT_ENTRY,
    process.env.USERPROFILE
      ? resolve(
          process.env.USERPROFILE,
          ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.js",
        )
      : null,
  ].filter(Boolean);

  const entry = candidates.find((candidate) => existsSync(candidate));
  if (!entry) {
    throw new Error("找不到 Playwright，请安装依赖或设置 PLAYWRIGHT_ENTRY。");
  }
  return createRequire(entry);
}

function getChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate));
}

function createStaticServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://127.0.0.1");
      const relativePath = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname).replace(/^\/+/, "");
      const filePath = resolve(root, relativePath);
      if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const data = await readFile(filePath);
      response.writeHead(200, { "content-type": mimeTypes.get(extname(filePath)) || "application/octet-stream" });
      response.end(data);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
}

function listen(server) {
  return new Promise((resolveListen) => {
    server.listen(0, "127.0.0.1", () => resolveListen(server.address().port));
  });
}

async function main() {
  const req = getPlaywrightRequire();
  const { chromium } = req("playwright");
  const chromePath = getChromePath();
  if (!chromePath) {
    throw new Error("找不到 Chrome 或 Edge，请设置 CHROME_PATH。");
  }

  const server = createStaticServer();
  const port = await listen(server);
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });

  try {
    const results = [];
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load" });
      await page.waitForTimeout(500);
      const result = await page.evaluate(() => {
        const getRect = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return {
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        };
        const team = getRect(".team-workbench");
        const workspace = getRect(".workspace");
        const list = getRect(".character-list");
        const overlap = team && workspace ? !(team.bottom <= workspace.top || workspace.bottom <= team.top) : false;
        return {
          navExists: Boolean(document.querySelector(".nav-rail")),
          contentDisplay: getComputedStyle(document.querySelector(".content-grid")).display,
          characterListMaxHeight: getComputedStyle(document.querySelector(".character-list")).maxHeight,
          team,
          workspace,
          characterList: list,
          overlap,
        };
      });
      results.push({ viewport, ...result });
      if (viewport.name === "mobile") {
        await page.screenshot({ path: screenshotPath, fullPage: false });
      }
      await page.close();
    }

    console.log(JSON.stringify({ screenshotPath, results }, null, 2));
    const failed = results.find((result) => result.navExists || result.overlap);
    if (failed) {
      throw new Error(`${failed.viewport.name} 布局检查失败`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
