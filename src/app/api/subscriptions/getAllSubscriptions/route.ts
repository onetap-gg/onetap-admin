import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const subscriptions = await axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/get-subscriptions`)
    .then((response) => {
      console.log("subscriptions", response);
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
