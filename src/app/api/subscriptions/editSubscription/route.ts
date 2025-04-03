import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await axios
    .post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/edit-subscription/${body.id}`,
      body
    )
    .then((response) => {
      console.log("edited subscription", response);
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
