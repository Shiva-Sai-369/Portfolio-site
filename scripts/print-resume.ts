/**
 * Prints resume.html to public/resume.pdf, the file behind the footer's
 * "Download résumé" button. Edit resume.html, then:
 *   npm run dev
 *   npm run resume:pdf      (BASE_URL=... to point elsewhere)
 */
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "public/resume.pdf";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${BASE_URL}/resume.html`);
// Computer Modern comes from a CDN. Fail here rather than print in the fallback serif.
await page.waitForFunction(async () => {
  await document.fonts.ready;
  const cmu = [...document.fonts].filter((f) => f.family.replace(/"/g, "") === "CMU Serif");
  return cmu.some((f) => f.status === "loaded") && !cmu.some((f) => f.status === "error");
});
const pdf = await page.pdf({ path: OUT, printBackground: true, preferCSSPageSize: true });
await browser.close();

const pages = pdf.toString("latin1").match(/\/Type\s*\/Page\b(?!s)/g)?.length ?? 0;
console.log(`Saved ${OUT} (${pages} page${pages === 1 ? "" : "s"}).`);
if (pages > 1) console.warn("The résumé no longer fits on one page.");
