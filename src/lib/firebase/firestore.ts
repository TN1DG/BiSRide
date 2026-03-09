import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import type {
  DeliveryRequest,
  Proposal,
  Conversation,
  Message,
  Review,
} from "@/lib/types";

// Delivery Requests
export async function createDeliveryRequest(
  data: Omit<DeliveryRequest, "id" | "createdAt" | "updatedAt">
) {
  const ref = await addDoc(collection(db, "deliveryRequests"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDeliveryRequest(
  id: string,
  data: Partial<DeliveryRequest>
) {
  await updateDoc(doc(db, "deliveryRequests", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToDeliveryRequests(
  constraints: QueryConstraint[],
  callback: (requests: DeliveryRequest[]) => void
): Unsubscribe {
  const q = query(collection(db, "deliveryRequests"), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as DeliveryRequest)
    );
    callback(requests);
  });
}

export async function getDeliveryRequest(
  id: string
): Promise<DeliveryRequest | null> {
  const snap = await getDoc(doc(db, "deliveryRequests", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as DeliveryRequest;
}

// Proposals
export async function createProposal(
  data: Omit<Proposal, "id" | "createdAt" | "updatedAt">
) {
  const ref = await addDoc(collection(db, "proposals"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProposal(id: string, data: Partial<Proposal>) {
  await updateDoc(doc(db, "proposals", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToProposals(
  constraints: QueryConstraint[],
  callback: (proposals: Proposal[]) => void
): Unsubscribe {
  const q = query(collection(db, "proposals"), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const proposals = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Proposal)
    );
    callback(proposals);
  });
}

// Conversations
export async function createConversation(
  data: Omit<Conversation, "id" | "createdAt">
) {
  const ref = await addDoc(collection(db, "conversations"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToConversations(
  userId: string,
  callback: (conversations: Conversation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId),
    orderBy("lastMessageAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Conversation)
    );
    callback(conversations);
  });
}

// Messages
export async function sendMessage(
  conversationId: string,
  data: Omit<Message, "id" | "createdAt">
) {
  const ref = await addDoc(
    collection(db, "conversations", conversationId, "messages"),
    {
      ...data,
      createdAt: serverTimestamp(),
    }
  );
  // Update conversation's lastMessage
  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: data.text,
    lastMessageAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Message)
    );
    callback(messages);
  });
}

// Reviews
export async function createReview(
  data: Omit<Review, "id" | "createdAt">
) {
  const ref = await addDoc(collection(db, "reviews"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("revieweeId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

// Find or create conversation between two users
export async function findOrCreateConversation(
  userId1: string,
  userName1: string,
  userPhoto1: string,
  userId2: string,
  userName2: string,
  userPhoto2: string,
  relatedRequestId?: string,
  relatedProposalId?: string
): Promise<string> {
  // Look for existing conversation
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId1)
  );
  const snap = await getDocs(q);
  const existing = snap.docs.find((d) => {
    const data = d.data();
    return data.participants.includes(userId2);
  });

  if (existing) return existing.id;

  return createConversation({
    participants: [userId1, userId2],
    participantNames: { [userId1]: userName1, [userId2]: userName2 },
    participantPhotos: { [userId1]: userPhoto1, [userId2]: userPhoto2 },
    lastMessage: "",
    lastMessageAt: serverTimestamp() as any,
    unreadCount: { [userId1]: 0, [userId2]: 0 },
    ...(relatedRequestId && { relatedRequestId }),
    ...(relatedProposalId && { relatedProposalId }),
  });
}
