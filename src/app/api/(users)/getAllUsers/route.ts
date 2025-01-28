import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const allUsers = await axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all/basic-info`)
    .then((response) => {
      console.log("users", response);
      return response;
    });

  if (allUsers.status === 500) {
    return NextResponse.json(
      { success: false, error: allUsers.data },
      { status: 500 }
    );
  }

  return NextResponse.json(allUsers.data);
}
