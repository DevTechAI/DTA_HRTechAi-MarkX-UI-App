import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { DateTimeDisplay } from "@/components/ui/DateTimeDisplay";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSetupMockUser } from "@/lib/mock-auth";
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
        <meta
          name="description"
          content="Internal HR app: attendance, leave, expenses, and Timesheets."
        />
        <link rel="canonical" href="/" />
      </Helmet>
      <div className="flex min-h-screen w-full bg-background transition-colors duration-300">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <DateTimeDisplay />
              <Button variant="secondary">Help</Button>
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
