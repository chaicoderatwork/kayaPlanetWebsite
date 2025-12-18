import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/services.json");

// GET - Read services
export async function GET() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json([], { status: 200 });
    }
}

// POST - Add new service (with video processing)
export async function POST(request: NextRequest) {
    if (process.env.VERCEL) {
        return NextResponse.json(
            { error: "Uploads disabled in production. Use locally and push via Git." },
            { status: 403 }
        );
    }
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;

        if (!file || !title) {
            return NextResponse.json({ error: "Missing file or title" }, { status: 400 });
        }

        // Generate unique ID based on timestamp
        const id = Date.now().toString();
        const videoFileName = `service${id}.mp4`;
        const posterFileName = `service${id}-poster.webp`;

        const videoDir = path.join(process.cwd(), "public/service-videos");
        const videoPath = path.join(videoDir, videoFileName);
        const posterPath = path.join(videoDir, posterFileName);

        // Ensure directory exists
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }

        // Save the video file
        const bytes = await file.arrayBuffer();
        fs.writeFileSync(videoPath, Buffer.from(bytes));

        // Process video using ffmpeg and sharp (same as process-services.js)
        const { execSync } = await import("child_process");
        const sharp = (await import("sharp")).default;

        // Compress video
        const tempVideoPath = path.join(videoDir, `temp_${videoFileName}`);
        try {
            execSync(
                `ffmpeg -i "${videoPath}" -vf "scale=-2:720" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart -y "${tempVideoPath}"`,
                { stdio: "inherit" }
            );
            fs.renameSync(tempVideoPath, videoPath);
        } catch (e) {
            console.error("Video compression failed, using original");
        }

        // Generate poster
        const tempPosterJpg = path.join(videoDir, `temp_${id}_poster.jpg`);
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

        // Update JSON data
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        data.push({
            id,
            videoUrl: `/service-videos/${videoFileName}`,
            posterUrl: `/service-videos/${posterFileName}`,
            title,
        });
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// DELETE - Remove service
export async function DELETE(request: NextRequest) {
    if (process.env.VERCEL) {
        return NextResponse.json({ error: "Deletes disabled in production." }, { status: 403 });
    }
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        const item = data.find((s: { id: string }) => s.id === id);

        if (item) {
            // Delete video and poster files
            const videoPath = path.join(process.cwd(), "public", item.videoUrl);
            const posterPath = path.join(process.cwd(), "public", item.posterUrl);

            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            if (fs.existsSync(posterPath)) fs.unlinkSync(posterPath);

            // Update JSON
            const filtered = data.filter((s: { id: string }) => s.id !== id);
            fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 4));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
