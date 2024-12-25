const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 24, 32, 64, 128, 256, 512];

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/icon.svg'));

  // Generate PNG files
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `../public/icon-${size}.png`));
  }

  // Generate specific files needed
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../public/logo192.png'));

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/logo512.png'));

  // Generate ICO file (Windows icon)
  const icoBuffer = await require('png-to-ico')(path.join(__dirname, '../public/icon-256.png'));
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
}

generateIcons().catch(console.error); 