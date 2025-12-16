const sharp = require('sharp');
const path = require('path');

async function rotateImage() {
    const inputPath = path.join(__dirname, 'public', 'hero2.webp');
    const outputPath = path.join(__dirname, 'public', 'hero2.webp');

    console.log('Rotating hero2.webp 90° counter-clockwise...');

    // Read, rotate, and save
    await sharp(inputPath)
        .rotate(270) // 270 = 90° counter-clockwise
        .toBuffer()
        .then(data => sharp(data).toFile(outputPath));

    console.log('Done! hero2.webp has been rotated.');
}

rotateImage().catch(console.error);
