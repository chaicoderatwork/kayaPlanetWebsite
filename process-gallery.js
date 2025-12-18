const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const GALLERY_DIR = path.join(__dirname, 'public/gallery');
const OUTPUT_JSON = path.join(__dirname, 'src/data/gallery-processed.json');

// Ensure gallery dir exists
if (!fs.existsSync(GALLERY_DIR)) {
    console.error("Gallery directory not found!");
    process.exit(1);
}

// Tag Configuration
// Tag Configuration
const TAG_CONFIG = {
    'Aish': { tag: 'Real Bride', type: 'real-bride' },
    'Raadhya': { tag: 'Signature', type: 'signature' }, // Restored "Signature" text
    // 'Ananya': { tag: 'Soft Glam', type: 'signature' }, // removed for now to reduce clutter
    'default': { tag: null, type: null }
};

function getTagInfo(brideName) {
    // Check for partial matches or exact matches (case insensitive)
    const key = Object.keys(TAG_CONFIG).find(k => brideName.toLowerCase().includes(k.toLowerCase()));
    return key ? TAG_CONFIG[key] : TAG_CONFIG['default'];
}

const files = fs.readdirSync(GALLERY_DIR);

console.log("Cleaning up stale files...");
// (The script already regenerates from fs.readdir so stale JSON entries will naturally disappear.
// We just need to make sure we don't keep old processed files if source is gone,
// allows us to run a "clean" pass if needed, but for now just regenerating JSON is sufficient to fix the 404s).

// SEO Data
const SEO_TAGS = [
    "bestbridalmakeupkanpur", "makeupartistinkanpur", "bridalmakeup",
    "indianbride", "weddingmakeup", "kanpurmakeupartist",
    "softglam", "engagementmakeup", "hdmakeupkanpur"
];

const SEO_DESCRIPTIONS = [
    "Best Bridal Makeup in Kanpur",
    "Soft Engagement Look Kanpur",
    "Professional Bridal Makeover",
    "Luxury Wedding Makeup Artist",
    "Top Rated Makeup Academy Kanpur"
];

function getSeoStr(brideName, index) {
    // Rotate descriptions based on index/hash to give variety
    const desc = SEO_DESCRIPTIONS[(index + brideName.length) % SEO_DESCRIPTIONS.length];
    return `${desc} - ${brideName} Look ${index}`;
}

// Helper to get blurry base64
async function getBlurData(inputPath) {
    try {
        const buffer = await sharp(inputPath)
            .resize(10, 10, { fit: 'inside' })
            .toFormat('webp', { quality: 20 })
            .toBuffer();
        return `data:image/webp;base64,${buffer.toString('base64')}`;
    } catch (e) {
        console.error(`Error generating blur for ${inputPath}:`, e);
        return null;
    }
}

