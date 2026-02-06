
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { registrationId, screenshot } = body;

        if (!registrationId || !screenshot) {
            return NextResponse.json(
                { message: "Registration ID and screenshot are required" },
                { status: 400 }
            );
        }

        // Validate base64 string simple check
        if (!screenshot.startsWith("data:image")) {
            return NextResponse.json(
                { message: "Invalid image format" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("kayaPlanet");
        const collection = db.collection("anniversaryRegistrations");

        const result = await collection.findOneAndUpdate(
            { id: registrationId },
            { $set: { paymentScreenshot: screenshot } },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { message: "Registration not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Screenshot uploaded successfully",
            registrationId: result.id
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { message: "Failed to upload screenshot" },
            { status: 500 }
        );
    }
}
