// scripts/apply-splash.js
// Usage: node scripts/apply-splash.js splash1
const fs = require('fs');
const path = require('path');

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node scripts/apply-splash.js <splash1|splash2|splash3>');
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const splashSrc = path.join(projectRoot, 'public', 'splash', arg + '.png');
if (!fs.existsSync(splashSrc)) {
  console.error('Splash source not found:', splashSrc);
  process.exit(1);
}

// Update index.html default splash
const indexHtml = path.join(projectRoot, 'index.html');
let html = fs.readFileSync(indexHtml, 'utf8');
html = html.replace(/<img src=\"\/splash\/[^"]+\" alt=\"Splash\"/, `<img src="/splash/${arg}.png" alt="Splash"`);
fs.writeFileSync(indexHtml, html, 'utf8');
console.log('Updated index.html to use', arg + '.png');

// Copy android resources if Android project exists
const androidResBase = path.join(projectRoot, 'Android', 'app', 'src', 'main', 'res');
if (fs.existsSync(androidResBase)) {
  const densities = ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi'];
  densities.forEach(d => {
    const src = path.join(projectRoot, 'Android', 'splash-resources', `${arg}-${d}.png`);
    if (fs.existsSync(src)) {
      const destDir = path.join(androidResBase, `mipmap-${d}`);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      const dest = path.join(destDir, 'splash.png');
      fs.copyFileSync(src, dest);
      console.log('Copied to', dest);
    }
  });
  console.log('Native splash resources applied (if present).');
} else {
  console.log('Android project not found; only web splash updated.');
}
