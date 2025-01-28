import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const leaderboard = await axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard/all-data`)
    .then((response) => {
      console.log("leaderboard", response);
      return response;
    });

  if (leaderboard.status === 500) {
    return NextResponse.json(
      { success: false, error: leaderboard.data },
      { status: 500 }
    );
  }

  return NextResponse.json(leaderboard.data);
}
