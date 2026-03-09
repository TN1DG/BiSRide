import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["business", "rider"], {
      required_error: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const deliveryRequestSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
  packageSize: z.enum(["small", "medium", "large", "extra_large"]),
  packageWeight: z.number().optional(),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  dropoffAddress: z.string().min(5, "Dropoff address is required"),
  budget: z.number().min(100, "Minimum budget is 100 NGN"),
  pickupTime: z.enum(["now", "scheduled"]),
});

export type DeliveryRequestFormData = z.infer<typeof deliveryRequestSchema>;

export const riderProfileSchema = z.object({
  displayName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  vehicleType: z.enum(["motorcycle", "car", "van", "truck", "bicycle"]),
  serviceAreas: z.string().min(1, "At least one service area required"),
  pricePerKm: z.number().min(10, "Minimum price is 10 NGN/km"),
  bio: z.string().optional(),
});

export type RiderProfileFormData = z.infer<typeof riderProfileSchema>;

export const businessProfileSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessCategory: z.string().min(1, "Category is required"),
  phone: z.string().min(10, "Valid phone number required"),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export const proposalSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
  proposedPrice: z.number().min(100, "Minimum price is 100 NGN"),
  serviceAreas: z.string().min(1, "Service areas required"),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;
