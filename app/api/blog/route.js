import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import cloudinary from "@/lib/cloudinary";
const { NextResponse } = require("next/server");

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


// route code
export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    let imgUrl = "";
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const cloudinaryResponse = await cloudinary.uploader.upload(`data:image/png;base64,${imageBuffer.toString("base64")}`, {
        folder: "blogs",
      });
      imgUrl = cloudinaryResponse.secure_url;
    }

    const blogData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: imgUrl,
      authorImg: formData.get('authorImg') || "/author_img.png",
      youtubeLink: formData.get('youtubeLink'),
      isRegisteredOnly: formData.get('isRegisteredOnly') === "true"  // Handle checkbox value
    };

    await BlogModel.create(blogData);
    return NextResponse.json({ success: true, msg: "Blog Added" });
  } catch (error) {
    console.error("Error adding blog:", error);
    return NextResponse.json({ success: false, msg: "Failed to add blog" }, { status: 500 });
  }
}



export async function PUT(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, msg: "Blog ID is required" }, { status: 400 });
    }

    const formData = await request.formData();
    const updatedData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      youtubeLink: formData.get("youtubeLink"),
      isRegisteredOnly: formData.get("isRegisteredOnly") === "true", // Convert string to boolean
    };

    const image = formData.get("image");
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (error, result) => {
            if (error) {
              reject(new Error("Failed to upload image to Cloudinary"));
            } else {
              resolve(result);
            }
          }
        ).end(imageBuffer);
      });
      updatedData.image = uploadResult.secure_url;
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
  const id = await request.nextUrl.searchParams.get("id");
  const blog = await BlogModel.findById(id);
  if (blog && blog.image) {
    // Extract the public_id of the Cloudinary image
    const publicId = blog.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`blogs/${publicId}`);
  }
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Blog Deleted" });
}