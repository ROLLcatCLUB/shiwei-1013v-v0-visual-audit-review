const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..", "..", "..", "..");
const OUT_DIR = path.resolve(__dirname, "..");
const SCREENSHOT_DIR = path.join(OUT_DIR, "screenshots");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const R97B_PATH = "outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP/r97b_clean_shell_context_preview.html";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

function startStaticServer() {
  const server = http.createServer((req, res) => {
    const rawPath = decodeURIComponent((req.url || "/").split("?")[0]).replace(/^\/+/, "");
    const target = path.resolve(ROOT, path.normalize(rawPath));
    if (!target.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs.readFile(target, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }
      const ext = path.extname(target).toLowerCase();
      const type = ext === ".html" ? "text/html; charset=utf-8" : ext === ".png" ? "image/png" : "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      res.end(data);
    });
  });
  return new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
    server.on("error", reject);
  });
}

function requestJson(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`${method} ${url} -> ${res.statusCode}: ${body.slice(0, 160)}`));
          return;
        }
        resolve(body ? JSON.parse(body) : {});
      });
    });
    req.on("error", reject);
    req.end();
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result || {});
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  async open() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
  }
  send(method, params = {}) {
    const id = this.nextId++;
    const promise = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.ws.send(JSON.stringify({ id, method, params }));
    return promise;
  }
  waitForEvent(method, timeoutMs = 8000) {
    return new Promise((resolve) => {
      const started = Date.now();
      const timer = setInterval(() => {
        const event = this.events.find((item) => item.method === method);
        if (event || Date.now() - started > timeoutMs) {
          clearInterval(timer);
          resolve(event || null);
        }
      }, 50);
    });
  }
  close() {
    try {
      this.ws.close();
    } catch (_) {}
  }
}

async function waitForDebugger(port) {
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try {
      return await requestJson(`http://127.0.0.1:${port}/json/version`);
    } catch (_) {
      await sleep(200);
    }
  }
  throw new Error("remote debugging endpoint did not start");
}

async function evaluate(client, expression) {
  return client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    timeout: 8000,
  });
}

function pngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function main() {
  ensureDir(SCREENSHOT_DIR);
  const staticServer = await startStaticServer();
  const staticPort = staticServer.address().port;
  const browserPort = await getFreePort();
  const profileDir = path.join(OUT_DIR, ".edge-profile");
  fs.rmSync(profileDir, { recursive: true, force: true });
  const edge = spawn(EDGE, [
    "--headless=new",
    `--remote-debugging-port=${browserPort}`,
    `--user-data-dir=${profileDir}`,
    "--disable-gpu",
    "--disable-extensions",
    "--no-first-run",
    "about:blank",
  ], { stdio: "ignore" });

  const result = {
    stage: "1013V_VISUAL_SYSTEM_POLISH_LINE",
    correction: "V0_R97B_CORE_SHELL_CORRECTION",
    target_shell: R97B_PATH,
    started_at: new Date().toISOString(),
  };

  try {
    await waitForDebugger(browserPort);
    const url = `http://127.0.0.1:${staticPort}/${R97B_PATH}`;
    const target = await requestJson(`http://127.0.0.1:${browserPort}/json/new?${encodeURIComponent(url)}`, "PUT");
    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.open();
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.send("Page.navigate", { url });
    await client.waitForEvent("Page.loadEventFired", 12000);
    await sleep(1200);
    await evaluate(client, "document.fonts && document.fonts.ready ? document.fonts.ready : true").catch(() => {});
    await evaluate(client, "window.scrollTo(0, 0)");

    const metrics = await evaluate(client, `(() => {
      if (typeof window.__R220B_BIND_SHELL_LAYER_MARKERS__ === "function") window.__R220B_BIND_SHELL_LAYER_MARKERS__();
      const slot = (id) => {
        const node = typeof window.resolveRenderSlot === "function" ? window.resolveRenderSlot(id) : null;
        return node ? { found: true, tag: node.tagName, id: node.id || "", className: String(node.className || "").slice(0, 120), text: (node.innerText || "").slice(0, 160) } : { found: false };
      };
      const layer = (id) => {
        const node = typeof window.resolveShellLayer === "function" ? window.resolveShellLayer(id) : null;
        return node ? { found: true, tag: node.tagName, id: node.id || "", className: String(node.className || "").slice(0, 120) } : { found: false };
      };
      return {
        title: document.title,
        stage: document.body?.dataset?.stage || "",
        current_shell: document.documentElement.getAttribute("data-r220b-current-shell") || document.body?.getAttribute("data-r220b-current-shell") || "",
        r220b_shell_binding: document.documentElement.getAttribute("data-r220b-shell-layer-slot-ownership-binding"),
        has_ownership_map: Boolean(window.__R220B_SHELL_SLOT_OWNERSHIP_MAP__),
        has_resolve_shell_layer: typeof window.resolveShellLayer === "function",
        has_resolve_render_slot: typeof window.resolveRenderSlot === "function",
        shell_layers: {
          app_shell: layer("app-shell"),
          workspace_shell: layer("workspace-shell"),
          render_surface: layer("render-surface"),
          lesson_content_renderer: layer("lesson-content-renderer"),
          right_rail: layer("right-rail"),
          bottom_xiaojiao: layer("bottom-xiaojiao")
        },
        render_slots: {
          app_topbar: slot("app-topbar"),
          render_stage: slot("render-stage"),
          active_render_layer: slot("active-render-layer"),
          left_unit_tree: slot("left-unit-tree"),
          lesson_body: slot("lesson-body"),
          teaching_process: slot("teaching-process"),
          right_rail: slot("right-rail"),
          bottom_xiaojiao: slot("bottom-xiaojiao")
        },
        body_text_sample: (document.body?.innerText || "").slice(0, 1200),
        counts: {
          shell_layer_nodes: document.querySelectorAll("[data-shell-layer]").length,
          render_slot_nodes: document.querySelectorAll("[data-render-slot]").length,
          render_surface_nodes: document.querySelectorAll("[data-render-surface]").length,
          r220b_slot_nodes: document.querySelectorAll("[data-r220b-slot-id]").length
        }
      };
    })()`);

    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      fromSurface: true,
    });
    const screenshotPath = path.join(SCREENSHOT_DIR, "r97b_core_shell_current.png");
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));
    result.url = url;
    result.screenshot = "screenshots/r97b_core_shell_current.png";
    result.screenshot_bytes = fs.statSync(screenshotPath).size;
    result.screenshot_dimensions = pngSize(screenshotPath);
    result.dom_metrics = metrics.result.value;
    const layers = Object.values(result.dom_metrics.shell_layers || {});
    const slots = Object.values(result.dom_metrics.render_slots || {});
    result.pass = Boolean(
      result.dom_metrics.r220b_shell_binding === "true" &&
      result.dom_metrics.has_resolve_shell_layer &&
      result.dom_metrics.has_resolve_render_slot &&
      layers.every((item) => item && item.found) &&
      slots.every((item) => item && item.found) &&
      result.screenshot_bytes > 2000
    );
    await client.send("Page.close").catch(() => {});
    client.close();
  } finally {
    edge.kill();
    staticServer.close();
    await sleep(700);
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch (_) {
      // Browser profile cleanup is best-effort; it is excluded from review artifacts.
    }
  }
  result.ended_at = new Date().toISOString();
  fs.writeFileSync(path.join(OUT_DIR, "r97b_core_shell_screenshot_manifest.json"), JSON.stringify(result, null, 2), "utf8");
  if (!result.pass) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
