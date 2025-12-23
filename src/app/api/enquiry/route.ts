import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { name, mobile, eventDate, service } = await req.json();

        // Validate required fields
        if (!name || !mobile || !service) {
            return new Response(
                JSON.stringify({ message: "Name, mobile, and service are required" }),
                { status: 400 }
            );
        }

        // Validate mobile number
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            return new Response(
                JSON.stringify({ message: "Invalid mobile number" }),
                { status: 400 }
            );
        }

        // Format the service name for display
        const serviceLabel = service
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        // Format event date for display
        const formattedDate = eventDate
            ? new Date(eventDate).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "Not specified";

        // Create nodemailer transporter
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing email credentials in environment variables");
            return new Response(
                JSON.stringify({ message: "Server configuration error (Missing Email Credentials)" }),
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "kayaplanetacademy@gmail.com", // Main enquiry email
            subject: `🎯 New Enquiry: ${serviceLabel} - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(to right, #F27708, #F89134); padding: 20px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">New Enquiry Received! 🎉</h1>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; color: #333333;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%; color: #333333;">Name:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333333;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333333;">Mobile:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                                    <a href="tel:+91${mobile}" style="color: #F27708; text-decoration: none;">+91 ${mobile}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333333;">Service:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333333;">${serviceLabel}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333333;">Event Date:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333333;">${formattedDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; font-weight: bold; color: #333333;">Submitted At:</td>
                                <td style="padding: 10px; color: #333333;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #F27708;">
                            <p style="margin: 0; color: #333;">
                                <strong>Quick Actions:</strong><br>
                                📞 <a href="tel:+91${mobile}" style="color: #F27708;">Call Customer</a><br>
                                💬 <a href="https://wa.me/91${mobile}?text=Hi%20${encodeURIComponent(name)}!%20Thank%20you%20for%20your%20enquiry%20about%20${encodeURIComponent(serviceLabel)}%20at%20Kaya%20Planet.%20We%20would%20love%20to%20help%20you!" style="color: #F27708;">WhatsApp Customer</a>
                            </p>
                        </div>
                    </div>
                    
                    <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
                        This enquiry was submitted via the Kaya Planet website
                    </p>
                </div>
            `,
            text: `New Enquiry from ${name}\n\nMobile: +91 ${mobile}\nService: ${serviceLabel}\nEvent Date: ${formattedDate}\nSubmitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
        };

        await transporter.sendMail(mailOptions);

        return new Response(
            JSON.stringify({ message: "Enquiry submitted successfully!" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Enquiry API Error:", error);
        return new Response(
            JSON.stringify({ message: "Error processing enquiry", error: String(error) }),
            { status: 500 }
        );
    }
}
