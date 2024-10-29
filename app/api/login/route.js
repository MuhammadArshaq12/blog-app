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

// POST - User Login
// POST - User Login
export async function POST(request) {
    try {
      const { email, password } = await request.json(); // Get email and password from request body
  
      // Check if the user exists
      const user = await UserModel.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
      }
  
      // Check if the password is correct (plain text comparison)
      if (user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
      }
  
      // No token generation, you can return user data or a success message
      return NextResponse.json({
        success: true,
        message: "Login successful!",
        user: { id: user._id, name: user.name, email: user.email }, // Send user data (avoid sending sensitive data)
      });
    } catch (error) {
      console.error("Error during login:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
