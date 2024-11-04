// routes/comments.js
import { NextResponse } from 'next/server';
import { ConnectDB } from "@/lib/config/db"; // Ensure you have your DB connection logic here
import Comment from "@/lib/models/Comment"; // Import the Comment model

const LoadDB = async () => {
    await ConnectDB();
  }
  
  LoadDB();

// POST - Add a new comment
export async function POST(request) {
  const { blogId, name, comment } = await request.json();

  if (!blogId || !name || !comment) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const newComment = new Comment({
      blogId,
      name,
      comment,
    });

    await newComment.save();
    return NextResponse.json({ success: true, message: "Comment added successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
    const blogId = request.nextUrl.searchParams.get("blogId");
  
    // If `blogId` is present in the query, fetch comments for that blog
    if (blogId) {
      try {
        const comments = await Comment.find({ blogId });
        return NextResponse.json({ success: true, comments });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  
    // If no `blogId` is provided, fetch all comments
    try {
        const comments = await Comment.find().populate('blogId', 'title');
        return NextResponse.json({ success: true, comments });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }


  // DELETE - Delete a comment
  export async function DELETE(request) {
    const { id } = await request.json(); // This line expects the ID in the request body.
  
    if (!id) {
        return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }
  
    try {
        const deletedComment = await Comment.findByIdAndDelete(id);
        
        if (!deletedComment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }
  
        return NextResponse.json({ success: true, message: "Comment deleted successfully!" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  