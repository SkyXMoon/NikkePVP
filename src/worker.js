const TEXT_CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
]);

function normalizeAssetResponseCharset(requestUrl, response) {
  const url = new URL(requestUrl);
  const contentType = response.headers.get("content-type") || "";
  const baseHeaders = new Headers(response.headers);
  if (url.pathname === "/sw.js") {
    baseHeaders.set("cache-control", "no-cache");
  }
  if (/^image\/svg\+xml/i.test(contentType.trim()) && !/; *charset=/i.test(contentType)) {
    const imageSvgHeaders = new Headers(baseHeaders);
    imageSvgHeaders.set("content-type", "image/svg+xml; charset=utf-8");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: imageSvgHeaders,
    });
  }
  const ext = url.pathname.toLowerCase().match(/\.([a-z0-9]+)(?:\?.*)?$/)?.[0] || "";
  const expected = TEXT_CONTENT_TYPES.get(ext);
  if (!expected) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: baseHeaders,
    });
  }
  if (/;\s*charset=/.test(contentType.toLowerCase())) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: baseHeaders,
    });
  }

  const headers = new Headers(baseHeaders);
  headers.set("content-type", expected);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isBlockedPublicAssetPath(pathname) {
  const normalized = pathname.toLowerCase();
  return (
    normalized.startsWith("/.wrangler/") ||
    normalized.startsWith("/.git/") ||
    normalized === "/.gitignore" ||
    normalized === "/wrangler.toml"
  );
}

function notFoundResponse() {
  return new Response("Not found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-content-type-options": "nosniff",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return notFoundResponse();
    }
    if (isBlockedPublicAssetPath(url.pathname)) {
      return notFoundResponse();
    }
    const response = await env.ASSETS.fetch(request);
    return normalizeAssetResponseCharset(request.url, response);
  },
};
