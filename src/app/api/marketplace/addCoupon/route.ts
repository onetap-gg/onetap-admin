import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    couponName,
    description,
    gameId,
    pointsToRedeem,
    numberOfInstances,
    couponCodes,
  } = await request.json();

  console.log(couponName,
    description,
    Number(gameId),
    pointsToRedeem,
    Number(numberOfInstances),
    couponCodes,);

  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/marketplace/set-coupons`, {
      coupon_name: couponName,
      game_id: Number(gameId),
      description: description,
      points_to_redeem: pointsToRedeem,
      number_of_instances: Number(numberOfInstances) || 1,
      coupon_codes: couponCodes,
    })
    .then((response) => {
      console.log("coupon set", response);
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
