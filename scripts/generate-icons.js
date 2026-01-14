// scripts/generate-icons.js
// Generates web and Android icon assets from a source image using sharp.
// Usage: node scripts/generate-icons.js <source-image>

const fs = require('fs');
const path = require('path');

const sharpAvailable = (() => {
  try {
    require.resolve('sharp');
    return true;
  } catch (e) {
    return false;
  }
})();

if (!sharpAvailable) {
  console.error('This script requires "sharp". Run: npm install --save-dev sharp');
  process.exit(1);
}

const sharp = require('sharp');

const src = process.argv[2] || path.join(__dirname, '..', 'public', 'icon-source.png');
if (!fs.existsSync(src)) {
  console.error('Source image not found:', src);
  console.error('Place your icon image at public/icon-source.png or pass a path as argument.');
  process.exit(1);
}

const outWeb = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outWeb)) fs.mkdirSync(outWeb, { recursive: true });

const sizes = [48, 72, 96, 144, 192, 256, 384, 512, 1024];
(async () => {
  try {
    const img = sharp(src).resize({ width: 1024, height: 1024, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });

    // Generate web icons
    await Promise.all(sizes.map(async size => {
      const out = path.join(outWeb, `icon-${size}.png`);
      await img.clone().resize(size, size).png().toFile(out);
      console.log('Generated', out);

      // also place primary sizes in public root for manifest
      if (size === 192) await fs.promises.copyFile(out, path.join(__dirname, '..', 'public', 'icon-192.png'));
      if (size === 512) await fs.promises.copyFile(out, path.join(__dirname, '..', 'public', 'icon-512.png'));
    }));

    // Generate Android mipmap assets
    const androidResBase = path.join(__dirname, '..', 'Android', 'splash-resources');
    const mipmapMap = {
      mdpi: 48,
      hdpi: 72,
      xhdpi: 96,
      xxhdpi: 144,
      xxxhdpi: 192
    };

    for (const [d, s] of Object.entries(mipmapMap)) {
      const outDir = path.join(__dirname, '..', 'Android', 'splash-resources');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const outFile = path.join(outDir, `ic_launcher_${d}.png`);
      await img.clone().resize(s, s).png().toFile(outFile);
      console.log('Generated Android mipmap', outFile);
    }

    // Adaptive icon foreground/background
    const fg = path.join(__dirname, '..', 'public', 'icons', 'icon-foreground.png');
    const bg = path.join(__dirname, '..', 'public', 'icons', 'icon-background.png');
    await img.clone().resize(432, 432).png().toFile(fg);
    await img.clone().resize(1080, 1080).png().toFile(bg);
    console.log('Generated adaptive icon assets', fg, bg);

    console.log('\nAll icons generated. Add the generated files to your Android project or run "npm run icons:apply" to try to copy them to Android resources.');
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
})();
