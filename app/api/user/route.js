import { ConnectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
const { NextResponse } = require("next/server");
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();

// Fetch all users
export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("id");

  if (userId) {
    try {
      const user = await User.findById(userId).select("-password"); 
      if (user) {
        return NextResponse.json({ user });
      } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    try {
      const users = await User.find({}); 
      return NextResponse.json({ users });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

// Register a user
export async function POST(request) {
  try {
    const { name, email, phoneNumber, password } = await request.json();

    if (!name || !email || !phoneNumber || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      const conflictField = existingUser.email === email ? 'Email' : 'Phone number';
      return NextResponse.json({ error: `${conflictField} already in use.` }, { status: 400 });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({ name, email, phoneNumber, password, verificationToken });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'arshaqwajid@gmail.com',
        pass: 'pcimapsvwutvhfwl',
      },
    });

    const verificationUrl = `https://blog-app-three-sepia.vercel.app/emailverify?token=${verificationToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Email Verification',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for registering! Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
      `,
    });

    return NextResponse.json({ message: 'User registered successfully. Please check your email to verify your account.' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}


// DELETE - Delete a user by ID
export async function DELETE(request) {
  const userId = request.nextUrl.searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
