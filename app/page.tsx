'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DateTimeDisplay } from "@/components/ui/date-time-display";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const { toast } = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      {/* Loading Spinner for OAuth authentication */}
      <LoadingSpinner isLoading={isAuthenticating} />
      
      {/* DateTime display in top right corner */}
      <div className="absolute top-4 right-4">
        <div className="bg-muted/30 py-1 px-3 rounded-md hidden sm:block">
          <DateTimeDisplay />
        </div>
      </div>
      
      <section aria-labelledby="landing-heading" className="w-full px-4">
        <Card className="mx-auto max-w-md overflow-hidden">
          <div className="h-1 w-full bg-primary" aria-hidden="true" />

          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <img
                src="/lovable-uploads/8988fb1e-243f-488b-b480-40f062a17c5a.png"
                alt="MarkX logo"
                className="h-7 w-7"
              />
              <h1 id="landing-heading" className="text-3xl font-semibold tracking-tight">
                MarkX
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">Sign into your account</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              aria-label="Sign in with Microsoft"
              onClick={() => {
                setIsAuthenticating(true);
                // Simulate OAuth authentication process
                setTimeout(() => {
                  setIsAuthenticating(false);
                  toast({
                    title: "Microsoft sign-in",
                    description: "Coming soon.",
                  });
                }, 2000);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="9" height="9" rx="1" />
                <rect x="13" y="2" width="9" height="9" rx="1" />
                <rect x="2" y="13" width="9" height="9" rx="1" />
                <rect x="13" y="13" width="9" height="9" rx="1" />
              </svg>
              Sign in with Microsoft
            </Button>

            <div className="text-center mt-4">
              <Button
                asChild
                variant="default"
                size="lg"
                className="w-full"
              >
                <Link href="/home">
                  Continue to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
