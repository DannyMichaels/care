import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, 'generate.html');
const outDir = __dirname;

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
});

const page = await browser.newPage();
await page.setViewportSize({ width: 1080, height: 1920 });
await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`);

const slides = await page.$$('.screenshot');
for (let i = 0; i < slides.length; i++) {
  const id = `slide-${i + 1}`;
  // hide all, show current
  await page.evaluate((activeId) => {
    document.querySelectorAll('.screenshot').forEach(el => el.classList.remove('active'));
    document.getElementById(activeId).classList.add('active');
  }, id);
  await page.screenshot({ path: join(outDir, `play-store-${i + 1}.png`) });
  console.log(`Saved play-store-${i + 1}.png`);
}

await browser.close();
console.log('Done!');
