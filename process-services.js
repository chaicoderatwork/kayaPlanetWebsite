const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const SERVICE_DIR = path.join(__dirname, 'public/service-videos');

if (!fs.existsSync(SERVICE_DIR)) {
    console.error("Service directory not found!");
    process.exit(1);
}

const files = fs.readdirSync(SERVICE_DIR);

async function processFile(file) {
    if (file.startsWith('.')) return;

    // Check extension
    const ext = path.extname(file).toLowerCase();
    if (!['.mp4', '.mov'].includes(ext)) return;

    // Skip if it looks like a poster or already processed temp file
    if (file.includes('poster')) return;
    if (file.includes('temp')) return;

    const inputPath = path.join(SERVICE_DIR, file);
    const basename = path.basename(file, path.extname(file));

    // Output paths
    // We will overwrite the original video with compressed version? 
    // Or create new one? The user request said "compress them", implying in-place or replacing.
    // To be safe, I'll compress to a temp file, then rename it to original name (overwrite).

    const tempVideoPath = path.join(SERVICE_DIR, `temp_${basename}.mp4`);
    const posterJpgPath = path.join(SERVICE_DIR, `temp_${basename}_poster.jpg`);
    const finalPosterPath = path.join(SERVICE_DIR, `${basename}-poster.webp`);

    console.log(`Processing ${file}...`);

    try {
        // 1. Compress Video
        // CRF 28 is good for web background/service videos. Scale to 720p height if larger.
        // We use -movflags +faststart for web playback.
        execSync(`ffmpeg -i "${inputPath}" -vf "scale=-2:720" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart -y "${tempVideoPath}"`, { stdio: 'inherit' });

        // 2. Generate Poster (JPG intermediate)
        execSync(`ffmpeg -i "${tempVideoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${posterJpgPath}" -y`, { stdio: 'inherit' });

        // 3. Convert Poster to WebP
        await sharp(posterJpgPath)
            .resize(720, 1280, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(finalPosterPath);

        // 4. Cleanup and Replace
        if (fs.existsSync(posterJpgPath)) fs.unlinkSync(posterJpgPath);

        // Rename compressed video to original filename (forcing .mp4 extension standard)
        // If original was .MP4, we might want to standardize to .mp4
        const finalVideoName = `${basename}.mp4`;
        const finalVideoPath = path.join(SERVICE_DIR, finalVideoName);

        fs.renameSync(tempVideoPath, finalVideoPath);

        // If the original file had a different extension (e.g. .MOV) or case (.MP4), delete the old one if we renamed to new one
        // SAFETY CHECK: On case-insensitive FS (Mac/Windows), don't unlink if the names are the same roughly
        if (finalVideoName !== file && inputPath !== finalVideoPath) {
            // Basic check: if lowercase matches, assume it's the same file on Mac
            if (finalVideoName.toLowerCase() !== file.toLowerCase()) {
                fs.unlinkSync(inputPath);
            }
        }

        console.log(`✓ Processed ${basename}`);

    } catch (e) {
        console.error(`Error processing ${file}:`, e);
        // Clean up temps
        if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
        if (fs.existsSync(posterJpgPath)) fs.unlinkSync(posterJpgPath);
    }
}

async function main() {
    for (const file of files) {
        await processFile(file);
    }
    console.log("All service videos processed!");
}

main();
