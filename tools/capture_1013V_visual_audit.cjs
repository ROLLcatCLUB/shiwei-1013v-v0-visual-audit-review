const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const AUDIT_DIR = path.resolve(__dirname, "..");
const SCREENSHOT_DIR = path.join(AUDIT_DIR, "screenshots");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const CASES = [
  {
    id: "01_home_global_shell_desktop",
    label: "全局壳层 / 师维大厅 desktop",
    source_path: "frontend/home.html",
    url_path: "/frontend/home.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "global_shell",
    audit_focus: ["top_shell", "space_navigation", "teacher_workbench_identity"],
  },
  {
    id: "02_home_global_shell_mobile",
    label: "全局壳层 / 师维大厅 mobile",
    source_path: "frontend/home.html",
    url_path: "/frontend/home.html",
    viewport: { width: 390, height: 844, mobile: true },
    surface_group: "global_shell",
    audit_focus: ["mobile_navigation", "top_shell_density"],
  },
  {
    id: "03_xiaojiao_preview_home",
    label: "小教新工作面 / 今日重点",
    source_path: "frontend/xiaojiao-preview.html",
    url_path: "/frontend/xiaojiao-preview.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "xiaojiao_preview",
    audit_focus: ["assistant_presence", "today_priority", "review_queue"],
  },
  {
    id: "04_xiaojiao_lesson_draft_focus",
    label: "小教新工作面 / 课时草稿与主内容",
    source_path: "frontend/xiaojiao-preview.html",
    url_path: "/frontend/xiaojiao-preview.html",
    viewport: { width: 1440, height: 1000 },
    before_capture: "window.go && window.go('focus')",
    surface_group: "lesson_preview",
    audit_focus: ["lesson_body", "right_material_folder", "xiaojiao_side_panel"],
  },
  {
    id: "05_xiaojiao_teacher_confirm_gate",
    label: "小教新工作面 / 教师确认门",
    source_path: "frontend/xiaojiao-preview.html",
    url_path: "/frontend/xiaojiao-preview.html",
    viewport: { width: 1440, height: 1000 },
    before_capture: "window.go && window.go('gate')",
    surface_group: "teacher_confirm_gate",
    audit_focus: ["candidate_review", "teacher_decision", "preview_before_apply"],
  },
  {
    id: "06_xiaojiao_material_folder",
    label: "小教新工作面 / 材料夹与证据入口",
    source_path: "frontend/xiaojiao-preview.html",
    url_path: "/frontend/xiaojiao-preview.html",
    viewport: { width: 1440, height: 1000 },
    before_capture: "window.go && window.go('materials')",
    surface_group: "evidence_and_materials",
    audit_focus: ["source_anchor", "evidence_reflection", "candidate_status"],
  },
  {
    id: "07_xiaobei_workbench_pick",
    label: "旧精修工作台 / 课题确认",
    source_path: "frontend/xiaobei_workbench.html",
    url_path: "/frontend/xiaobei_workbench.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "prep_room_legacy",
    audit_focus: ["lesson_queue", "stepper", "topic_confirm"],
  },
  {
    id: "08_xiaobei_workbench_draft_fields",
    label: "旧精修工作台 / 草稿字段",
    source_path: "frontend/xiaobei_workbench.html",
    url_path: "/frontend/xiaobei_workbench.html",
    viewport: { width: 1440, height: 1000 },
    before_capture: "window.goStep && window.goStep('draft')",
    surface_group: "field_editing",
    audit_focus: ["field_weight", "draft_preview", "table_feel"],
  },
  {
    id: "09_xiaobei_workbench_dimension_edit",
    label: "旧精修工作台 / 评价维度编辑",
    source_path: "frontend/xiaobei_workbench.html",
    url_path: "/frontend/xiaobei_workbench.html",
    viewport: { width: 1440, height: 1000 },
    before_capture: "window.goStep && window.goStep('dims')",
    surface_group: "field_editing",
    audit_focus: ["dimension_cards", "json_hidden", "teacher_editing"],
  },
  {
    id: "10_xiaobei_quick_prep",
    label: "快速备课 / 最小草稿入口",
    source_path: "frontend/xiaobei_quick_prep.html",
    url_path: "/frontend/xiaobei_quick_prep.html",
    viewport: { width: 1440, height: 1000 },
    before_capture: "window.goStep && window.goStep('draft')",
    surface_group: "quick_prep",
    audit_focus: ["quick_lesson_draft", "minimal_fields", "teacher_flow"],
  },
  {
    id: "11_quick_drafts_internal_review",
    label: "草稿内部审核页",
    source_path: "frontend/xiaobei_quick_drafts.html",
    url_path: "/frontend/xiaobei_quick_drafts.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "draft_review",
    audit_focus: ["draft_queue", "review_status", "empty_or_error_state"],
  },
  {
    id: "12_assignment_dimension_confirm_gate",
    label: "评价维度确认门",
    source_path: "frontend/assignment_dimension_manage.html",
    url_path: "/frontend/assignment_dimension_manage.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "teacher_confirm_gate",
    audit_focus: ["dimension_confirm", "ai_evaluation_gate", "writeback_warning"],
  },
  {
    id: "13_xiaoping_review_gallery",
    label: "作品馆 / 作品小评",
    source_path: "frontend/xiaoping_review.html",
    url_path: "/frontend/xiaoping_review.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "student_work_gallery",
    audit_focus: ["student_work_queue", "ai_first_review", "teacher_decision"],
  },
  {
    id: "14_semester_review_room_overview",
    label: "评阅室样板间 / 总览",
    source_path: "frontend/semester_review_room.html",
    url_path: "/frontend/semester_review_room.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "review_room",
    audit_focus: ["room_shell", "review_scene", "candidate_materials"],
  },
  {
    id: "15_semester_review_room_evidence",
    label: "评阅室样板间 / 课堂证据",
    source_path: "frontend/semester_review_room.html",
    url_path: "/frontend/semester_review_room.html",
    viewport: { width: 1440, height: 1000 },
    before_capture: "document.querySelector('[data-panel=\"evidence\"]')?.click()",
    surface_group: "review_room",
    audit_focus: ["evidence_chain", "routine_records", "teacher_check"],
  },
  {
    id: "16_teacher_teach_entry",
    label: "教学系统入口 / 课堂链路前台",
    source_path: "frontend/teacher_teach.html",
    url_path: "/frontend/teacher_teach.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "teacher_display_candidate",
    audit_focus: ["teaching_entry", "classroom_submission_link", "not_full_display"],
  },
  {
    id: "17_r221g_precise_prep_static_prototype",
    label: "R221G 精设备课静态原型",
    source_path:
      "outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/1013R_R221G_PRECISE_PREP_WORKBENCH_STATIC_PROTOTYPE/r221g_r97b_precise_prep_workbench_static_prototype.html",
    url_path:
      "/outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/1013R_R221G_PRECISE_PREP_WORKBENCH_STATIC_PROTOTYPE/r221g_r97b_precise_prep_workbench_static_prototype.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "prep_room_recent_prototype",
    audit_focus: ["decision_card", "field_slots", "boundary_warnings"],
  },
  {
    id: "18_r220e_lesson_body_readability_sample",
    label: "R220E-P1 教案正文可读性样本",
    source_path:
      "outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/1013R_R220E_P1_CENTER_BODY_VISUAL_READABILITY_SMOKE/visual_harness/real_downpour_docx.html",
    url_path:
      "/outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/1013R_R220E_P1_CENTER_BODY_VISUAL_READABILITY_SMOKE/visual_harness/real_downpour_docx.html",
    viewport: { width: 1440, height: 1000 },
    surface_group: "lesson_body_recent_smoke",
    audit_focus: ["formal_teacher_text", "field_downweighting", "reading_density"],
  },
];

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
    const rawPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const normalized = path.normalize(rawPath.replace(/^\/+/, ""));
    const target = path.resolve(ROOT, normalized || "index.html");
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
      res.writeHead(200, { "Content-Type": CONTENT_TYPES[path.extname(target).toLowerCase()] || "application/octet-stream" });
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
          reject(new Error(`${method} ${url} -> ${res.statusCode}: ${body.slice(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
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
    const payload = JSON.stringify({ id, method, params });
    const promise = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.ws.send(payload);
    return promise;
  }

  waitForEvent(method, timeoutMs = 5000) {
    const existing = this.events.find((item) => item.method === method);
    if (existing) return Promise.resolve(existing);
    return new Promise((resolve) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const event = this.events.find((item) => item.method === method);
        if (event || Date.now() - start > timeoutMs) {
          clearInterval(timer);
          resolve(event || null);
        }
      }, 50);
    });
  }

  close() {
    try {
      this.ws.close();
    } catch (_) {
      // best effort
    }
  }
}

function pngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 24 || buf.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function waitForDebugger(port) {
  const url = `http://127.0.0.1:${port}/json/version`;
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try {
      return await requestJson(url);
    } catch (_) {
      await sleep(200);
    }
  }
  throw new Error("Edge remote debugging endpoint did not start");
}

