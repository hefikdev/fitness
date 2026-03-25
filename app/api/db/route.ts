import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema";

export async function GET() {
  try {
    const hasUser = await db.query.userProfile.findFirst();
    return NextResponse.json({ status: "ok", db: true, hasUser: Boolean(hasUser) });
  } catch (error) {
    console.error("DB health check failed", error);
    return NextResponse.json({ status: "error", db: false, message: String(error) }, { status: 500 });
  }
}
