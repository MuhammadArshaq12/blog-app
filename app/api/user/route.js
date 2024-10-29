import { ConnectDB } from "@/lib/config/db"; // Ensure your database connection function is set
import UserModel from "@/lib/models/User"; // Import the user model
const { NextResponse } = require("next/server");

// Connect to the database
const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();

// GET - Fetch user by ID
export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("id");

  if (userId) {
    try {
      const user = await UserModel.findById(userId).select("-password"); // Exclude password from the response
      if (user) {
        return NextResponse.json({ user });
      } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // If no user ID is provided, return all users
    try {
      const users = await UserModel.find().select("-password"); // Exclude passwords
      return NextResponse.json({ users });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

// POST - Register a new user
export async function POST(request) {
  try {
    // Destructure the request body
    const { name, email, phone, password } = await request.json(); // Use 'phone' here

    // Print the incoming data to the console
    console.log("Received Data:", { name, email, phone, password });

    // Check if the user already exists by email or phone
    const existingUser = await UserModel.findOne({ 
      $or: [ { email }, { phone } ]  // Check if email or phone is already registered
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or phone already exists" }, { status: 400 });
    }

    // Create a new user
    const user = new UserModel({
      name,
      email,
      phone,  // Save phone number directly
      password,
    });

    // Save the user to the database
    await user.save();

    return NextResponse.json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

  



// DELETE - Delete a user by ID
export async function DELETE(request) {
  const userId = request.nextUrl.searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await UserModel.findByIdAndDelete(userId);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