async function evaluateSafe(client, expression) {
  try {
    return await client.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
      timeout: 5000,
    });
  } catch (error) {
    return { exceptionDetails: { text: error.message } };
  }
}

async function captureCase(browserPort, baseUrl, item) {
  const pageUrl = `${baseUrl}${item.url_path}`;
  const target = await requestJson(`http://127.0.0.1:${browserPort}/json/new?${encodeURIComponent(pageUrl)}`, "PUT");
  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.open();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Log.enable").catch(() => {});
  const { width, height, mobile } = item.viewport;
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: Boolean(mobile),
  });
  await client.send("Page.navigate", { url: pageUrl });
  await client.waitForEvent("Page.loadEventFired", 8000);
  await sleep(1000);
  await evaluateSafe(client, "document.fonts && document.fonts.ready ? document.fonts.ready : true");
  if (item.before_capture) {
    await evaluateSafe(client, item.before_capture);
    await sleep(700);
  }
  await evaluateSafe(client, "window.scrollTo(0, 0)");
  const metricsResult = await evaluateSafe(
    client,
    `(() => {
      const root = document.documentElement;
      const bodyText = document.body ? document.body.innerText || "" : "";
      const bySelector = (sel) => document.querySelectorAll(sel).length;
      return {
        title: document.title,
        location: location.href,
        body_text_length: bodyText.length,
        body_text_sample: bodyText.slice(0, 900),
        scroll_width: Math.max(root.scrollWidth, root.clientWidth),
        scroll_height: Math.max(root.scrollHeight, root.clientHeight),
        viewport_width: innerWidth,
        viewport_height: innerHeight,
        counts: {
          buttons: bySelector("button"),
          links: bySelector("a"),
          inputs: bySelector("input, textarea, select"),
          tables: bySelector("table"),
          cards: bySelector(".card, .panel, .material-card, .queue-item, .dim-card, .review-scene, .nb-card"),
          topbars: bySelector(".topbar, .navbar, header"),
          bottom_bars: bySelector(".bottom, .footerbar, .mobile-bottom, .composer, .composer-bar, .mobile-bottom-nav"),
          hidden_screens: bySelector(".screen.hidden, [hidden]")
        }
      };
    })()`
  );
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
  });
  const fileName = `${item.id}.png`;
  const outPath = path.join(SCREENSHOT_DIR, fileName);
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, "base64"));
  const stat = fs.statSync(outPath);
  const size = pngSize(outPath);
  await client.send("Page.close").catch(() => {});
  client.close();
  return {
    ...item,
    page_url: pageUrl,
    screenshot: `screenshots/${fileName}`,
    screenshot_bytes: stat.size,
    screenshot_dimensions: size,
    dom_metrics: metricsResult.result && metricsResult.result.value ? metricsResult.result.value : null,
    pass: stat.size > 1500 && Boolean(metricsResult.result && metricsResult.result.value && metricsResult.result.value.body_text_length > 0),
  };
}

