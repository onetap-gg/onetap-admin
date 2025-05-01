import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, itemName, description, gameId, pointsToRedeem } =
    await request.json();

  const response = await axios
    .post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/marketplace/edit-item/${id}`,
      {
        itemName: itemName,
        gameId: gameId,
        extraDetails: {
          description: description,
          points_to_redeem: pointsToRedeem,
        }
      }
    )
    .then((response) => {
      console.log("coupon updated", response);
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
