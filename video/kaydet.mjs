// hikaye.html'i kare kare yakalayıp MP4'e çevirir.
//
//   node video/kaydet.mjs                        → video/verimx7-hikaye.mp4 (1920×1080, 30 fps)
//   node video/kaydet.mjs --dikey                → video/verimx7-hikaye-dikey.mp4 (1080×1920, Reels/Shorts)
//   node video/kaydet.mjs --stills 2,7,12,17,21,25,29   → yalnızca o saniyelerin PNG'leri
//
// Gerekenler: ffmpeg, Google Chrome ve playwright-core. playwright-core bu
// projenin bağımlılığı değil; başka bir yerde kuruluysa PW_MODULE ile
// gösterin:  PW_MODULE=/yol/node_modules/playwright-core/index.mjs node video/kaydet.mjs

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const { chromium } = await import(process.env.PW_MODULE ?? "playwright-core");

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const fps = Number(opt("fps", 30));
const vertical = args.includes("--dikey");
const out = path.resolve(opt("out", path.join(here, vertical ? "verimx7-hikaye-dikey.mp4" : "verimx7-hikaye.mp4")));
const stills = opt("stills");
const chrome = process.env.CHROME ?? "/usr/bin/google-chrome-stable";

const browser = await chromium.launch({
  executablePath: chrome,
  args: ["--allow-file-access-from-files", "--font-render-hinting=none"],
});
const viewport = vertical ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
const url = pathToFileURL(path.join(here, "hikaye.html"));
if (vertical) url.search = "?dikey";
await page.goto(url.href);
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);
const stage = page.locator("#stage");

if (stills) {
  for (const s of stills.split(",").map(Number)) {
    await page.evaluate((t) => window.render(t), s);
    const file = path.join(path.dirname(out), `kare-${String(s).replace(".", "_")}.png`);
    await stage.screenshot({ path: file });
    console.log(file);
  }
  await browser.close();
  process.exit(0);
}

const ffmpeg = spawn(
  "ffmpeg",
  [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", out,
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);

const total = Math.round(duration * fps);
for (let f = 0; f < total; f++) {
  await page.evaluate((t) => window.render(t), f / fps);
  const jpg = await stage.screenshot({ type: "jpeg", quality: 95 });
  if (!ffmpeg.stdin.write(jpg)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
  if (f % fps === 0) process.stdout.write(`\r${Math.round((f / total) * 100)}%`);
}
ffmpeg.stdin.end();
await new Promise((r, j) => ffmpeg.on("close", (c) => (c === 0 ? r() : j(new Error(`ffmpeg ${c}`)))));
await browser.close();
console.log(`\r100% → ${out}`);
