"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { where, orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { User, MessageSquare, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { subscribeToProposals, updateProposal, findOrCreateConversation } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/auth-store";
import { formatCurrency, getInitials } from "@/lib/utils";
import type { Proposal } from "@/lib/types";

export default function BusinessProposalsPage() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const unsub = subscribeToProposals(
      [where("businessId", "==", profile.uid), orderBy("createdAt", "desc")],
      (data) => { setProposals(data); setLoading(false); }
    );
    return () => unsub();
  }, [profile]);

  const handleAccept = async (proposal: Proposal) => {
    await updateProposal(proposal.id, { status: "accepted" });
    const convId = await findOrCreateConversation(
      profile!.uid, profile!.displayName, profile!.photoURL || "",
      proposal.riderId, proposal.riderName, proposal.riderPhoto || "",
      undefined, proposal.id
    );
    toast.success("Proposal accepted! You can now message the rider.");
    router.push(`/messages/${convId}`);
  };

  const handleDecline = async (proposalId: string) => {
    await updateProposal(proposalId, { status: "declined" });
    toast.success("Proposal declined");
  };

  const pendingProposals = proposals.filter((p) => p.status === "pending");
  const otherProposals = proposals.filter((p) => p.status !== "pending");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Rider Proposals</h1>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}</div>
      ) : proposals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <User className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No proposals yet. Riders will find your business and reach out!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {pendingProposals.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Pending ({pendingProposals.length})</h2>
              <div className="space-y-4">
                {pendingProposals.map((p) => (
                  <Card key={p.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={p.riderPhoto} />
                          <AvatarFallback>{getInitials(p.riderName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{p.riderName}</h3>
                            <span className="text-lg font-bold text-primary">{formatCurrency(p.proposedPrice)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{p.message}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="capitalize">{p.vehicleType}</Badge>
                            {p.serviceAreas.map((a) => <Badge key={a} variant="secondary">{a}</Badge>)}
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={() => handleAccept(p)}>
                              <Check className="h-4 w-4 mr-1" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDecline(p.id)}>
                              <X className="h-4 w-4 mr-1" /> Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {otherProposals.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Past Proposals</h2>
              <div className="space-y-4">
                {otherProposals.map((p) => (
                  <Card key={p.id} className="opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(p.riderName)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{p.riderName}</span>
                        </div>
                        <Badge variant={p.status === "accepted" ? "success" : "destructive"}>
                          {p.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
