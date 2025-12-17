import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/influencers.json");

// GET - Read influencers
export async function GET() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json([], { status: 200 });
    }
}

// POST - Add new influencer
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { handle, name, followers, profileUrl, reelUrl, testimonial } = body;

        if (!handle || !name || !followers || !profileUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

        // Check if handle already exists
        if (data.some((inf: { handle: string }) => inf.handle === handle)) {
            return NextResponse.json({ error: "Handle already exists" }, { status: 400 });
        }

        data.push({
            handle,
            name,
            followers,
            image: null, // Image can be added later
            profileUrl,
            reelUrl: reelUrl || null,
            testimonial: testimonial || null,
            isFeatured: false,
        });

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Add error:", error);
        return NextResponse.json({ error: "Add failed" }, { status: 500 });
    }
}

// PUT - Update influencer
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { originalHandle, handle, name, followers, profileUrl, reelUrl, testimonial } = body;

        if (!originalHandle || !handle || !name || !followers || !profileUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        const index = data.findIndex((inf: { handle: string }) => inf.handle === originalHandle);

        if (index === -1) {
            return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
        }

        data[index] = {
            ...data[index],
            handle,
            name,
            followers,
            profileUrl,
            reelUrl: reelUrl || null,
            testimonial: testimonial || null,
        };

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// DELETE - Remove influencer
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const handle = searchParams.get("handle");

        if (!handle) {
            return NextResponse.json({ error: "Missing handle" }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        const filtered = data.filter((inf: { handle: string }) => inf.handle !== handle);

        fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 4));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
