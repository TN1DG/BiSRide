import { Timestamp, GeoPoint } from "firebase/firestore";

export type UserRole = "business" | "rider";

export type VehicleType = "motorcycle" | "car" | "van" | "truck" | "bicycle";

export interface UserProfile {
  uid: string;
  email: string;
  phone: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Business fields
  businessName?: string;
  businessAddress?: string;
  businessCategory?: string;
  businessLocation?: GeoPoint;
  // Rider fields
  vehicleType?: VehicleType;
  serviceAreas?: string[];
  pricePerKm?: number;
  bio?: string;
  isAvailable?: boolean;
  averageRating?: number;
  totalDeliveries?: number;
  // Mobile-specific
  expoPushTokens?: string[];
}

export type RequestStatus =
  | "open"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export type PackageSize = "small" | "medium" | "large" | "extra_large";

export interface DeliveryRequest {
  id: string;
  businessId: string;
  businessName: string;
  status: RequestStatus;
  description: string;
  packageSize: PackageSize;
  packageWeight?: number;
  pickupAddress: string;
  pickupLocation: GeoPoint;
  dropoffAddress: string;
  dropoffLocation: GeoPoint;
  budget: number;
  agreedPrice?: number;
  riderId?: string;
  riderName?: string;
  pickupTime: "now" | Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Mobile-specific
  proofPhotos?: string[];
  completedAt?: Timestamp;
}

export type ProposalStatus = "pending" | "accepted" | "declined";

export interface Proposal {
  id: string;
  riderId: string;
  riderName: string;
  riderPhoto?: string;
  businessId: string;
  businessName: string;
  message: string;
  proposedPrice: number;
  vehicleType: VehicleType;
  serviceAreas: string[];
  status: ProposalStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantPhotos: Record<string, string>;
  lastMessage: string;
  lastMessageAt: Timestamp;
  unreadCount: Record<string, number>;
  relatedRequestId?: string;
  relatedProposalId?: string;
  createdAt: Timestamp;
}

export type MessageType = "text" | "image" | "system";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  type: MessageType;
  readBy: string[];
  createdAt: Timestamp;
}

export interface Review {
  id: string;
  requestId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

// New: Active delivery tracking
export type ActiveDeliveryStatus = "heading_to_pickup" | "picked_up" | "in_transit";

export interface ActiveDelivery {
  riderId: string;
  riderName: string;
  businessId: string;
  riderLocation: GeoPoint;
  pickupLocation: GeoPoint;
  dropoffLocation: GeoPoint;
  status: ActiveDeliveryStatus;
  updatedAt: Timestamp;
}
