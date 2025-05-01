import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gaming Rewards Admin Panel",
  description: "Admin panel for managing gaming rewards platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await cookies();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={loggedIn.get("admin_session") as unknown as boolean}>
          <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                {children}
              </main>
              <Toaster richColors />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
