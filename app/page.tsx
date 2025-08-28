"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DateTimeDisplay } from "@/components/ui/date-time-display";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const { toast } = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      {/* Loading Spinner for OAuth authentication */}
      <LoadingSpinner isLoading={isAuthenticating} />

      {/* DateTime display in top right corner */}
      <div className="absolute right-4 top-4">
        <div className="hidden rounded-md bg-muted/30 px-3 py-1 sm:block">
          <DateTimeDisplay />
        </div>
      </div>

      <section aria-labelledby="landing-heading" className="w-full px-4">
        <Card className="mx-auto w-full max-w-xl overflow-hidden sm:max-w-2xl">
          <div className="h-1 w-full bg-primary" aria-hidden="true" />

          <CardHeader className="space-y-3 pb-4 pt-6 text-center">
            {/* Logo above the product name */}
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/DevTechAI_Logo_June2025.png"
                alt="DevTechAI logo"
                width={80}
                height={80}
                className="h-16 w-16 sm:h-20 sm:w-20"
              />
              <h1
                id="landing-heading"
                className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl"
              >
                MarkX
              </h1>
            </div>
            <p className="text-sm text-muted-foreground sm:text-base">
              Sign into your account
            </p>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-8 sm:space-y-5 sm:px-10">
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-full text-base"
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
                className="mr-2 h-7 w-7"
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

            <div className="text-center">
              <Button
                asChild
                variant="default"
                size="lg"
                className="h-14 w-full text-base"
              >
                <Link href="/home">Continue to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
