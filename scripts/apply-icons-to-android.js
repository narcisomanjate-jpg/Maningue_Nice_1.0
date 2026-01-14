// scripts/apply-icons-to-android.js
// Copies generated icons into an Android project's mipmap folders if present
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const androidResBase = path.join(projectRoot, 'Android', 'app', 'src', 'main', 'res');
const generatedBase = path.join(projectRoot, 'Android', 'splash-resources');

if (!fs.existsSync(generatedBase)) {
  console.error('Generated icons not found in Android/splash-resources. Run npm run icons:generate first.');
  process.exit(1);
}

if (!fs.existsSync(androidResBase)) {
  console.error('Android project res directory not found. Ensure Capacitor Android platform has been added.');
  process.exit(1);
}

const mapping = {
  mdpi: 'mipmap-mdpi',
  hdpi: 'mipmap-hdpi',
  xhdpi: 'mipmap-xhdpi',
  xxhdpi: 'mipmap-xxhdpi',
  xxxhdpi: 'mipmap-xxxhdpi'
};

Object.keys(mapping).forEach(d => {
  const src = path.join(generatedBase, `ic_launcher_${d}.png`);
  if (!fs.existsSync(src)) {
    console.warn('Source icon missing for', d, src);
    return;
  }
  const destDir = path.join(androidResBase, mapping[d]);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, 'ic_launcher.png');
  fs.copyFileSync(src, dest);
  console.log('Copied', src, '->', dest);
});

console.log('Icons applied to Android project. You may need to update Android XML adaptative icon resources manually.');
