"use client";

import React from "react";
import { UsersProvider } from "@/context/users";
import { LoggedInProvider } from "@/context/userLoggedIn";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: boolean;
}) {
  return (
    <UsersProvider>
      <LoggedInProvider defaultSession={session}>{children}</LoggedInProvider>
    </UsersProvider>
  );
}
