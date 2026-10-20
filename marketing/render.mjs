// Vyrenderuje všechny materiály z jobs.mjs do out/.
//
//   npm run render                 → všechno
//   npm run render -- web/         → jen úlohy, jejichž výstup obsahuje „web/“
//
// Prohlížeč: CHROME_PATH, jinak první nalezený Chromium (Brave, Chrome…).
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { serve } from "./serve.mjs";
import { jobs, ico } from "./jobs.mjs";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const WIN = process.env.LOCALAPPDATA ?? "";
const PFILES = process.env["PROGRAMFILES"] ?? "C:\\Program Files";
const PFILES86 = process.env["PROGRAMFILES(X86)"] ?? "C:\\Program Files (x86)";
const CANDIDATES = [
  process.env.CHROME_PATH,
  // Windows — Chrome
  `${PFILES}\\Google\\Chrome\\Application\\chrome.exe`,
  `${PFILES86}\\Google\\Chrome\\Application\\chrome.exe`,
  `${WIN}\\Google\\Chrome\\Application\\chrome.exe`,
  // Windows — Brave
  `${PFILES}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
  `${WIN}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
  // Windows — Edge
  `${PFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
  `${PFILES86}\\Microsoft\\Edge\\Application\\msedge.exe`,
  // Linux
  "/opt/brave.com/brave/brave",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  // macOS
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
].filter(Boolean);
const executablePath = CANDIDATES.find((p) => existsSync(p));
if (!executablePath) throw new Error("Nenašel jsem Chromium — nastav CHROME_PATH.");

const filters = process.argv.slice(2);
const todo = jobs.filter((j) => filters.length === 0 || filters.some((f) => j.out.includes(f)));

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const debug = process.env.DEBUG_RENDER ? (...a) => console.error("  ·", ...a) : () => {};
// Každý worker má vlastní prohlížeč s jedinou (tedy vždy aktivní) záložkou —
// snímek záložky v pozadí umí headless Chromium zaseknout.
const launch = () =>
  puppeteer.launch({
    executablePath,
    headless: true,
    protocolTimeout: 60_000,
    args: [
      "--disable-gpu",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      "--font-render-hinting=none",
      "--disable-lcd-text",
    ],
  });

let done = 0;
const failed = [];
const queue = [...todo];
async function worker() {
  const browser = await launch();
  const [page] = await browser.pages();
  let current = "";
  page.on("pageerror", (e) => console.error(`  ✗ ${current}: ${e.message}`));
  page.on("response", (r) => r.status() >= 400 && !r.url().endsWith("favicon.ico") && console.error(`  ! ${current}: ${r.status()} ${r.url()}`));
  for (let job; (job = queue.shift()); ) {
    current = job.out;
    debug("začínám", job.out);
    try {
    const qs = new URLSearchParams({ ...job.params, w: job.w, h: job.h });
    await page.setViewport({ width: job.w, height: job.h, deviceScaleFactor: job.scale ?? 1 });
    await page.goto(`${base}/pages/${job.page}.html?${qs}`, { waitUntil: "load", timeout: 20_000 });
    debug("načteno", job.out);
    await page.waitForFunction("window.__ready === true", { timeout: 15_000, polling: 100 });
    // Průhledné výstupy: kit.css barví html i body, tady se to zruší.
    if (job.transparent) await page.addStyleTag({ content: "html,body{background:transparent!important}" });
    const out = join(ROOT, "out", job.out);
    await mkdir(dirname(out), { recursive: true });
    if (out.endsWith(".svg")) {
      // Vektorové logo: první <svg class="logo"> na stránce, bez pevných rozměrů.
      const svg = await page.evaluate(() => {
        const el = document.querySelector("svg.logo").cloneNode(true);
        for (const a of ["width", "height", "style", "class"]) el.removeAttribute(a);
        return el.outerHTML.replace(/>\s+</g, "><");
      });
      await writeFile(out, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
    } else if (out.endsWith(".pdf")) {
      await page.pdf({ path: out, width: `${job.w}px`, height: `${job.h}px`, printBackground: true, pageRanges: "1" });
    } else {
      await page.screenshot({
        path: out,
        type: out.endsWith(".jpg") ? "jpeg" : "png",
        quality: out.endsWith(".jpg") ? 92 : undefined,
        omitBackground: Boolean(job.transparent),
        captureBeyondViewport: false,
      });
    }
    console.log(`  ✓ ${job.out}  (${++done}/${todo.length})`);
    } catch (e) {
      failed.push(job.out);
      console.error(`  ✗ ${job.out}: ${e.message.split("\n")[0]}`);
    }
  }
  await browser.close();
}
await Promise.all(Array.from({ length: Math.min(4, todo.length) }, worker));
server.close();

// favicon.ico: PNG uvnitř ICO (umí všechny prohlížeče od IE Vista dál).
if (ico.from.every((f) => todo.some((j) => j.out === f))) {
  const pngs = await Promise.all(ico.from.map((f) => readFile(join(ROOT, "out", f))));
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2); // typ: ikona
  head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach((png, i) => {
    const e = 6 + 16 * i;
    const w = png.readUInt32BE(16);
    const h = png.readUInt32BE(20);
    head.writeUInt8(w >= 256 ? 0 : w, e);
    head.writeUInt8(h >= 256 ? 0 : h, e + 1);
    head.writeUInt16LE(1, e + 4); // barevné roviny
    head.writeUInt16LE(32, e + 6); // bitů na pixel
    head.writeUInt32LE(png.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  const out = join(ROOT, "out", ico.out);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.concat([head, ...pngs]));
  console.log(`  ✓ ${ico.out}`);
}
if (failed.length) {
  console.error(`\n${failed.length} selhalo: ${failed.join(", ")}`);
  process.exit(1);
}
