"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeoPoint } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deliveryRequestSchema, type DeliveryRequestFormData } from "@/lib/validators";
import { createDeliveryRequest } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/auth-store";

export function RequestForm() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DeliveryRequestFormData>({
    resolver: zodResolver(deliveryRequestSchema),
    defaultValues: { packageSize: "small", pickupTime: "now" },
  });

  const onSubmit = async (data: DeliveryRequestFormData) => {
    if (!profile) return;
    setLoading(true);
    try {
      await createDeliveryRequest({
        businessId: profile.uid,
        businessName: profile.businessName || profile.displayName,
        status: "open",
        description: data.description,
        packageSize: data.packageSize,
        ...(data.packageWeight != null && { packageWeight: data.packageWeight }),
        pickupAddress: data.pickupAddress,
        pickupLocation: new GeoPoint(6.5244, 3.3792), // Default Lagos coords
        dropoffAddress: data.dropoffAddress,
        dropoffLocation: new GeoPoint(6.5244, 3.3792),
        budget: data.budget,
        pickupTime: "now",
      });
      toast.success("Delivery request created!");
      router.push("/business/requests");
    } catch (error: any) {
      toast.error(error.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Delivery Request</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Package Description</Label>
            <Textarea
              id="description"
              placeholder="What are you sending? E.g., 2 boxes of electronics"
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Package Size</Label>
              <Select defaultValue="small" onValueChange={(v) => setValue("packageSize", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (fits in a bag)</SelectItem>
                  <SelectItem value="medium">Medium (fits on a bike)</SelectItem>
                  <SelectItem value="large">Large (needs a car)</SelectItem>
                  <SelectItem value="extra_large">Extra Large (needs a van)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (NGN)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="1500"
                {...register("budget", { valueAsNumber: true })}
              />
              {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupAddress">Pickup Address</Label>
            <Input
              id="pickupAddress"
              placeholder="123 Herbert Macaulay Way, Yaba, Lagos"
              {...register("pickupAddress")}
            />
            {errors.pickupAddress && <p className="text-sm text-destructive">{errors.pickupAddress.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffAddress">Dropoff Address</Label>
            <Input
              id="dropoffAddress"
              placeholder="45 Admiralty Way, Lekki Phase 1, Lagos"
              {...register("dropoffAddress")}
            />
            {errors.dropoffAddress && <p className="text-sm text-destructive">{errors.dropoffAddress.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Pickup Time</Label>
            <Select defaultValue="now" onValueChange={(v) => setValue("pickupTime", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Pick up now</SelectItem>
                <SelectItem value="scheduled">Schedule for later</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Post Delivery Request"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
