
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb";

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

function generateId(): string {
  return `KP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, email, address, birthday, anniversary } = body;

    // Validate required fields
    if (!name || !mobile || !email || !birthday) {
      return NextResponse.json(
        { message: "Name, mobile, email, and birthday are required" },
        { status: 400 }
      );
    }

    // Validate mobile number
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { message: "Invalid mobile number. Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kayaPlanet");
    const collection = db.collection("anniversaryRegistrations");

    // Check for duplicate mobile number
    const existingRegistration = await collection.findOne({ mobile });

    if (existingRegistration) {
      return NextResponse.json(
        { message: "This mobile number is already registered for the membership." },
        { status: 400 }
      );
    }

    // Create new registration
    const newRegistration: Registration = {
      id: generateId(),
      name: name.trim(),
      mobile,
      email: email.toLowerCase().trim(),
      address: address?.trim() || "",
      birthday,
      anniversary: anniversary || "",
      verified: false,
      cardNumber: null,
      createdAt: new Date().toISOString(),
      verifiedAt: null,
    };

    // Save to MongoDB
    await collection.insertOne(newRegistration);

    // Send email notification to admin
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const formattedBirthday = new Date(birthday).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const formattedAnniversary = anniversary
          ? new Date(anniversary).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          : "Not provided";

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: "kayaplanetacademy@gmail.com",
          subject: `🎉 New Anniversary Membership Registration - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(to right, #F27708, #F89134); padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🎊 New Membership Registration!</h1>
              </div>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; color: #333333;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Registration ID:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${newRegistration.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Mobile:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                      <a href="tel:+91${mobile}" style="color: #F27708;">+91 ${mobile}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Birthday:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">🎂 ${formattedBirthday}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Anniversary:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">💝 ${formattedAnniversary}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Address:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${address || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold;">Submitted At:</td>
                    <td style="padding: 10px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                  </tr>
                </table>
                
                <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #F27708;">
                  <p style="margin: 0; color: #333;">
                    <strong>⚡ Action Required:</strong><br>
                    Please verify the payment of ₹1,000 and assign a card number.<br><br>
                    📞 <a href="tel:+91${mobile}" style="color: #F27708;">Call Customer</a><br>
                    💬 <a href="https://wa.me/91${mobile}?text=Hi%20${encodeURIComponent(name)}!%20Thank%20you%20for%20registering%20for%20our%2010th%20Anniversary%20Membership!%20We%20have%20received%20your%20registration.%20We%20will%20verify%20your%20payment%20and%20share%20your%20membership%20card%20details%20soon!" style="color: #F27708;">WhatsApp Customer</a>
                  </p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the registration if email fails
      }
    }

    return NextResponse.json(
      {
        message: "Registration successful!",
        registrationId: newRegistration.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Failed to process registration. Please try again." },
      { status: 500 }
    );
  }
}
