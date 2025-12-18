import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/hero-slides.json");

// GET - Read hero slides
export async function GET() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json([], { status: 200 });
    }
}

// POST - Add new hero slide
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
        const subtitle = formData.get("subtitle") as string;

        if (!file || !title || !subtitle) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Generate unique ID
        const id = Date.now();
        const fileName = `hero${id}.webp`;
        const publicDir = path.join(process.cwd(), "public");
        const filePath = path.join(publicDir, fileName);

        // Save and process image
        const bytes = await file.arrayBuffer();
        const sharp = (await import("sharp")).default;

        await sharp(Buffer.from(bytes))
            .resize(1920, 1080, { fit: "cover" })
            .webp({ quality: 85 })
            .toFile(filePath);

        // Update JSON data
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        data.push({
            id,
            image: `/${fileName}`,
            title,
            subtitle,
        });
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// DELETE - Remove hero slide
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
        const item = data.find((s: { id: number }) => s.id === parseInt(id));

        if (item) {
            // Delete image file
            const imagePath = path.join(process.cwd(), "public", item.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

            // Update JSON
            const filtered = data.filter((s: { id: number }) => s.id !== parseInt(id));
            fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 4));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
