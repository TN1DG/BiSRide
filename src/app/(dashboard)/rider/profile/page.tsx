"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { riderProfileSchema, type RiderProfileFormData } from "@/lib/validators";
import { updateUserProfile } from "@/lib/firebase/auth";
import { uploadProfilePhoto } from "@/lib/firebase/storage";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getInitials } from "@/lib/utils";

export default function RiderProfilePage() {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RiderProfileFormData>({
    resolver: zodResolver(riderProfileSchema),
    defaultValues: {
      displayName: profile?.displayName || "",
      phone: profile?.phone || "",
      vehicleType: profile?.vehicleType || "motorcycle",
      serviceAreas: profile?.serviceAreas?.join(", ") || "",
      pricePerKm: profile?.pricePerKm || 100,
      bio: profile?.bio || "",
    },
  });

  const onSubmit = async (data: RiderProfileFormData) => {
    if (!profile) return;
    setLoading(true);
    try {
      let photoURL = profile.photoURL;
      if (photoFile) {
        photoURL = await uploadProfilePhoto(profile.uid, photoFile);
      }

      const updates = {
        displayName: data.displayName,
        phone: data.phone,
        vehicleType: data.vehicleType as any,
        serviceAreas: data.serviceAreas.split(",").map((s) => s.trim()),
        pricePerKm: data.pricePerKm,
        bio: data.bio || "",
        photoURL,
      };

      await updateUserProfile(profile.uid, updates);
      setProfile({ ...profile, ...updates });
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.photoURL} />
                <AvatarFallback className="text-xl">
                  {profile?.displayName ? getInitials(profile.displayName) : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo">Profile Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input id="displayName" {...register("displayName")} />
                {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (+234)</Label>
                <Input id="phone" placeholder="08012345678" {...register("phone")} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select
                  defaultValue={profile?.vehicleType || "motorcycle"}
                  onValueChange={(v) => setValue("vehicleType", v as any)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerKm">Price per km (NGN)</Label>
                <Input id="pricePerKm" type="number" {...register("pricePerKm", { valueAsNumber: true })} />
                {errors.pricePerKm && <p className="text-sm text-destructive">{errors.pricePerKm.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceAreas">Service Areas (comma-separated)</Label>
              <Input id="serviceAreas" placeholder="Lekki, Victoria Island, Ikeja" {...register("serviceAreas")} />
              {errors.serviceAreas && <p className="text-sm text-destructive">{errors.serviceAreas.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell businesses about your delivery experience..." {...register("bio")} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
