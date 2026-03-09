"use client";

import { Search, Package, Truck, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestCard } from "@/components/requests/request-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useDeliveryRequests } from "@/lib/hooks/use-delivery-requests";
import Link from "next/link";

export default function RiderDashboard() {
  const profile = useAuthStore((s) => s.profile);
  const { requests: openRequests, loading: loadingOpen } = useDeliveryRequests({ status: "open" });
  const { requests: myDeliveries, loading: loadingMy } = useDeliveryRequests({ riderId: profile?.uid });

  const activeDeliveries = myDeliveries.filter((r) => r.status === "accepted" || r.status === "in_progress");
  const completedDeliveries = myDeliveries.filter((r) => r.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.displayName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingOpen ? <Skeleton className="h-8 w-12" /> : openRequests.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingMy ? <Skeleton className="h-8 w-12" /> : activeDeliveries.length}
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
              {loadingMy ? <Skeleton className="h-8 w-12" /> : completedDeliveries.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.averageRating ? profile.averageRating.toFixed(1) : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Nearby Open Requests</h2>
          <Button variant="outline" asChild>
            <Link href="/rider/browse">Browse All</Link>
          </Button>
        </div>
        {loadingOpen ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-48" /><Skeleton className="h-48" />
          </div>
        ) : openRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-10">
              <Search className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No open requests right now</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {openRequests.slice(0, 4).map((req) => (
              <RequestCard key={req.id} request={req} linkPrefix="/rider/browse" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
