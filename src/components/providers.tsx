"use client";

import React from "react";
import { UsersProvider } from "@/context/users";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <UsersProvider>{children}</UsersProvider>;
}
