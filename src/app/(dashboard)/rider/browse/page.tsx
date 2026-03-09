"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { RequestCard } from "@/components/requests/request-card";
import { useDeliveryRequests } from "@/lib/hooks/use-delivery-requests";
import { updateDeliveryRequest } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function RiderBrowsePage() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const { requests, loading } = useDeliveryRequests({ status: "open" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sizeFilter, setSizeFilter] = useState<string>("all");

  const filtered = requests.filter((r) => {
    if (searchTerm && !r.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !r.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !r.dropoffAddress.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (sizeFilter !== "all" && r.packageSize !== sizeFilter) return false;
    return true;
  });

  const handleAccept = async (requestId: string) => {
    if (!profile) return;
    try {
      await updateDeliveryRequest(requestId, {
        status: "accepted",
        riderId: profile.uid,
        riderName: profile.displayName,
      });
      toast.success("Request accepted! The business will be notified.");
      router.push("/rider/my-deliveries");
    } catch (error: any) {
      toast.error(error.message || "Failed to accept request");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Browse Delivery Requests</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by description or location..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sizeFilter} onValueChange={setSizeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Package size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sizes</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="extra_large">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <Search className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No matching requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              showActions
              onAccept={handleAccept}
              linkPrefix="/rider/browse"
            />
          ))}
        </div>
      )}
    </div>
  );
}
