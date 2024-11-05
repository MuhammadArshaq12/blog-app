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


// POST - Reset Password
export async function POST(request) {
    try {
        const { email, newPassword } = await request.json(); 
        
        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Validate password length
        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }

        // Directly update the password
        user.password = newPassword; // Directly update password without hashing
        await user.save(); // Save the updated user
        return NextResponse.json({ success: true, message: "Password reset successful!" });
        
    } catch (error) {
        console.error("Error during reset password:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
