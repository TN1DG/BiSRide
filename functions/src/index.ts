import * as admin from "firebase-admin";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";

admin.initializeApp();
const db = admin.firestore();

// When a message is sent, update conversation metadata
export const onMessageSend = onDocumentCreated(
  "conversations/{conversationId}/messages/{messageId}",
  async (event) => {
    const message = event.data?.data();
    const conversationId = event.params.conversationId;
    if (!message) return;

    const convRef = db.doc(`conversations/${conversationId}`);
    const conv = await convRef.get();
    const convData = conv.data();
    if (!convData) return;

    // Increment unread count for all participants except sender
    const unreadCount: Record<string, number> = convData.unreadCount || {};
    for (const participant of convData.participants) {
      if (participant !== message.senderId) {
        unreadCount[participant] = (unreadCount[participant] || 0) + 1;
      }
    }

    await convRef.update({
      lastMessage: message.text,
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      unreadCount,
    });
  }
);

// When a delivery request status changes, send system message to conversation
export const onRequestStatusChange = onDocumentUpdated(
  "deliveryRequests/{requestId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;
    if (before.status === after.status) return;

    const requestId = event.params.requestId;

    // Find related conversation
    const convQuery = await db
      .collection("conversations")
      .where("relatedRequestId", "==", requestId)
      .limit(1)
      .get();

    if (convQuery.empty) return;

    const convDoc = convQuery.docs[0];
    const statusMessages: Record<string, string> = {
      accepted: "Delivery request has been accepted",
      in_progress: "Delivery is now in progress",
      completed: "Delivery has been completed",
      cancelled: "Delivery request has been cancelled",
    };

    const msg = statusMessages[after.status];
    if (!msg) return;

    await convDoc.ref.collection("messages").add({
      senderId: "system",
      text: msg,
      type: "system",
      readBy: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await convDoc.ref.update({
      lastMessage: msg,
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);

// Update rider stats when a delivery is completed
export const onDeliveryComplete = onDocumentUpdated(
  "deliveryRequests/{requestId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;
    if (before.status === "completed" || after.status !== "completed") return;
    if (!after.riderId) return;

    const riderRef = db.doc(`users/${after.riderId}`);
    await riderRef.update({
      totalDeliveries: admin.firestore.FieldValue.increment(1),
    });
  }
);
