"use client";

import { RequestForm } from "@/components/requests/request-form";

export default function NewRequestPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Delivery Request</h1>
      <RequestForm />
    </div>
  );
}
