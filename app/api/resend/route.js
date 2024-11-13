import { ConnectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
const { NextResponse } = require("next/server");

// Ensure database connection
const LoadDB = async () => {
    await ConnectDB();
};

LoadDB();

// Named export for the POST method
export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 });
        }

        // Check if the email is already verified
        if (user.isVerified) {
            return NextResponse.json({ message: 'Email is already verified' }, { status: 200 });
        }


        const verificationToken = user.verificationToken;

        // Create a transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'arshaqwajid@gmail.com',
                pass: 'pcimapsvwutvhfwl',
            },
        });

        // Generate a verification token

        const verificationUrl = `https://blog-app-three-sepia.vercel.app/emailverify?token=${verificationToken}`;

        await transporter.sendMail({
            to: email,
            subject: 'Email Verification',
            html: `
        <p>Hi,</p>
        <p>Thank you for registering! Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
      `,
        });

        return NextResponse.json({ success: true, message: 'Verification email sent' }, { status: 200 });
    } catch (error) {
        console.error('Error sending verification email:', error);
        return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }
}
