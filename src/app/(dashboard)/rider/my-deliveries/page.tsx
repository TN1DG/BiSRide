"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { RequestCard } from "@/components/requests/request-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useDeliveryRequests } from "@/lib/hooks/use-delivery-requests";

export default function MyDeliveriesPage() {
  const profile = useAuthStore((s) => s.profile);
  const { requests, loading } = useDeliveryRequests({ riderId: profile?.uid });

  const active = requests.filter((r) => r.status === "accepted" || r.status === "in_progress");
  const completed = requests.filter((r) => r.status === "completed");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Deliveries</h1>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-48" /></div>
          ) : active.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-10">
                <Package className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No active deliveries</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {active.map((r) => <RequestCard key={r.id} request={r} linkPrefix="/rider/browse" />)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {completed.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-10">
                <Package className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No completed deliveries yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completed.map((r) => <RequestCard key={r.id} request={r} linkPrefix="/rider/browse" />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
