"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { DateTimeDisplay } from "@/components/ui/DateTimeDisplay";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSetupMockUser } from "@/lib/mock-auth";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Setup mock user for development purposes
  const setupUser = useSetupMockUser();

  useEffect(() => {
    setupUser();
  }, [setupUser]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <DateTimeDisplay />
              <Button
                variant="secondary"
                size="sm"
                className="whitespace-nowrap"
              >
                Help
              </Button>
              <ThemeToggle />
              <UserProfileMenu />
            </div>
          </header>
          <main className="container flex-1 animate-enter p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
