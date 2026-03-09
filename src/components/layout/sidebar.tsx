"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Search,
  MessageSquare,
  Settings,
  User,
  Building2,
  Bike,
  FileText,
  LayoutDashboard,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";

const businessLinks = [
  { href: "/business/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/business/requests", label: "My Requests", icon: Package },
  { href: "/business/requests/new", label: "New Request", icon: FileText },
  { href: "/business/proposals", label: "Proposals", icon: Truck },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

const riderLinks = [
  { href: "/rider/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rider/browse", label: "Browse Requests", icon: Search },
  { href: "/rider/businesses", label: "Businesses", icon: Building2 },
  { href: "/rider/my-deliveries", label: "My Deliveries", icon: Package },
  { href: "/rider/profile", label: "Profile", icon: User },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const profile = useAuthStore((s) => s.profile);
  const links = profile?.role === "business" ? businessLinks : riderLinks;

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-sidebar-background">
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <Bike className="h-7 w-7 text-primary" />
        <span className="text-xl font-bold">BiSRide</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
