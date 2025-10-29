import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Setting } from "@/models/Setting";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    let query: any = {};

    // If a specific setting name is requested
    if (name) {
      query.name = name;
    }

    const settings = await Setting.find(query).lean();

    // Convert MongoDB _id to string
    const settingsWithStringId = settings.map((setting: any) => ({
      ...setting,
      _id: setting._id.toString(),
    }));

    // If requesting a single setting by name, return just that setting
    if (name) {
      const setting = settingsWithStringId[0];
      if (!setting) {
        return NextResponse.json(
          { error: "Setting not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(setting);
    }

    // Return all settings
    return NextResponse.json(settingsWithStringId);
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings", details: error.message },
      { status: 500 }
    );
  }
}
