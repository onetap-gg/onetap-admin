import { createClient } from "@supabase/supabase-js";

export const supabaseAdminClient = (
  supabase_url: string,
  service_role_key: string
) => {
  const supabase = createClient(supabase_url, service_role_key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const adminAuthClient = supabase.auth.admin;

  return adminAuthClient;
};
