
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
    try {
        // Password check
        const password = req.headers.get("x-admin-password");

        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { registrationId, verified, cardNumber } = body;

        if (!registrationId) {
            return NextResponse.json(
                { message: "Registration ID is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("kayaPlanet");
        const collection = db.collection("anniversaryRegistrations");

        // Prepare update object
        const updateFields: any = {};

        if (verified !== undefined) {
            updateFields.verified = verified;
            updateFields.verifiedAt = verified ? new Date().toISOString() : null;
        }

        if (cardNumber !== undefined) {
            updateFields.cardNumber = cardNumber;
        }

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json(
                { message: "No valid fields to update" },
                { status: 400 }
            );
        }

        const result = await collection.findOneAndUpdate(
            { id: registrationId },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { message: "Registration not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Registration updated successfully",
            registration: result,
        });
    } catch (error) {
        console.error("Error updating registration:", error);
        return NextResponse.json(
            { message: "Failed to update registration" },
            { status: 500 }
        );
    }
}

