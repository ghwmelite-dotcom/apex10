import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const iconsDir = path.join(publicDir, 'icons');
const splashDir = path.join(publicDir, 'apple-splash');

// Ensure directories exist
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
if (!fs.existsSync(splashDir)) fs.mkdirSync(splashDir, { recursive: true });

// Aurora gradient colors
const AURORA_CYAN = '#00FFD1';
const AURORA_BLUE = '#00D4FF';
const AURORA_PURPLE = '#8B5CF6';
const BG_PRIMARY = '#030712';

// Create base icon SVG with aurora gradient
function createIconSVG(size, maskable = false) {
  const padding = maskable ? size * 0.2 : size * 0.1;
  const innerSize = size - (padding * 2);
  const cornerRadius = size * 0.2;
  const fontSize = size * 0.35;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${AURORA_BLUE};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${AURORA_CYAN};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${AURORA_PURPLE};stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${size * 0.02}" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  ${maskable ? `<rect width="${size}" height="${size}" fill="${BG_PRIMARY}"/>` : ''}
  <rect
    x="${padding}"
    y="${padding}"
    width="${innerSize}"
    height="${innerSize}"
    rx="${cornerRadius}"
    fill="url(#auroraGrad)"
    filter="url(#glow)"
  />
  <text
    x="50%"
    y="54%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="700"
    font-size="${fontSize}px"
    fill="${BG_PRIMARY}"
  >A10</text>
</svg>`;
}

// Create splash screen SVG
function createSplashSVG(width, height) {
  const logoSize = Math.min(width, height) * 0.2;
  const fontSize = logoSize * 0.35;
  const orbSize = Math.max(width, height) * 0.5;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${AURORA_BLUE};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${AURORA_CYAN};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${AURORA_PURPLE};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="orbCyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${AURORA_CYAN};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:${AURORA_CYAN};stop-opacity:0" />
    </radialGradient>
    <radialGradient id="orbPurple" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${AURORA_PURPLE};stop-opacity:0.25" />
      <stop offset="100%" style="stop-color:${AURORA_PURPLE};stop-opacity:0" />
    </radialGradient>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="${logoSize * 0.1}" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${BG_PRIMARY}"/>

  <!-- Gradient orbs -->
  <ellipse cx="${width * 0.3}" cy="${height * 0.3}" rx="${orbSize}" ry="${orbSize}" fill="url(#orbCyan)"/>
  <ellipse cx="${width * 0.7}" cy="${height * 0.7}" rx="${orbSize * 0.8}" ry="${orbSize * 0.8}" fill="url(#orbPurple)"/>

  <!-- Logo -->
  <g transform="translate(${width/2 - logoSize/2}, ${height/2 - logoSize/2})">
    <rect
      width="${logoSize}"
      height="${logoSize}"
      rx="${logoSize * 0.2}"
      fill="url(#auroraGrad)"
      filter="url(#glow)"
    />
    <text
      x="${logoSize/2}"
      y="${logoSize * 0.54}"
      dominant-baseline="middle"
      text-anchor="middle"
      font-family="system-ui, -apple-system, sans-serif"
      font-weight="700"
      font-size="${fontSize}px"
      fill="${BG_PRIMARY}"
    >A10</text>
  </g>

  <!-- Brand name below logo -->
  <text
    x="${width/2}"
    y="${height/2 + logoSize/2 + logoSize * 0.4}"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="600"
    font-size="${logoSize * 0.25}px"
    fill="white"
  >Apex10</text>
</svg>`;
}

// Icon sizes to generate
const iconSizes = [48, 72, 96, 128, 144, 152, 180, 192, 384, 512];

// iOS splash screen sizes
const splashSizes = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732' },  // iPad Pro 12.9"
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388' },  // iPad Pro 11"
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048' },  // iPad Air
  { width: 1290, height: 2796, name: 'apple-splash-1290-2796' },  // iPhone 15 Pro Max
  { width: 1179, height: 2556, name: 'apple-splash-1179-2556' },  // iPhone 15 Pro
  { width: 1170, height: 2532, name: 'apple-splash-1170-2532' },  // iPhone 14 Pro
  { width: 1284, height: 2778, name: 'apple-splash-1284-2778' },  // iPhone 14 Pro Max
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436' },  // iPhone X/XS/11 Pro
  { width: 1242, height: 2688, name: 'apple-splash-1242-2688' },  // iPhone XS Max
  { width: 828, height: 1792, name: 'apple-splash-828-1792' },    // iPhone XR/11
  { width: 1242, height: 2208, name: 'apple-splash-1242-2208' },  // iPhone 8 Plus
  { width: 750, height: 1334, name: 'apple-splash-750-1334' },    // iPhone 8/SE2
  { width: 640, height: 1136, name: 'apple-splash-640-1136' },    // iPhone SE
];

async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const size of iconSizes) {
    // Regular icon
    const svg = createIconSVG(size, false);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`  Created icon-${size}x${size}.png`);
  }

  // Maskable icons (with extra padding for safe zone)
  for (const size of [192, 512]) {
    const svg = createIconSVG(size, true);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-maskable-${size}x${size}.png`));
    console.log(`  Created icon-maskable-${size}x${size}.png`);
  }

  // Apple touch icon (180x180)
  const appleSvg = createIconSVG(180, false);
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('  Created apple-touch-icon.png');
}

async function generateSplashScreens() {
  console.log('\nGenerating iOS splash screens...');

  for (const { width, height, name } of splashSizes) {
    const svg = createSplashSVG(width, height);
    await sharp(Buffer.from(svg))
      .resize(width, height)
      .png()
      .toFile(path.join(splashDir, `${name}.png`));
    console.log(`  Created ${name}.png`);
  }
}

async function main() {
  try {
    await generateIcons();
    await generateSplashScreens();
    console.log('\nAll PWA assets generated successfully!');
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
}

main();
