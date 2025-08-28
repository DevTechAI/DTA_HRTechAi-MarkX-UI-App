import { QueryClientProvider } from "@/components/providers/query-client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: {
    default: "MarkX",
    template: "%s | MarkX",
  },
  description: "MarkX",
  manifest: "/manifest.json",
  icons: {
    icon: "/DevTechAI_Logo_June2025.png",
    shortcut: "/DevTechAI_Logo_June2025.png",
    apple: "/DevTechAI_Logo_June2025.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
