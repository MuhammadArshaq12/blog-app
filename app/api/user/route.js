import { ConnectDB } from "@/lib/config/db"; // Ensure your database connection function is set
import User from "@/lib/models/User";
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
      const user = await User.findById(userId).select("-password"); // Exclude password from the response
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
      const users = await User.find({}); // Exclude passwords
      return NextResponse.json({ users });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request) {
  try {
    const { name, email, phoneNumber, password } = await request.json();

    // Check if phoneNumber is null or empty
    if (!phoneNumber) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    // Existing user check
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }]  
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or phone number already exists" }, { status: 400 });
    }

    // Create a new user
    const user = new User({
      name,
      email,
      phoneNumber,
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
