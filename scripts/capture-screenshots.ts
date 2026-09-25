/**
 * README screenshots, saved to docs/: the hero, the first project card, and
 * the FORMAL / CASUAL tone toggle caught halfway through its crossfade.
 *
 * Dev-only. Needs the dev server running in another terminal:
 *   npm run dev
 *   npm run capture:screenshots      (BASE_URL=... to point elsewhere)
 */
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = "docs";
const VIEWPORT = { width: 1920, height: 1080 };
const SEEN_KEY = "intro-seen"; // components/Preloader.tsx skips the intro when this is set

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT });
// Mark the intro as seen so the page opens straight on the finished hero.
await context.addInitScript((key) => sessionStorage.setItem(key, "1"), SEEN_KEY);

const page = await context.newPage();
await page.goto(BASE_URL);
await page.locator("#home h1").first().waitFor({ timeout: 60_000 });
// Hero photo decoded and web fonts in. (Not "networkidle": the page never goes quiet.)
await page.waitForFunction(
  async () =>
    (await document.fonts.ready) &&
    [...document.querySelectorAll<HTMLImageElement>("#home img")].every((i) => i.complete),
);
await page.waitForTimeout(500);

await page.screenshot({ path: `${OUT_DIR}/hero.png` });

// Tone toggle: flip it, then freeze every opacity transition at its halfway
// point so both copies show at once. (A DOM click, not a mouse one, keeps the
// custom cursor out of the shot.)
const toggle = page.getByRole("button", { name: /Switch tone/ });
await toggle.evaluate((b: HTMLElement) => b.click());
await page.evaluate(async () => {
  await new Promise(requestAnimationFrame);
  for (const a of document.getAnimations()) {
    if (a instanceof CSSTransition && a.transitionProperty === "opacity") {
      a.pause();
      a.currentTime = Number(a.effect?.getTiming().duration) / 2;
    }
  }
});
await page.screenshot({ path: `${OUT_DIR}/tone-toggle.png` });
await page.evaluate(() => {
  for (const a of document.getAnimations()) if (a instanceof CSSTransition) a.finish();
});
await toggle.evaluate((b: HTMLElement) => b.click()); // back to formal
await page.waitForTimeout(600);

// Projects. An image that lands after ScrollTrigger has measured the page and
// changes the layout above this section leaves the cards' scrubs offset (the
// third-party GitHub chart did this, ~16% of a "recede", before it got a
// reserved 663x104 size; that size is only right while ghchart keeps it).
// Wait for every image, then replay window "load": ScrollTrigger (and
// ProjectsStack.tsx) re-measure on it, synchronously.
await page.waitForFunction(() => [...document.images].every((i) => i.complete));
await page.evaluate(() => window.dispatchEvent(new Event("load")));

// Scroll until the first card fills the screen (floored: a pixel past its top
// starts the next card's scrub), then wait for its exact resting state: full
// size, no veil, the nav recoloured for it and no transition still running.
await page.evaluate(() => {
  const card = document.querySelector("#projects .project-panel")!;
  const top = Math.floor(card.getBoundingClientRect().top + window.scrollY);
  window.scrollTo({ top, behavior: "instant" });
});
await page.waitForFunction(() => {
  const card = document.querySelector("#projects .project-panel")!;
  const inner = card.querySelector(".project-inner")!;
  const veil = card.querySelector(".project-veil")!;
  const moving = document
    .getAnimations()
    .some((a) => a.playState === "running" && a.effect?.getComputedTiming().endTime !== Infinity);
  return (
    Math.abs(card.getBoundingClientRect().top) < 1 &&
    new DOMMatrix(getComputedStyle(inner).transform).a === 1 &&
    getComputedStyle(veil).opacity === "0" &&
    document.documentElement.style.getPropertyValue("--ui-fg") !== "" && // set by ProjectsStack's setUI
    !moving
  );
});
await page.screenshot({ path: `${OUT_DIR}/projects.png` });

await browser.close();
console.log(`Saved ${OUT_DIR}/hero.png, ${OUT_DIR}/tone-toggle.png and ${OUT_DIR}/projects.png.`);