async function main() {
  ensureDir(SCREENSHOT_DIR);
  const staticServer = await startStaticServer();
  const staticPort = staticServer.address().port;
  const browserPort = await getFreePort();
  const profileDir = path.join(AUDIT_DIR, ".edge-profile");
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

  const startedAt = new Date().toISOString();
  const baseUrl = `http://127.0.0.1:${staticPort}`;
  const records = [];
  let fatal = null;
  try {
    await waitForDebugger(browserPort);
    for (const item of CASES) {
      try {
        records.push(await captureCase(browserPort, baseUrl, item));
        process.stdout.write(`captured ${item.id}\n`);
      } catch (error) {
        records.push({
          ...item,
          page_url: `${baseUrl}${item.url_path}`,
          pass: false,
          error: error.stack || String(error),
        });
        process.stdout.write(`failed ${item.id}: ${error.message}\n`);
      }
    }
  } catch (error) {
    fatal = error.stack || String(error);
  } finally {
    edge.kill();
    staticServer.close();
  }

  const endedAt = new Date().toISOString();
  const manifest = {
    stage: "1013V_VISUAL_SYSTEM_POLISH_LINE",
    phase: "V0_VISUAL_AUDIT",
    boundary: {
      visual_audit_only: true,
      frontend_modified: false,
      backend_modified: false,
      provider_called: false,
      database_written: false,
      feishu_written: false,
      formal_apply_performed: false,
    },
    environment: {
      root: ROOT,
      browser: EDGE,
      static_server_base_url: baseUrl,
      started_at: startedAt,
      ended_at: endedAt,
    },
    case_count: records.length,
    pass_count: records.filter((item) => item.pass).length,
    fail_count: records.filter((item) => !item.pass).length,
    records,
    fatal,
  };
  fs.writeFileSync(path.join(AUDIT_DIR, "screenshot_manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  fs.writeFileSync(path.join(AUDIT_DIR, "visual_smoke_result.json"), JSON.stringify({
    stage: manifest.stage,
    phase: manifest.phase,
    visual_smoke_completed: !fatal,
    all_cases_passed: !fatal && manifest.fail_count === 0,
    case_count: manifest.case_count,
    pass_count: manifest.pass_count,
    fail_count: manifest.fail_count,
    generated_files: records.filter((item) => item.screenshot).map((item) => item.screenshot),
    boundary: manifest.boundary,
  }, null, 2), "utf8");
  if (fatal) {
    console.error(fatal);
    process.exitCode = 1;
  } else if (manifest.fail_count > 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
