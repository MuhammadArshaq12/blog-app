// pages/api/category.js
import { ConnectDB } from "@/lib/config/db";
import CategoryModel from "@/lib/models/CategoryModel";
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

// Fetch All Categories
export async function GET() {
  const categories = await CategoryModel.find({});
  return NextResponse.json({ categories });
}

// Add New Category
export async function POST(request) {
  const { name } = await request.json();
  await CategoryModel.create({ name });
  return NextResponse.json({ success: true, msg: "Category Added" });
}

// Delete Category
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get('id');
  await CategoryModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Category Deleted" });
}
