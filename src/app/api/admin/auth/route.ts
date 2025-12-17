import { NextRequest, NextResponse } from "next/server";

// Simple password-based auth
// Password should be set in .env.local as ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kayaplanet2024";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_PASSWORD) {
            // Generate a simple token (in production, use JWT or proper session management)
            const token = Buffer.from(`kp-admin-${Date.now()}`).toString("base64");

            const response = NextResponse.json({ success: true, token });

            // Set HTTP-only cookie for added security
            response.cookies.set("kp-admin-session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24, // 24 hours
            });

            return response;
        }

        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}
