import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Registration {
    id: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    birthday: string;
    anniversary: string;
    verified: boolean;
    cardNumber: string | null;
    createdAt: string;
    verifiedAt: string | null;
}

const DATA_FILE = path.join(process.cwd(), "data", "anniversary-registrations.json");

function readData(): { registrations: Registration[] } {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return { registrations: [] };
    }
}

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

        const data = readData();

        // Sort by createdAt descending (newest first)
        const sortedRegistrations = data.registrations.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Get filter from query
        const filter = req.nextUrl.searchParams.get("filter");
        let filteredRegistrations = sortedRegistrations;

        if (filter === "pending") {
            filteredRegistrations = sortedRegistrations.filter((r) => !r.verified);
        } else if (filter === "verified") {
            filteredRegistrations = sortedRegistrations.filter((r) => r.verified);
        }

        return NextResponse.json({
            registrations: filteredRegistrations,
            stats: {
                total: data.registrations.length,
                pending: data.registrations.filter((r) => !r.verified).length,
                verified: data.registrations.filter((r) => r.verified).length,
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
