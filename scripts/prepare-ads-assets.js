const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const GALLERY_DIR = path.join(__dirname, '../public/gallery');
const OUTPUT_DIR = path.join(__dirname, '../public/google-ads-assets');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Best source images
const SOURCES = [
    'Bride_Aish_1.jpg',
    'Bride_Raadhya_1.jpg',
    'Bride_Saumya _1.jpg', // Note: space in filename
    'Bride_Ananya_1.jpg',
    'Bride_Rad_1.jpg'
];

const SPECS = [
    { name: 'landscape', width: 1200, height: 628 },
    { name: 'square', width: 1200, height: 1200 },
    { name: 'portrait', width: 960, height: 1200 } // 4:5 ratio
];

async function processImage(filename) {
    const inputPath = path.join(GALLERY_DIR, filename);

    // Clean name for output
    let cleanName = filename.replace(/\.(jpg|jpeg|png)$/i, '').replace(/\s+/g, '_').toLowerCase();
    // Remove 'bride_' prefix for cleaner asset names if preferred, or keep it. Let's keep it but lowercase.

    if (!fs.existsSync(inputPath)) {
        console.warn(`Warning: Source file not found: ${filename}`);
        return;
    }

    console.log(`Processing ${filename}...`);

    for (const spec of SPECS) {
        const outputName = `${cleanName}_${spec.name}.jpg`;
        const outputPath = path.join(OUTPUT_DIR, outputName);

        try {
            await sharp(inputPath)
                .rotate() // Auto-rotate based on EXIF
                .resize(spec.width, spec.height, {
                    fit: 'cover',
                    position: 'top' // Focus on faces which are usually at the top
                })
                .jpeg({
                    quality: 90,
                    mozjpeg: true // Better compression
                })
                .toFile(outputPath);

            console.log(`  Expected: ${spec.width}x${spec.height} -> Created: ${outputName}`);
        } catch (err) {
            console.error(`  Error processing ${spec.name} for ${filename}:`, err);
        }
    }
}

async function main() {
    console.log("Starting Google Ads Asset Generation...");

    for (const source of SOURCES) {
        await processImage(source);
    }

    console.log("\nDone! Assets saved to public/google-ads-assets/");
}

main().catch(console.error);
