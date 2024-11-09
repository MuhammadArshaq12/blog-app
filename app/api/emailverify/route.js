import { ConnectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    console.log('Received token:', token); // Debug statement

    if (!token) {
      console.log('No token provided'); // Debug statement
      return NextResponse.json(
        { error: 'Verification token is required.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ verificationToken: token });
    console.log('User found:', user); // Debug statement

    if (!user) {
      console.log('Invalid or expired token'); // Debug statement
      return NextResponse.json(
        { error: 'Invalid or expired verification token.' },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Remove the token after verification
    await user.save();

    console.log('User verified and saved successfully'); // Debug statement
    return NextResponse.json(
      { message: 'Email verified successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error.message, error.stack); // Improved error logging
    return NextResponse.json(
      { error: 'Error verifying email. Please try again.' },
      { status: 500 }
    );
  }
}
