import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const challenges = await axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/unarchive/${body.challengeId}`
    )
    .then((response) => {
      console.log("unarchived challenge", response);
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
