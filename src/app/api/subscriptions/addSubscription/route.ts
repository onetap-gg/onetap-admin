import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const subscriptions = await axios
    .post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/set-subscriptions`,
      body
    )
    .then((response) => {
      console.log("added subscriptions", response);
      return response;
    });

  if (subscriptions.status === 500) {
    return NextResponse.json(
      { success: false, error: subscriptions.data },
      { status: 500 }
    );
  }

  return NextResponse.json(subscriptions.data);
}
