"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "HOME", url: "/home", iconPng: "/logos/house.png" },
  { title: "WORKDAY", url: "/attendance", iconPng: "/logos/briefcase.png" },
  { title: "LEAVES", url: "/leave", iconPng: "/logos/leave.png" },
  { title: "CLAIMS", url: "/expenses", iconPng: "/logos/money.png" },
  {
    title: "WEEKLY AVAILABILITY",
    url: "/timesheets",
    iconPng: "/logos/availability.png",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar
      collapsible="icon"
      className="transition-all duration-300 ease-in-out"
    >
      <SidebarContent className="transition-all duration-300 ease-in-out">
        {/* MarkX Branding Section */}
        <SidebarGroup>
          <div className="flex items-center justify-center py-3 transition-all duration-300 ease-in-out">
            {collapsed ? (
              <Link
                href="/home"
                className="transition-opacity duration-200 hover:opacity-80"
              >
                <Image
                  src="/DevTechAI_Logo_June2025.png"
                  alt="DevTechAI logo"
                  width={40}
                  height={40}
                  className="min-h-[2.5rem] min-w-[2.5rem] flex-shrink-0"
                />
              </Link>
            ) : (
              <Link
                href="/home"
                className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
              >
                <Image
                  src="/DevTechAI_Logo_June2025.png"
                  alt="DevTechAI logo"
                  width={40}
                  height={40}
                  className="min-h-[2.5rem] min-w-[2.5rem] flex-shrink-0"
                />
                <span className="whitespace-nowrap text-2xl font-bold tracking-tight text-primary">
                  MarkX Apps
                </span>
              </Link>
            )}
          </div>
        </SidebarGroup>

        {/* Visual Separator */}
        <div className="mx-2 my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent transition-all duration-300 ease-in-out"></div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5 transition-all duration-300 ease-in-out">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {collapsed ? (
                      <Link
                        href={item.url}
                        className={[
                          "flex items-center justify-center rounded-lg py-2.5 transition-all duration-300 ease-in-out",
                          isActive(item.url)
                            ? "bg-primary/10 font-semibold text-primary"
                            : "hover:bg-secondary/80",
                        ].join(" ")}
                      >
                        <Image
                          src={item.iconPng}
                          alt={item.title}
                          width={24}
                          height={24}
                          className="min-h-[1.5rem] min-w-[1.5rem] flex-shrink-0"
                        />
                      </Link>
                    ) : (
                      <Link
                        href={item.url}
                        className={[
                          "mx-1 flex items-center gap-4 rounded-lg px-3 py-2.5 transition-all duration-300 ease-in-out",
                          isActive(item.url)
                            ? "bg-primary/10 font-semibold text-primary"
                            : "hover:translate-x-1 hover:bg-secondary/80",
                        ].join(" ")}
                      >
                        <Image
                          src={item.iconPng}
                          alt={item.title}
                          width={24}
                          height={24}
                          className="min-h-[1.5rem] min-w-[1.5rem] flex-shrink-0"
                        />
                        <span className="whitespace-nowrap text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
