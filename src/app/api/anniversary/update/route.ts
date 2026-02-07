import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, name, email, birthday, anniversary } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Registration ID is required" },
                { status: 400 }
            );
        }

        if (!name || name.trim().length < 2) {
            return NextResponse.json(
                { message: "Please enter a valid name" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("kayaPlanet");
        const collection = db.collection("anniversaryRegistrations");

        // Try to find by MongoDB ObjectId first, then by custom id field
        let query: object;
        try {
            query = { _id: new ObjectId(id) };
        } catch {
            // Not a valid ObjectId, try the custom id field
            query = { id: id };
        }

        // Update the registration
        const updateResult = await collection.updateOne(
            query,
            {
                $set: {
                    name: name.trim(),
                    email: email?.trim() || "",
                    birthday: birthday || "",
                    anniversary: anniversary || "",
                    updatedAt: new Date().toISOString(),
                },
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json(
                { message: "Registration not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Details updated successfully",
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { message: "Failed to update. Please try again." },
            { status: 500 }
        );
    }
}

