"use client";

import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/lib/types";

const statusConfig: Record<RequestStatus, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }> = {
  open: { label: "Open", variant: "success" },
  accepted: { label: "Accepted", variant: "default" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
