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

    // Validate fields
    if (!name || !email || !phoneNumber || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check if the user with the same email or phone number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });

    if (existingUser) {
      const conflictField = existingUser.email === email ? 'Email' : 'Phone number';
      return NextResponse.json({ error: `${conflictField} already in use.` }, { status: 400 });
    }

    // Log the data to the console before inserting
    const newUser = { name, email, phoneNumber, password };
    console.log("User data to be inserted:", newUser);

    // Create and save the new user
    const createdUser = new User(newUser);
    await createdUser.save();

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
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
