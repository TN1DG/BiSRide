"use client";

import Link from "next/link";
import { Bike, Package, Truck, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Bike className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">BiSRide</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Delivery Made
          <span className="text-primary"> Simple</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Nigeria&apos;s logistics marketplace connecting businesses with trusted delivery
          riders. Post requests, receive proposals, and get your packages delivered.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/register">
              Start Delivering <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/register">I Need Deliveries</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Post a Request</h3>
              <p className="mt-2 text-muted-foreground">
                Businesses post delivery requests with pickup, dropoff, and budget details.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Get Matched</h3>
              <p className="mt-2 text-muted-foreground">
                Riders browse requests or proactively reach out to businesses with proposals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Chat & Deliver</h3>
              <p className="mt-2 text-muted-foreground">
                Coordinate via in-app messaging. Track status from pickup to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2026 BiSRide. Built for Nigerian businesses and riders.
        </div>
      </footer>
    </div>
  );
}
