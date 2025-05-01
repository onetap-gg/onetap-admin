"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLoggedIn } from "@/context/userLoggedIn";

export function Header() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useLoggedIn();

  const handleLogout = async () => {
    const response = await fetch("/api/logout", { method: "POST" });
    if (response.ok) {
      router.push("/login");
      setIsLoggedIn(false);
    }
  };

  return (
    <header
      className={`flex items-center justify-between px-4 py-3 bg-white border-b ${
        !isLoggedIn && "hidden"
      }`}
    >
      <h1 className="text-xl font-semibold md:text-2xl">
        Gaming Rewards Admin
      </h1>
      <div className="flex items-center space-x-2 md:space-x-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
