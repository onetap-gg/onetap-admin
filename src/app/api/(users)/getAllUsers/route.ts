import { NextResponse } from "next/server";
import { supabaseAdminClient } from "@/lib/supabaseAdminClient";

const api_url = process.env.SUPABASE_API_URL;
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  const { page } = await request.json();

  const adminClient = supabaseAdminClient(
    api_url as string,
    service_role_key as string
  );

  const {
    data: { users },
    error,
  } = await adminClient.listUsers({ page: page });

  console.log(users);

  if (error !== null) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
