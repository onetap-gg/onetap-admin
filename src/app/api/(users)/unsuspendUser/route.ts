import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { authId } = await request.json();
  const response = await axios
    .post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/unsuspend-user/${authId}`
    )
    .then((response) => {
      console.log("unsuspended user", response);
      return response;
    });

  if (response.status === 500) {
    return NextResponse.json(
      { success: false, error: response.data },
      { status: 500 }
    );
  }

  return NextResponse.json(response.data);
}
