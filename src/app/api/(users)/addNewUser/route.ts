import { NextResponse } from "next/server";
import { supabaseAdminClient } from "@/lib/supabaseAdminClient";
import axios from "axios";

const api_url = process.env.SUPABASE_API_URL;
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  const { profileName, username, email, password } = await request.json();
  const adminClient = supabaseAdminClient(
    api_url as string,
    service_role_key as string
  );

  const { data, error } = await adminClient.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });

  if (error !== null) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  } else {
    const authId = data.user.id;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile-data/${authId}`,
      {
        data: {
          userName: username,
          profilePicture: null,
          userCustomId: null,
          profileName: profileName,
          globalRanking: 0,
          balance: 0,
          level: 0,
          premiumUser: false,
        },
      }
    );

    if (response.status === 500) {
      return NextResponse.json(
        { success: false, error: response.data },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
