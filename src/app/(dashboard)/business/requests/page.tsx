"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestCard } from "@/components/requests/request-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useDeliveryRequests } from "@/lib/hooks/use-delivery-requests";

export default function BusinessRequestsPage() {
  const profile = useAuthStore((s) => s.profile);
  const { requests, loading } = useDeliveryRequests({ businessId: profile?.uid });

  const openRequests = requests.filter((r) => r.status === "open");
  const activeRequests = requests.filter((r) => r.status === "accepted" || r.status === "in_progress");
  const completedRequests = requests.filter((r) => r.status === "completed" || r.status === "cancelled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Requests</h1>
        <Button asChild>
          <Link href="/business/requests/new">
            <Plus className="h-4 w-4 mr-2" /> New Request
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open ({openRequests.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeRequests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="mt-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>
          ) : openRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No open requests</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {openRequests.map((r) => <RequestCard key={r.id} request={r} />)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {activeRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No active requests</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeRequests.map((r) => <RequestCard key={r.id} request={r} />)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {completedRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No completed requests</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedRequests.map((r) => <RequestCard key={r.id} request={r} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
