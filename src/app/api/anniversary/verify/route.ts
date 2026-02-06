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

function writeData(data: { registrations: Registration[] }): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

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

        const data = readData();
        const registrationIndex = data.registrations.findIndex(
            (r) => r.id === registrationId
        );

        if (registrationIndex === -1) {
            return NextResponse.json(
                { message: "Registration not found" },
                { status: 404 }
            );
        }

        // Update registration
        if (verified !== undefined) {
            data.registrations[registrationIndex].verified = verified;
            data.registrations[registrationIndex].verifiedAt = verified
                ? new Date().toISOString()
                : null;
        }

        if (cardNumber !== undefined) {
            data.registrations[registrationIndex].cardNumber = cardNumber;
        }

        writeData(data);

        return NextResponse.json({
            message: "Registration updated successfully",
            registration: data.registrations[registrationIndex],
        });
    } catch (error) {
        console.error("Error updating registration:", error);
        return NextResponse.json(
            { message: "Failed to update registration" },
            { status: 500 }
        );
    }
}
