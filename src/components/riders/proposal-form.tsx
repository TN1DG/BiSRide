"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { proposalSchema, type ProposalFormData } from "@/lib/validators";
import { createProposal } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { UserProfile } from "@/lib/types";

interface ProposalFormProps {
  business: UserProfile;
}

export function ProposalForm({ business }: ProposalFormProps) {
  const profile = useAuthStore((s) => s.profile);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
  });

  const onSubmit = async (data: ProposalFormData) => {
    if (!profile) return;
    setLoading(true);
    try {
      await createProposal({
        riderId: profile.uid,
        riderName: profile.displayName,
        riderPhoto: profile.photoURL || "",
        businessId: business.uid,
        businessName: business.businessName || business.displayName,
        message: data.message,
        proposedPrice: data.proposedPrice,
        vehicleType: profile.vehicleType || "motorcycle",
        serviceAreas: data.serviceAreas.split(",").map((s) => s.trim()),
        status: "pending",
      });
      toast.success("Proposal sent!");
      reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to send proposal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Your Message</Label>
        <Textarea
          id="message"
          placeholder="Introduce yourself and your delivery services..."
          {...register("message")}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="proposedPrice">Proposed Price (NGN)</Label>
        <Input
          id="proposedPrice"
          type="number"
          placeholder="1500"
          {...register("proposedPrice", { valueAsNumber: true })}
        />
        {errors.proposedPrice && <p className="text-sm text-destructive">{errors.proposedPrice.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="serviceAreas">Service Areas (comma-separated)</Label>
        <Input
          id="serviceAreas"
          placeholder="Lekki, Victoria Island, Ikeja"
          {...register("serviceAreas")}
        />
        {errors.serviceAreas && <p className="text-sm text-destructive">{errors.serviceAreas.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Proposal"}
      </Button>
    </form>
  );
}
