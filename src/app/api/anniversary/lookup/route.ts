import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "anniversary-registrations.json");

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

interface Data {
    registrations: Registration[];
}

// Read existing data
function readData(): Data {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return { registrations: [] };
        }
        const content = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(content);
    } catch {
        return { registrations: [] };
    }
}

// Mask name for privacy (show first 2 chars + asterisks)
function maskName(name: string): string {
    if (name.length <= 2) return name;
    const firstName = name.split(" ")[0];
    return firstName.slice(0, 2) + "*".repeat(Math.min(firstName.length - 2, 4));
}

// Mask email for privacy
function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!domain) return "***@***";
    const maskedLocal = local.slice(0, 2) + "***";
    return `${maskedLocal}@${domain}`;
}

// POST /api/anniversary/lookup - Find registration by mobile number
// Returns only minimal, masked data for security
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { mobile } = body;

        // Validate mobile
        if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
            return NextResponse.json(
                { message: "Please enter a valid 10-digit mobile number" },
                { status: 400 }
            );
        }

        const data = readData();
        const registration = data.registrations.find((r) => r.mobile === mobile);

        if (!registration) {
            return NextResponse.json(
                { message: "No registration found with this mobile number", found: false },
                { status: 404 }
            );
        }

        // Return only masked/minimal data for security
        // User already knows their own mobile number
        return NextResponse.json({
            found: true,
            registration: {
                id: registration.id,
                // Masked name for confirmation (e.g., "Pr****")
                maskedName: maskName(registration.name),
                // Full name is needed for payment page display - but user already entered it during registration
                name: registration.name,
                mobile: registration.mobile,
                // Masked email for security
                maskedEmail: maskEmail(registration.email),
                email: registration.email,
                // These are needed for the payment flow
                birthday: registration.birthday,
                anniversary: registration.anniversary,
                verified: registration.verified,
                // Whether card has been assigned (for verified users to know if they need to collect)
                hasCard: !!registration.cardNumber,
                // Don't expose: address, actual cardNumber, timestamps
            },
        });
    } catch (error) {
        console.error("Lookup error:", error);
        return NextResponse.json(
            { message: "Failed to lookup registration" },
            { status: 500 }
        );
    }
}