// Helper to process image
async function processImage(file, brideName, index) {
    const inputPath = path.join(GALLERY_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const newName = `bride_${brideName}_${index}.webp`;
    const outputPath = path.join(GALLERY_DIR, newName);

    console.log(`Processing Image: ${file} -> ${newName}`);

    try {
        if (inputPath === outputPath) {
            console.log("Source is already processed file. Skipping conversion.");
        } else {
            if (ext === '.heic') {
                try {
                    // Try direct heic
                    await sharp(inputPath)
                        .rotate()
                        .resize(1200, 1800, { fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                } catch (e) {
                    console.log("Sharp failed on HEIC/Conversion, trying ffmpeg intermediate...");
                    const tempJpg = path.join(GALLERY_DIR, `temp_${brideName}_${index}.jpg`);
                    execSync(`ffmpeg -i "${inputPath}" -y "${tempJpg}"`, { stdio: 'inherit' });
                    await sharp(tempJpg)
                        .rotate()
                        .resize(1200, 1800, { fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                    if (fs.existsSync(tempJpg)) fs.unlinkSync(tempJpg);
                }
            } else {
                await sharp(inputPath)
                    .rotate()
                    .resize(1200, 1800, { fit: 'inside', withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(outputPath);
            }
        }

        const metadata = await sharp(outputPath).metadata();
        const blurData = await getBlurData(outputPath);
        const altText = getSeoStr(brideName, index);

        // Mix hashtags: always include 3-4 top ones + bride name
        const tags = [...SEO_TAGS.slice(0, 4), `bride${brideName}`, "kayaplanetbride"];
        const tagInfo = getTagInfo(brideName);

        return {
            type: 'image',
            src: `/gallery/${newName}`,
            width: metadata.width,
            height: metadata.height,
            blurData: blurData,
            alt: altText,
            title: altText, // Added title for SEO
            hashtags: tags,
            badge: tagInfo.tag,
            badgeType: tagInfo.type
        };
    } catch (e) {
        console.error(`Error processing image ${file}:`, e);
        return null;
    }
}

// Helper to process video
async function processVideo(file, brideName, index) {
    const inputPath = path.join(GALLERY_DIR, file);
    const newName = `bride_${brideName}_${index}.mp4`;
    const outputPath = path.join(GALLERY_DIR, newName);
    const posterName = `bride_${brideName}_${index}_poster.webp`;
    const posterPath = path.join(GALLERY_DIR, posterName);
    const tempPosterJpg = path.join(GALLERY_DIR, `temp_poster_${brideName}_${index}.jpg`);

    console.log(`Processing Video: ${file} -> ${newName}`);

    try {
        // Compress Video if needed
        if (file !== newName) {
            execSync(`ffmpeg -i "${inputPath}" -vf "scale=-2:720" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart -y "${outputPath}"`, { stdio: 'inherit' });
        }

        // Generate Poster (JPEG intermediate)
        execSync(`ffmpeg -i "${outputPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${tempPosterJpg}" -y`, { stdio: 'inherit' });

        // Convert Poster to WebP
        await sharp(tempPosterJpg)
            .resize(720, 1280, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(posterPath);

        if (fs.existsSync(tempPosterJpg)) fs.unlinkSync(tempPosterJpg);

        const metadata = await sharp(posterPath).metadata();
        const blurData = await getBlurData(posterPath);
        const altText = `${getSeoStr(brideName, index)} - Video`;
        const tags = [...SEO_TAGS.slice(0, 4), `bride${brideName}`, "kayaplanetbride"];
        const tagInfo = getTagInfo(brideName);

        return {
            type: 'video',
            src: `/gallery/${newName}`,
            poster: `/gallery/${posterName}`,
            width: metadata.width,
            height: metadata.height,
            blurData: blurData,
            alt: altText,
            title: altText,
            hashtags: tags,
            badge: tagInfo.tag,
            badgeType: tagInfo.type
        };
    } catch (e) {
        console.error(`Error processing video ${file}:`, e);
        return null;
    }
}


async function main() {
    // 1. Group files
    const groups = {};
    const others = [];
    const collectionMap = new Map(); // index -> file

    // Prioritize explicit "Bride_" names
    for (const file of files) {
        if (file.startsWith('.')) continue; // skip hidden
        if (file.includes('compressed')) continue; // skip old
        if (path.extname(file) === '.json') continue;

        if (file.includes('poster')) continue; // Skip poster files entirely from being primary sources

        // Regex for standard pattern: Bride_Name_1.ext (case insensitive)
        if (file.startsWith('IMG_') || file.toLowerCase().startsWith('img_')) {
            if (!file.toLowerCase().startsWith('bride_')) {
                others.push(file);
            }
            continue;
        }

        // Expanded regex: Optional Bride_, allow spaces, flexible separator (space or underscore)
        const match = file.match(/^(?:Bride_)?([a-zA-Z0-9\s]+?)[_\s]+(\d+)\./i);

        if (match) {
            const name = match[1].trim().toLowerCase();
            const index = parseInt(match[2]);

            if (name === 'collection') {
                // Check if we already have a better candidate for this index
                // Priority: Source > Processed
                const existing = collectionMap.get(index);
                const isCurrentProcessed = file.toLowerCase().startsWith('bride_');
                if (existing) {
                    const isExistingProcessed = existing.toLowerCase().startsWith('bride_');
                    if (isExistingProcessed && !isCurrentProcessed) {
                        collectionMap.set(index, file);
                    }
                } else {
                    collectionMap.set(index, file);
                }
                continue; // Don't add to standard groups
            }

            if (!groups[name]) groups[name] = [];

            const existingFile = groups[name][index - 1];
            const isCurrentProcessed = file.toLowerCase().startsWith('bride_');

            if (existingFile) {
                const isExistingProcessed = existingFile.toLowerCase().startsWith('bride_');
                // Priority: Source (not processed) > Processed
                if (isExistingProcessed && !isCurrentProcessed) {
                    // Upgrade to source file
                    groups[name][index - 1] = file;
                }
                // Else: keep existing (either both processed, both source, or existing is source)
            } else {
                groups[name][index - 1] = file;
            }

        } else if (file.toLowerCase().startsWith('bride_') === false) {
            // Only add things that are NOT our output files
            others.push(file);
        }
    }

    const galleryData = [];

    // Process Groups
    for (const [name, files] of Object.entries(groups)) {
        console.log(`Processing Group: ${name}`);
        const groupItems = [];

        for (let i = 0; i < 3; i++) {
            const file = files[i];
            if (!file) continue;

            const isVideo = file.toLowerCase().endsWith('.mp4') || file.toLowerCase().endsWith('.mov');
            let item;
            if (isVideo) {
                item = await processVideo(file, name, i + 1);
            } else {
                item = await processImage(file, name, i + 1);
            }
            if (item) groupItems.push(item);
        }

        if (groupItems.length > 0) {
            galleryData.push({
                group: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
                items: groupItems
            });
        }
    }

    // Process Collection (Merged others + existing collection files)
    console.log("Processing Collection files...");
    const collectionItems = [];

    // Determine the full list of files to process for Collection
    // others take slots 1, 2, ... N
    // collectionMap takes slots based on index. If covered by others, we overwrite (fresh source). 
    // If not covered, we use what we have.

    let maxIdx = 0;
    if (collectionMap.size > 0) maxIdx = Math.max(...collectionMap.keys());
    maxIdx = Math.max(maxIdx, others.length);

    let finalCollectionFiles = [];
    for (let i = 1; i <= maxIdx; i++) {
        // others is 0-indexed array, so slot i corresponds to others[i-1]
        if (i <= others.length) {
            finalCollectionFiles.push({ file: others[i - 1], index: i });
        } else if (collectionMap.has(i)) {
            finalCollectionFiles.push({ file: collectionMap.get(i), index: i });
        }
    }

    // Now process them
    for (const { file, index } of finalCollectionFiles) {
        const isVideo = file.toLowerCase().endsWith('.mp4') || file.toLowerCase().endsWith('.mov');
        const name = 'collection'; // Enforce name

        let item;
        if (isVideo) {
            item = await processVideo(file, name, index);
        } else {
            item = await processImage(file, name, index);
        }
        if (item) {
            collectionItems.push(item);
        }
    }

    // Chunk into groups of 3
    for (let i = 0; i < collectionItems.length; i += 3) {
        galleryData.push({
            group: `Collection ${Math.floor(i / 3) + 1}`,
            items: collectionItems.slice(i, i + 3)
        });
    }

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(galleryData, null, 2));
    console.log(`Done! Written to ${OUTPUT_JSON}`);
}

main().catch(console.error);
