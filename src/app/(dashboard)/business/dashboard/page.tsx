"use client";

import { Package, Truck, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestCard } from "@/components/requests/request-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useDeliveryRequests } from "@/lib/hooks/use-delivery-requests";
import Link from "next/link";

export default function BusinessDashboard() {
  const profile = useAuthStore((s) => s.profile);
  const { requests, loading } = useDeliveryRequests({ businessId: profile?.uid });

  const activeRequests = requests.filter((r) => r.status === "open" || r.status === "accepted" || r.status === "in_progress");
  const completedRequests = requests.filter((r) => r.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.businessName || profile?.displayName}
          </p>
        </div>
        <Button asChild>
          <Link href="/business/requests/new">New Request</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-12" /> : activeRequests.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-12" /> : completedRequests.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-12" /> : requests.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto text-2xl font-bold" asChild>
              <Link href="/messages">View</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Requests</h2>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : activeRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Package className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No active requests</p>
              <Button className="mt-4" asChild>
                <Link href="/business/requests/new">Create Your First Request</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeRequests.slice(0, 4).map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
