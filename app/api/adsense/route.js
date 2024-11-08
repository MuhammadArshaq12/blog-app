import { ConnectDB } from "@/lib/config/db";
import AdSenseBannerModel from "@/lib/models/AdSenseBanner";
const { NextResponse } = require("next/server");

const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();


// GET all active AdSense banners or a specific banner by ID
export async function GET(request) {
    const bannerId = request.nextUrl.searchParams.get("id");
    if (bannerId) {
      const banner = await AdSenseBannerModel.findById(bannerId);
      return NextResponse.json(banner);
    } else {
      const banners = await AdSenseBannerModel.find({ status: true });
      return NextResponse.json({ banners });
    }
  }
  
  // POST a new AdSense banner
export async function POST(request) {
  try {
    const { ad_code, status, page, position } = await request.json();
    const bannerData = { ad_code, status, page, position };

    await AdSenseBannerModel.create(bannerData);
    console.log("AdSense Banner Added");

    return NextResponse.json({ success: true, msg: "Banner Added" });
  } catch (error) {
    console.error("Failed to add banner:", error);
    return NextResponse.json({ success: false, msg: "Failed to add banner" }, { status: 500 });
  }
}

  
  // DELETE a specific AdSense banner by ID
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get('id');
    await AdSenseBannerModel.findByIdAndDelete(id);
    console.log("AdSense Banner Deleted");
  
    return NextResponse.json({ msg: "Banner Deleted" });
  }