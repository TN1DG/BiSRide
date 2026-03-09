"use client";

import { useState, useEffect } from "react";
import { where, orderBy } from "firebase/firestore";
import { subscribeToDeliveryRequests } from "@/lib/firebase/firestore";
import type { DeliveryRequest, RequestStatus } from "@/lib/types";

export function useDeliveryRequests(filters?: {
  businessId?: string;
  riderId?: string;
  status?: RequestStatus;
}) {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const constraints = [];
    if (filters?.businessId) constraints.push(where("businessId", "==", filters.businessId));
    if (filters?.riderId) constraints.push(where("riderId", "==", filters.riderId));
    if (filters?.status) constraints.push(where("status", "==", filters.status));
    constraints.push(orderBy("createdAt", "desc"));

    const unsub = subscribeToDeliveryRequests(constraints, (data) => {
      setRequests(data);
      setLoading(false);
    });

    return () => unsub();
  }, [filters?.businessId, filters?.riderId, filters?.status]);

  return { requests, loading };
}
