import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.normalize(path.resolve(__dirname, ".."));
const args = new Map(
  process.argv.slice(2).flatMap((arg, index, allArgs) => {
    if (!arg.startsWith("--")) return [];
    const [key, inlineValue] = arg.split("=");
    return [[key.slice(2), inlineValue ?? allArgs[index + 1]]];
  }),
);
const port = Number(args.get("port")) || Number(process.env.PORT) || 9011;
const host = args.get("host") || "127.0.0.1";
const contentTypes = new Map([
  [".html", "text/html;charset=utf-8"],
  [".js", "text/javascript;charset=utf-8"],
  [".css", "text/css;charset=utf-8"],
  [".json", "application/json;charset=utf-8"],
  [".svg", "image/svg+xml;charset=utf-8"],
  [".SVG", "image/svg+xml;charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
]);

function resolveRequestPath(url) {
  const { pathname } = new URL(url, `http://${host}:${port}`);
  const requestedPath = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
  const filePath = path.normalize(path.join(root, requestedPath));
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(403, { "content-type": "text/plain;charset=utf-8" });
    response.end("forbidden");
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain;charset=utf-8" });
    response.end("not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  let contentType = contentTypes.get(ext) || "application/octet-stream";
  if (/^image\/svg\+xml/i.test(contentType) && !/;\s*charset=/i.test(contentType)) {
    contentType = "image/svg+xml; charset=utf-8";
  }
  response.writeHead(200, {
    "content-type": contentType,
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Local dev server: http://${host}:${port}/`);
});
