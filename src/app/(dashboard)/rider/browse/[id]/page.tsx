"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/requests/status-badge";
import { getDeliveryRequest, updateDeliveryRequest, findOrCreateConversation } from "@/lib/firebase/firestore";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { DeliveryRequest } from "@/lib/types";

export default function RiderRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [request, setRequest] = useState<DeliveryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getDeliveryRequest(params.id as string);
      setRequest(data);
      setLoading(false);
    }
    load();
  }, [params.id]);

  const handleAccept = async () => {
    if (!request || !profile) return;
    setAccepting(true);
    try {
      await updateDeliveryRequest(request.id, {
        status: "accepted",
        riderId: profile.uid,
        riderName: profile.displayName,
      });
      toast.success("Request accepted!");
      router.push("/rider/my-deliveries");
    } catch (error: any) {
      toast.error(error.message || "Failed to accept");
    } finally {
      setAccepting(false);
    }
  };

  const handleMessage = async () => {
    if (!request || !profile) return;
    const convId = await findOrCreateConversation(
      profile.uid, profile.displayName, profile.photoURL || "",
      request.businessId, request.businessName, "",
      request.id
    );
    router.push(`/messages/${convId}`);
  };

  const handleStatusUpdate = async (status: "in_progress" | "completed") => {
    if (!request) return;
    await updateDeliveryRequest(request.id, { status });
    toast.success(status === "in_progress" ? "Marked as in progress" : "Delivery completed!");
    setRequest({ ...request, status });
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>;
  if (!request) return <p className="text-center text-muted-foreground py-10">Request not found</p>;

  const isMyDelivery = request.riderId === profile?.uid;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Request Details</h1>
        <StatusBadge status={request.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{request.description}</CardTitle>
          <p className="text-sm text-muted-foreground">By {request.businessName}</p>
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
              <p className="font-medium text-primary">{formatCurrency(request.budget)}</p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            {request.status === "open" && (
              <>
                <Button onClick={handleAccept} disabled={accepting} className="flex-1">
                  {accepting ? "Accepting..." : "Accept Request"}
                </Button>
                <Button variant="outline" onClick={handleMessage}>
                  <MessageSquare className="h-4 w-4 mr-1" /> Message
                </Button>
              </>
            )}
            {isMyDelivery && request.status === "accepted" && (
              <Button onClick={() => handleStatusUpdate("in_progress")} className="flex-1">
                Start Delivery
              </Button>
            )}
            {isMyDelivery && request.status === "in_progress" && (
              <Button onClick={() => handleStatusUpdate("completed")} className="flex-1">
                Mark Delivered
              </Button>
            )}
            {isMyDelivery && (
              <Button variant="outline" onClick={handleMessage}>
                <MessageSquare className="h-4 w-4 mr-1" /> Message Business
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
