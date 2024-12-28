"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Trophy,
  Medal,
  CreditCard,
  BarChart,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  // { name: 'Inventory', href: '/inventory', icon: Package },
  { name: "Challenges", href: "/challenges", icon: Trophy },
  { name: "Leaderboard", href: "/leaderboard", icon: Medal },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  // { name: 'Reports', href: '/reports', icon: BarChart },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition duration-200 ease-in-out lg:flex lg:flex-col lg:justify-between`}
      >
        <div className="flex flex-col h-full w-64 bg-white border-r overflow-y-auto">
          <div className="flex items-center justify-center h-16 border-b">
            <span className="text-2xl font-semibold">Admin Panel</span>
          </div>
          <nav className="flex-1">
            <ul className="p-4 space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
