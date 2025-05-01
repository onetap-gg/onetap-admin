import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const coupons = await axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/marketplace/get-items`)
    .then((response) => {
      console.log("coupons", response.data);
      return response;
    });

  if (coupons.status === 500) {
    return NextResponse.json(
      { success: false, error: coupons.data },
      { status: 500 }
    );
  }

  return NextResponse.json(coupons.data);
}
