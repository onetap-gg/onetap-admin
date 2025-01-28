import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const challenges = await axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/all-data`)
    .then((response) => {
      console.log("challenges", response);
      return response;
    });

  if (challenges.status === 500) {
    return NextResponse.json(
      { success: false, error: challenges.data },
      { status: 500 }
    );
  }

  return NextResponse.json(challenges.data);
}
