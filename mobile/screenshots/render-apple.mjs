import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, 'generate-apple.html');
const outDir = __dirname;

// Apple App Store required sizes
const sizes = [
  { width: 1284, height: 2778, label: '6.5' },  // 6.5" display
  { width: 1320, height: 2868, label: '6.9' },  // 6.9" display
];

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
});

for (const size of sizes) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: size.width, height: size.height });
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`);

  // Wait for fonts
  await page.waitForTimeout(1000);

  const slides = await page.$$('.screenshot');
  for (let i = 0; i < slides.length; i++) {
    const id = `slide-${i + 1}`;
    await page.evaluate((activeId) => {
      document.querySelectorAll('.screenshot').forEach(el => el.classList.remove('active'));
      document.getElementById(activeId).classList.add('active');
    }, id);
    const filename = `app-store-${size.label}-${i + 1}.png`;
    await page.screenshot({ path: join(outDir, filename) });
    console.log(`Saved ${filename} (${size.width}x${size.height})`);
  }

  await page.close();
}

await browser.close();
console.log('Done!');
