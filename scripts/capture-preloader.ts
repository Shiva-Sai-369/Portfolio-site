/**
 * Records the intro (dot fills -> "STILL LEARNING." -> "ALWAYS BUILDING." ->
 * hero reveal) to captures/preloader.webm, then prints the ffmpeg command that
 * turns it into docs/preloader-demo.gif with the dead time trimmed off.
 *
 * Dev-only. Needs the dev server running in another terminal:
 *   npm run dev
 *   npm run capture:preloader        (BASE_URL=... to point elsewhere)
 */
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = "captures";
const VIDEO = `${OUT_DIR}/preloader.webm`; // forward slashes work for ffmpeg on every OS
const VIEWPORT = { width: 1920, height: 1080 };
const SEEN_KEY = "intro-seen"; // components/Preloader.tsx skips the intro when this is set
const LEAD = 0.1; // s of plain dark panel kept before the dot appears
const TAIL = 1000; // ms held on the finished hero

const browser = await chromium.launch();

// Warm-up visit so Vite has transformed every module (and finished any
// dependency re-optimisation reload) before the recorded load.
const warm = await browser.newPage();
await warm.goto(BASE_URL);
await warm.locator("#home").waitFor({ timeout: 60_000 });
await warm.close();

const context = await browser.newContext({
  viewport: VIEWPORT,
  reducedMotion: "no-preference", // reduced motion skips the intro too
  recordVideo: { dir: OUT_DIR, size: VIEWPORT },
});
// Before any page script runs: clear sessionStorage so the intro always plays,
// and note (on the page's clock) when the preloader panel mounts.
await context.addInitScript(() => {
  sessionStorage.clear();
  new MutationObserver((_, observer) => {
    if (!document.querySelector('[role="status"]')) return;
    (window as any).__introAt = performance.now();
    observer.disconnect();
  }).observe(document, { childList: true, subtree: true });
});

const page = await context.newPage();
await page.goto(BASE_URL);

// The hero is up once the visible headline's last letter has landed and the
// subline has faded in. The first #home h1 is the visible one; the others are
// the hidden tone and the copies inside the hover disc.
const heroAt = await page
  .waitForFunction(
    () => {
      const layer = document.querySelector("#home h1")?.parentElement;
      const chars = layer?.querySelectorAll(".hero-char");
      const sub = layer?.querySelector(".hero-sub");
      if (!chars?.length || !sub) return false;
      const done =
        document.documentElement.dataset.intro === "done" &&
        new DOMMatrix(getComputedStyle(chars[chars.length - 1]).transform).isIdentity &&
        getComputedStyle(sub).opacity === "1";
      return done && performance.now();
    },
    null,
    { timeout: 30_000, polling: 50 },
  )
  .then((h) => h.jsonValue() as Promise<number>);
await page.waitForTimeout(TAIL);

// The video's first frame is the page's first paint, so page timestamps minus
// that are video timestamps (Node's clock is off by however long startup took).
const { introAt, firstPaint } = await page.evaluate(() => ({
  introAt: (window as any).__introAt as number,
  firstPaint: performance.getEntriesByName("first-paint")[0]?.startTime ?? 0,
}));
const start = Math.max(0, (introAt - firstPaint) / 1000 - LEAD);
const end = (heroAt - firstPaint + TAIL) / 1000;

const video = page.video()!;
await context.close();
await video.saveAs(VIDEO);
await video.delete();
await browser.close();

const ss = start.toFixed(2);
const t = (end - start).toFixed(2);
console.log(`Saved ${VIDEO} (intro at ${ss}s, ${t}s long).\n`);
console.log("Make the README GIF with:\n");
console.log(
  `ffmpeg -y -ss ${ss} -t ${t} -i ${VIDEO} -vf "fps=12,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" -loop 0 docs/preloader-demo.gif`,
);
