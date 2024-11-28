import { NextRequest, NextResponse } from "next/server";

// Handle GET requests
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "GET request to /api/chat successful!" });
}

// Handle POST requests
export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ message: "POST request received!", data: body });
}
