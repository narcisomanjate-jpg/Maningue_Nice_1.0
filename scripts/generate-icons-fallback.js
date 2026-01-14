// scripts/generate-icons-fallback.js
// Fallback generator: copies the provided icon-source.png into expected sizes/locations without resizing.
// Usage: node scripts/generate-icons-fallback.js [source]

const fs = require('fs');
const path = require('path');

const srcArg = process.argv[2] || path.join(__dirname, '..', 'public', 'icon-source.png');
if (!fs.existsSync(srcArg)) {
  console.error('Source image not found:', srcArg);
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const publicRoot = path.join(projectRoot, 'public');
const androidRes = path.join(projectRoot, 'Android', 'app', 'src', 'main', 'res');

// Ensure public icons
const dest192 = path.join(publicRoot, 'icon-192.png');
const dest512 = path.join(publicRoot, 'icon-512.png');
fs.copyFileSync(srcArg, dest192);
fs.copyFileSync(srcArg, dest512);
console.log('Copied to', dest192, dest512);

// Copy to Android mipmap densities (as-is)
const densities = ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi'];
if (!fs.existsSync(path.join(projectRoot, 'Android'))) fs.mkdirSync(path.join(projectRoot, 'Android'));
if (!fs.existsSync(path.join(projectRoot, 'Android', 'splash-resources'))) fs.mkdirSync(path.join(projectRoot, 'Android', 'splash-resources'));

densities.forEach(d => {
  const out = path.join(projectRoot, 'Android', 'splash-resources', `icon-${d}.png`);
  fs.copyFileSync(srcArg, out);
  console.log('Copied to', out);
});

// If Android project exists, copy into mipmap folders
if (fs.existsSync(androidRes)) {
  densities.forEach(d => {
    const mipmap = `mipmap-${d}`;
    const destDir = path.join(androidRes, mipmap);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, 'ic_launcher.png');
    fs.copyFileSync(srcArg, dest);
    console.log('Applied to Android res:', dest);
  });
}

console.log('Fallback icon application complete. Note: images were not resized; Android will scale them at runtime.');