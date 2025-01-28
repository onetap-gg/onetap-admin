import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const challenges = await axios
    .post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/delete-challenge/${body.gameId}/${body.challengeId}`,
      body
    )
    .then((response) => {
      console.log("edited challenges", response);
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
