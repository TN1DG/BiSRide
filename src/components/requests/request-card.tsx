"use client";

import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { formatCurrency } from "@/lib/utils";
import type { DeliveryRequest } from "@/lib/types";

interface RequestCardProps {
  request: DeliveryRequest;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  linkPrefix?: string;
}

export function RequestCard({ request, showActions, onAccept, linkPrefix = "/business/requests" }: RequestCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{request.description}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{request.businessName}</p>
        </div>
        <StatusBadge status={request.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Pickup</p>
            <p className="text-muted-foreground">{request.pickupAddress}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Dropoff</p>
            <p className="text-muted-foreground">{request.dropoffAddress}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{request.packageSize}</span>
          </div>
          <div className="font-semibold text-primary">
            {formatCurrency(request.budget)}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`${linkPrefix}/${request.id}`}>View Details</Link>
          </Button>
          {showActions && request.status === "open" && onAccept && (
            <Button size="sm" className="flex-1" onClick={() => onAccept(request.id)}>
              Accept
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
