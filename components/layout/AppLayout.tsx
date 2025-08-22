import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { DateTimeDisplay } from "@/components/ui/DateTimeDisplay";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSetupMockUser } from "@/lib/mock-auth";
import Link from "next/link";
import { PropsWithChildren, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AppSidebar } from "./AppSidebar";
import { UserProfileMenu } from "./UserProfileMenu";

export default function AppLayout({ children }: PropsWithChildren) {
  // Setup mock user for development
  const setupUser = useSetupMockUser();
  
  useEffect(() => {
    setupUser();
  }, [setupUser]);
  
  return (
    <SidebarProvider>
      <Helmet>
        <title>MarkX</title>
        <meta name="description" content="Internal HR app: attendance, leave, expenses, and Timesheets." />
        <link rel="canonical" href="/" />
      </Helmet>
      <div className="min-h-screen flex w-full bg-background transition-colors duration-300">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                  src="/lovable-uploads/8988fb1e-243f-488b-b480-40f062a17c5a.png"
                  alt="MarkX logo"
                  className="h-6 w-6"
                />
                <h1 className="text-lg font-semibold">MarkX</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <DateTimeDisplay />
              <Button variant="secondary">Help</Button>
              <ThemeToggle />
              <UserProfileMenu />
            </div>
          </header>
          <main className="flex-1 p-4 container animate-enter">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
