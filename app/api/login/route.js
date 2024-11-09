import { ConnectDB } from "@/lib/config/db"; 
import UserModel from "@/lib/models/User"; 
const { NextResponse } = require("next/server");

// Connect to the database
const LoadDB = async () => {
  try {
    await ConnectDB();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

LoadDB();

// POST - User Login
export async function POST(request) {
  try {
    const { email, password } = await request.json(); 

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Check if the email is verified
    if (!user.isVerified) {
      return NextResponse.json({ error: "Your email is not verified. Please verify your email to log in." }, { status: 403 });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Return a success response with user details (without sensitive info)
    return NextResponse.json({
      name: user.name,
      email: user.email,
    }, { status: 200 });

  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
