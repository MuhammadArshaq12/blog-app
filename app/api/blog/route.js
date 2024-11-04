import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
const { NextResponse } = require("next/server");
import { writeFile } from 'fs/promises';
import fs from 'fs';

const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();


// API Endpoint to get all blogs
export async function GET(request) {

  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  }
  else {
    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs })
  }
}


export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const timestamp = Date.now();

    let imgUrl = "";
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const path = `./public/${timestamp}_${image.name}`;
      await writeFile(path, imageBuffer);
      imgUrl = `/${timestamp}_${image.name}`;
    }

    const blogData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: imgUrl,
      authorImg: formData.get('authorImg') || "/author_img.png",
      youtubeLink: formData.get('youtubeLink')
    };

    await BlogModel.create(blogData);
    return NextResponse.json({ success: true, msg: "Blog Added" });
  } catch (error) {
    console.error("Error adding blog:", error);
    return NextResponse.json({ success: false, msg: "Failed to add blog" }, { status: 500 });
  }
}


// API Endpoint For Updating Blogs
export async function PUT(request) {
  try {
    const id = await request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, msg: "Blog ID is required" }, { status: 400 });
    }

    const formData = await request.formData();
    const updatedData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      youtubeLink: formData.get('youtubeLink'),
    };

    const image = formData.get('image');
    if (image) {
      // Check if image is a File or Blob
      if (image instanceof File || image instanceof Blob) {
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        const timestamp = Date.now();
        const path = `./public/${timestamp}_${image.name}`;
        await writeFile(path, buffer);
        updatedData.image = `/${timestamp}_${image.name}`;
      } else if (typeof image === 'string') {
        console.warn("Received image as a string, assuming it's a URL:", image);
        // Optionally handle the image URL here
        updatedData.image = image; // Keep the existing image URL
      } else {
        console.error("Unexpected type for image:", image);
        return NextResponse.json({ success: false, msg: "Invalid image format" }, { status: 400 });
      }
    }

    const result = await BlogModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!result) {
      return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, msg: "Blog Updated" });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ success: false, msg: "Failed to update blog" }, { status: 500 });
  }
}



// Creating API Endpoint to delete Blog

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public${blog.image}`, () => { });
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Blog Deleted" });
}