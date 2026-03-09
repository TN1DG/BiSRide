"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Search,
  MessageSquare,
  LayoutDashboard,
  Building2,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";

const businessTabs = [
  { href: "/business/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/business/requests", label: "Requests", icon: Package },
  { href: "/business/proposals", label: "Proposals", icon: Truck },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

const riderTabs = [
  { href: "/rider/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/rider/browse", label: "Browse", icon: Search },
  { href: "/rider/businesses", label: "Businesses", icon: Building2 },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

export function MobileNav() {
  const pathname = usePathname();
  const profile = useAuthStore((s) => s.profile);
  const tabs = profile?.role === "business" ? businessTabs : riderTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-xs",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
