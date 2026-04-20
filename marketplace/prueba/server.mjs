import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const PORT = Number(process.env.PRUEBA_PORT || 8787);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function resolvePath(urlPath) {
  const cleanPath = urlPath === "/" ? "/index.html" : urlPath;
  const safe = path.normalize(cleanPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(root, safe);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = resolvePath(url.pathname);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor de prueba en http://localhost:${PORT}`);
});

