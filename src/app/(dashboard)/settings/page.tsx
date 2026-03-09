"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { businessProfileSchema, type BusinessProfileFormData } from "@/lib/validators";
import { updateUserProfile } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function SettingsPage() {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [loading, setLoading] = useState(false);

  const isBusiness = profile?.role === "business";

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      businessName: profile?.businessName || profile?.displayName || "",
      businessAddress: profile?.businessAddress || "",
      businessCategory: profile?.businessCategory || "",
      phone: profile?.phone || "",
    },
  });

  const onSubmit = async (data: BusinessProfileFormData) => {
    if (!profile) return;
    setLoading(true);
    try {
      const updates = isBusiness
        ? {
            businessName: data.businessName,
            businessAddress: data.businessAddress,
            businessCategory: data.businessCategory,
            phone: data.phone,
          }
        : { phone: data.phone };

      await updateUserProfile(profile.uid, updates);
      setProfile({ ...profile, ...updates });
      toast.success("Settings saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>{isBusiness ? "Business Information" : "Account Settings"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {isBusiness && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" {...register("businessName")} />
                  {errors.businessName && <p className="text-sm text-destructive">{errors.businessName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input id="businessAddress" placeholder="123 Main St, Lagos" {...register("businessAddress")} />
                  {errors.businessAddress && <p className="text-sm text-destructive">{errors.businessAddress.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Business Category</Label>
                  <Select
                    defaultValue={profile?.businessCategory || ""}
                    onValueChange={(v) => setValue("businessCategory", v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant / Food</SelectItem>
                      <SelectItem value="retail">Retail / Shopping</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy / Health</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="08012345678" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Email:</span> {profile?.email}</p>
          <p><span className="text-muted-foreground">Role:</span> <span className="capitalize">{profile?.role}</span></p>
        </CardContent>
      </Card>
    </div>
  );
}
