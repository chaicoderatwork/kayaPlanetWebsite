const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_DIR = path.join(__dirname, '../public/gallery-assets');
const OUTPUT_DIR = path.join(__dirname, '../public/gallery');
const MANIFEST_FILE = path.join(__dirname, '../src/data/gallery.json');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Supported extensions
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.heic', '.webp'];
const VIDEO_EXTS = ['.mp4', '.mov', '.m4v'];

const galleryItems = [];

console.log('🚀 Starting gallery asset processing...');

const files = fs.readdirSync(SOURCE_DIR);

files.forEach((file, index) => {
    if (file.startsWith('.')) return; // Skip hidden files

    const ext = path.extname(file).toLowerCase();
    const inputPath = path.join(SOURCE_DIR, file);
    const basename = path.basename(file, path.extname(file)).replace(/[^a-zA-Z0-9]/g, '_');

    let outputPath;
    let type;
    let width, height;

    try {
        console.log(`Processing [${index + 1}/${files.length}]: ${file}`);

        if (IMAGE_EXTS.includes(ext)) {
            type = 'image';
            const outputFilename = `${basename}.webp`;
            outputPath = path.join(OUTPUT_DIR, outputFilename);

            // Convert to WebP, resize to max width 1200, maintain aspect ratio
            // Using ffmpeg for image conversion (works for HEIC too usually)
            // -q:v 75 for quality
            execSync(`ffmpeg -y -i "${inputPath}" -vf "scale='min(1200,iw)':-1" -q:v 75 "${outputPath}"`, { stdio: 'ignore' });

        } else if (VIDEO_EXTS.includes(ext)) {
            type = 'video';
            const outputFilename = `${basename}.mp4`;
            outputPath = path.join(OUTPUT_DIR, outputFilename);

            // Convert to MP4, resize to 720p width (or height based on orientation), CRF 28 for compression
            // -pix_fmt yuv420p for compatibility
            execSync(`ffmpeg -y -i "${inputPath}" -vf "scale='min(720,iw)':-2" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart -pix_fmt yuv420p "${outputPath}"`, { stdio: 'ignore' });
        } else {
            console.log(`Skipping unsupported file: ${file}`);
            return;
        }

        // Get dimensions of the OUTPUT file
        const dimensions = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${outputPath}"`).toString().trim().split('x');
        width = parseInt(dimensions[0]);
        height = parseInt(dimensions[1]);

        galleryItems.push({
            id: basename,
            type,
            src: `/gallery/${path.basename(outputPath)}`,
            width,
            height,
            alt: basename.replace(/_/g, ' ')
        });

    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
});

// Shuffle the array (Fisher-Yates) for initial random order
for (let i = galleryItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [galleryItems[i], galleryItems[j]] = [galleryItems[j], galleryItems[i]];
}

fs.writeFileSync(MANIFEST_FILE, JSON.stringify(galleryItems, null, 2));

console.log(`\n✅ Gallery processing complete! ${galleryItems.length} items processed.`);
console.log(`   Manifest saved to: ${MANIFEST_FILE}`);
