import { NextRequest } from "next/server";
import {
  emailEnquiry,
  saveEnquiryLocally,
  type EnquiryRecord,
} from "@/lib/enquiry-notify";

function cleanText(value: unknown, max = 160) {
    if (typeof value !== "string") return "";
    return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null);
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return Response.json({ message: "Invalid enquiry" }, { status: 400 });
        }
        const name = cleanText(body.name, 80);
        const mobile = cleanText(body.mobile, 80);
        const eventDate = cleanText(body.eventDate, 32);
        const service = cleanText(body.service, 80) || "bridal-makeup";
        const functionName = cleanText(body.functionName, 40);
        const area = cleanText(body.area, 120);
        const source = cleanText(body.source, 60) || "website";

        if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
            return Response.json(
                { message: "Invalid mobile number" },
                { status: 400 },
            );
        }

        if (!eventDate) {
            return Response.json(
                { message: "Please choose today or a future event date." },
                { status: 400 },
            );
        }

        const parsedDate = new Date(`${eventDate}T00:00:00.000Z`);
        const today = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());
        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) ||
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== eventDate ||
            eventDate < today
        ) {
            return Response.json(
                { message: "Please choose today or a future event date." },
                { status: 400 },
            );
        }

        const serviceLabel = service
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        const formattedDate = eventDate
            ? new Date(eventDate).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "Not specified";

        const enquiry: EnquiryRecord = {
            name: name || "WhatsApp visitor",
            mobile: mobile || "",
            eventDate: eventDate || null,
            service,
            functionName: functionName || serviceLabel,
            area: area || null,
            source,
            createdAt: new Date(),
        };

        const [savedLocally, emailed] = await Promise.all([
            saveEnquiryLocally(enquiry),
            emailEnquiry(enquiry, formattedDate),
        ]);

        console.log("[enquiry] done", {
            name: enquiry.name,
            date: formattedDate,
            savedLocally,
            emailed,
        });

        return Response.json({
            message: "Enquiry submitted successfully!",
            savedLocally,
            emailed,
        });
    } catch (error) {
        console.error("Enquiry API Error:", error);
        return Response.json({ message: "Enquiry received." });
    }
}
