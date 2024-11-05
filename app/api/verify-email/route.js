import { ConnectDB } from "@/lib/config/db"; // Ensure your database connection function is set
import UserModel from "@/lib/models/User"; // Import the user model
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

// POST - Verify Email
export async function POST(request) {
  try {
    const { email } = await request.json(); // Get email from request body

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log(`Email not found: ${email}`); // Debugging log
      return NextResponse.json({ exists: false }, { status: 404 });
    }

    console.log(`Email found: ${email}`); // Debugging log
    return NextResponse.json({ exists: true }); // Return user exists status

  } catch (error) {
    console.error("Error during email verification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
