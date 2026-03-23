import React from "react";
import { Chip } from "react-native-paper";
import { colors } from "@/theme/colors";
import type { RequestStatus } from "@/lib/types";

const statusConfig: Record<
  RequestStatus,
  { label: string; bg: string; text: string }
> = {
  open: { label: "Open", bg: "#E8F5E9", text: colors.statusOpen },
  accepted: { label: "Accepted", bg: "#E3F2FD", text: colors.statusAccepted },
  in_progress: {
    label: "In Progress",
    bg: "#FFF8E1",
    text: colors.statusInProgress,
  },
  completed: {
    label: "Completed",
    bg: "#F5F5F5",
    text: colors.statusCompleted,
  },
  cancelled: {
    label: "Cancelled",
    bg: "#FFEBEE",
    text: colors.statusCancelled,
  },
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status];
  return (
    <Chip
      compact
      style={{ backgroundColor: config.bg }}
      textStyle={{ color: config.text, fontSize: 12, fontWeight: "600" }}
    >
      {config.label}
    </Chip>
  );
}
