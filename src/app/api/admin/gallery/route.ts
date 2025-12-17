import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/gallery-processed.json");
const GALLERY_DIR = path.join(process.cwd(), "public/gallery");

// GET - Read gallery items
export async function GET() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json([], { status: 200 });
    }
}

// POST - Add new gallery item
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const badge = formData.get("badge") as string;

        if (!file) {
            return NextResponse.json({ error: "Missing file" }, { status: 400 });
        }

        const isVideo = file.type.startsWith("video/");
        const id = Date.now();
        const sharp = (await import("sharp")).default;

        // Ensure directory exists
        if (!fs.existsSync(GALLERY_DIR)) {
            fs.mkdirSync(GALLERY_DIR, { recursive: true });
        }

        let item: Record<string, unknown>;

        if (isVideo) {
            const videoFileName = `gallery_${id}.mp4`;
            const posterFileName = `gallery_${id}_poster.webp`;
            const videoPath = path.join(GALLERY_DIR, videoFileName);
            const posterPath = path.join(GALLERY_DIR, posterFileName);

            // Save video
            const bytes = await file.arrayBuffer();
            fs.writeFileSync(videoPath, Buffer.from(bytes));

            // Process video
            const { execSync } = await import("child_process");

            // Compress
            const tempVideoPath = path.join(GALLERY_DIR, `temp_${videoFileName}`);
            try {
                execSync(
                    `ffmpeg -i "${videoPath}" -vf "scale=-2:720" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart -y "${tempVideoPath}"`,
                    { stdio: "inherit" }
                );
                fs.renameSync(tempVideoPath, videoPath);
            } catch (e) {
                console.error("Video compression failed");
            }

            // Generate poster
            const tempPosterJpg = path.join(GALLERY_DIR, `temp_${id}_poster.jpg`);
            try {
                execSync(
                    `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${tempPosterJpg}" -y`,
                    { stdio: "inherit" }
                );

                await sharp(tempPosterJpg)
                    .resize(720, 1280, { fit: "inside", withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(posterPath);

                if (fs.existsSync(tempPosterJpg)) fs.unlinkSync(tempPosterJpg);
            } catch (e) {
                console.error("Poster generation failed");
            }

            // Get poster metadata for blur
            const metadata = await sharp(posterPath).metadata();
            const blurBuffer = await sharp(posterPath)
                .resize(10, 10, { fit: "inside" })
                .webp({ quality: 20 })
                .toBuffer();
            const blurData = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

            item = {
                type: "video",
                src: `/gallery/${videoFileName}`,
                poster: `/gallery/${posterFileName}`,
                width: metadata.width || 720,
                height: metadata.height || 1280,
                blurData,
                alt: `Kaya Planet Gallery Video ${id}`,
                title: `Gallery Video ${id}`,
                hashtags: ["kayaplanetbride", "bridalmakeup"],
                badge: badge === "real-bride" ? "Real Bride" : badge === "signature" ? "Signature" : null,
                badgeType: badge || null,
            };
        } else {
            // Image
            const imageFileName = `gallery_${id}.webp`;
            const imagePath = path.join(GALLERY_DIR, imageFileName);

            const bytes = await file.arrayBuffer();

            // Process image
            await sharp(Buffer.from(bytes))
                .rotate()
                .resize(1200, 1800, { fit: "inside", withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(imagePath);

            const metadata = await sharp(imagePath).metadata();
            const blurBuffer = await sharp(imagePath)
                .resize(10, 10, { fit: "inside" })
                .webp({ quality: 20 })
                .toBuffer();
            const blurData = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

            item = {
                type: "image",
                src: `/gallery/${imageFileName}`,
                width: metadata.width || 1200,
                height: metadata.height || 1800,
                blurData,
                alt: `Kaya Planet Gallery Image ${id}`,
                title: `Gallery Image ${id}`,
                hashtags: ["kayaplanetbride", "bridalmakeup"],
                badge: badge === "real-bride" ? "Real Bride" : badge === "signature" ? "Signature" : null,
                badgeType: badge || null,
            };
        }

        // Update JSON data - add to a "Uploads" group
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        let uploadsGroup = data.find((g: { group: string }) => g.group === "Uploads");

        if (!uploadsGroup) {
            uploadsGroup = { group: "Uploads", items: [] };
            data.unshift(uploadsGroup); // Add at beginning
        }

        uploadsGroup.items.push(item);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// DELETE - Remove gallery item
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const src = searchParams.get("id"); // src is passed as id

        if (!src) {
            return NextResponse.json({ error: "Missing src" }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

        // Find and remove the item from any group
        for (const group of data) {
            const index = group.items.findIndex((item: { src: string }) => item.src === src);
            if (index !== -1) {
                const item = group.items[index];

                // Delete files
                const filePath = path.join(process.cwd(), "public", item.src);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

                if (item.poster) {
                    const posterPath = path.join(process.cwd(), "public", item.poster);
                    if (fs.existsSync(posterPath)) fs.unlinkSync(posterPath);
                }

                // Remove from array
                group.items.splice(index, 1);
                break;
            }
        }

        // Remove empty groups
        const filteredData = data.filter((g: { items: unknown[] }) => g.items.length > 0);

        fs.writeFileSync(DATA_FILE, JSON.stringify(filteredData, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
