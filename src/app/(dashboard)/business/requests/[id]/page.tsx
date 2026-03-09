"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Package, Clock, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/requests/status-badge";
import { getDeliveryRequest, updateDeliveryRequest } from "@/lib/firebase/firestore";
import { findOrCreateConversation } from "@/lib/firebase/firestore";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { DeliveryRequest } from "@/lib/types";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [request, setRequest] = useState<DeliveryRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getDeliveryRequest(params.id as string);
      setRequest(data);
      setLoading(false);
    }
    load();
  }, [params.id]);

  const handleCancel = async () => {
    if (!request) return;
    await updateDeliveryRequest(request.id, { status: "cancelled" });
    toast.success("Request cancelled");
    setRequest({ ...request, status: "cancelled" });
  };

  const handleComplete = async () => {
    if (!request) return;
    await updateDeliveryRequest(request.id, { status: "completed" });
    toast.success("Request marked as completed");
    setRequest({ ...request, status: "completed" });
  };

  const handleMessage = async () => {
    if (!request || !profile || !request.riderId) return;
    const convId = await findOrCreateConversation(
      profile.uid, profile.displayName, profile.photoURL || "",
      request.riderId, request.riderName || "Rider", "",
      request.id
    );
    router.push(`/messages/${convId}`);
  };

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>;
  }

  if (!request) {
    return <p className="text-center text-muted-foreground py-10">Request not found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Request Details</h1>
        <StatusBadge status={request.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{request.description}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-sm text-muted-foreground">{request.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Dropoff</p>
              <p className="text-sm text-muted-foreground">{request.dropoffAddress}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Package Size</p>
              <p className="font-medium capitalize">{request.packageSize}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Budget</p>
              <p className="font-medium">{formatCurrency(request.budget)}</p>
            </div>
            {request.agreedPrice && (
              <div>
                <p className="text-muted-foreground">Agreed Price</p>
                <p className="font-medium">{formatCurrency(request.agreedPrice)}</p>
              </div>
            )}
          </div>

          {request.riderId && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Assigned Rider</p>
                  <p className="text-sm text-muted-foreground">{request.riderName}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" onClick={handleMessage}>
                  <MessageSquare className="h-4 w-4 mr-1" /> Message
                </Button>
              </div>
            </>
          )}

          <Separator />

          <div className="flex gap-2">
            {request.status === "open" && (
              <Button variant="destructive" onClick={handleCancel}>Cancel Request</Button>
            )}
            {request.status === "in_progress" && (
              <Button onClick={handleComplete}>Mark Completed</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
