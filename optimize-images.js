const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const outputDir = path.join(__dirname, 'public', 'optimized');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const optimizeImages = async () => {
    const files = fs.readdirSync(publicDir);

    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png)$/i)) {
            const inputPath = path.join(publicDir, file);
            const outputPath = path.join(publicDir, file); // Overwriting originals for simplicity as per plan, or ideally to webp
            const webpPath = path.join(publicDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

            const stats = fs.statSync(inputPath);
            if (stats.size > 200000) { // Only optimize if > 200KB
                console.log(`Optimizing ${file} (${(stats.size / 1024).toFixed(2)} KB)...`);

                // create webp version
                await sharp(inputPath)
                    .resize(1920, null, { withoutEnlargement: true }) // limit max width
                    .webp({ quality: 80 })
                    .toFile(webpPath);

                console.log(`Created ${path.basename(webpPath)}`);
            }
        }
    }
};

optimizeImages().then(() => console.log('Done!'));
