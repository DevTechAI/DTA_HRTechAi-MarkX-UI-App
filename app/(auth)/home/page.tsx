"use client";

import { IdeationFAB } from "@/components/ui/ideation-popup";
import { useAuthStore } from "@/store/auth";

export default function Page() {
  const { user } = useAuthStore();
  
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        {/* DevTech AI Icon */}
        <div className="flex items-center justify-center">
          <img
            src="/lovable-uploads/8988fb1e-243f-488b-b480-40f062a17c5a.png"
            alt="DevTech AI"
            className="h-16 w-16"
          />
        </div>
        
        <h1 className="text-6xl font-bold">MarkX</h1>
        <p className="text-2xl text-muted-foreground">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ''}
        </p>
      </div>

      {/* Floating Ideation Button */}
      <IdeationFAB />
    </>
  );
}
