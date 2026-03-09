"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Search, Building2, MapPin, Send } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProposalForm } from "@/components/riders/proposal-form";
import { getInitials } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";

export default function RiderBusinessesPage() {
  const [businesses, setBusinesses] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadBusinesses() {
      const q = query(collection(db, "users"), where("role", "==", "business"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => d.data() as UserProfile);
      setBusinesses(data);
      setLoading(false);
    }
    loadBusinesses();
  }, []);

  const filtered = businesses.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (b.businessName || "").toLowerCase().includes(term) ||
      (b.businessCategory || "").toLowerCase().includes(term) ||
      (b.businessAddress || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Discover Businesses</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search businesses by name, category, or location..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No businesses found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((biz) => (
            <Card key={biz.uid}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(biz.businessName || biz.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{biz.businessName || biz.displayName}</h3>
                    {biz.businessCategory && (
                      <p className="text-sm text-muted-foreground">{biz.businessCategory}</p>
                    )}
                    {biz.businessAddress && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {biz.businessAddress}
                      </p>
                    )}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4" size="sm" onClick={() => setSelectedBusiness(biz)}>
                      <Send className="h-4 w-4 mr-1" /> Send Proposal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Proposal to {biz.businessName || biz.displayName}</DialogTitle>
                    </DialogHeader>
                    {selectedBusiness && <ProposalForm business={selectedBusiness} />}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
