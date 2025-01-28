import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { subscripitonId } = await request.json();
  const subscriptions = await axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/delete-subscription/${subscripitonId}`
    )
    .then((response) => {
      console.log("deleted subscription", response);
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
