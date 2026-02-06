import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // Simple password check via query param or header
        const password = req.headers.get("x-admin-password") ||
            req.nextUrl.searchParams.get("password");

        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const client = await clientPromise;
        const db = client.db("kayaPlanet");
        const collection = db.collection("anniversaryRegistrations");

        // Fetch all registrations
        const registrations = await collection.find({}).sort({ createdAt: -1 }).toArray();

        // Get filter from query
        const filter = req.nextUrl.searchParams.get("filter");
        let filteredRegistrations = registrations;

        if (filter === "pending") {
            filteredRegistrations = registrations.filter((r) => !r.verified);
        } else if (filter === "verified") {
            filteredRegistrations = registrations.filter((r) => r.verified);
        }

        return NextResponse.json({
            registrations: filteredRegistrations,
            stats: {
                total: registrations.length,
                pending: registrations.filter((r) => !r.verified).length,
                verified: registrations.filter((r) => r.verified).length,
            },
        });
    } catch (error) {
        console.error("Error fetching registrations:", error);
        return NextResponse.json(
            { message: "Failed to fetch registrations" },
            { status: 500 }
        );
    }
}

