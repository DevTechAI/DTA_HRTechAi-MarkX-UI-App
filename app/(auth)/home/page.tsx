"use client";

import { IdeationFAB } from "@/components/ui/ideation-popup";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const { user } = useAuthStore();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate page loading delay
  useEffect(() => {
    const loadPageData = async () => {
      setIsPageLoading(true);

      // Simulate loading delay (1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPageLoading(false);
    };

    loadPageData();
  }, []);

  // Show loading spinner while page is loading
  if (isPageLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Home...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-[60vh] flex-col items-center justify-start space-y-4 pt-8">
        {/* DevTech AI Icon */}
        <div className="flex items-center justify-center">
          <Image
            src="/DevTechAI_Logo_June2025.png"
            alt="DevTech AI"
            width={128}
            height={128}
            className="h-32 w-32 sm:h-36 sm:w-36"
          />
        </div>

        <h1 className="text-6xl font-bold">MarkX</h1>
        <p className="text-2xl text-muted-foreground">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ""}
        </p>
      </div>

      {/* Floating Ideation Button */}
      <IdeationFAB />
    </>
  );
}
