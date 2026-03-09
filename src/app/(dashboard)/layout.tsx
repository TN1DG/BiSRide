"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RoleGuard } from "@/components/layout/role-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RoleGuard>
      <div className="min-h-screen">
        <Sidebar />
        <div className="md:pl-64">
          <Topbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
          <main className="p-4 pb-20 md:p-6 md:pb-6">{children}</main>
        </div>
        <MobileNav />
      </div>
    </RoleGuard>
  );
}
