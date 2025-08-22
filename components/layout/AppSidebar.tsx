"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { CalendarCheck, CalendarRange, Clock, Home, Receipt, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "WORKDAY 💼💻", url: "/attendance", icon: Clock },
  { title: "LEAVES 🧳✈️⛱️", url: "/leave", icon: CalendarCheck },
  { title: "CLAIMS 💵💰💳", url: "/expenses", icon: Receipt },
  { title: "Weekly Availability", url: "/timesheets", icon: CalendarRange },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src="/lovable-uploads/8988fb1e-243f-488b-b480-40f062a17c5a.png"
                alt="MarkX logo"
                className="h-4 w-4"
              />
              MarkX
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={[
                        "flex items-center gap-2 rounded-md p-2",
                        isActive(item.url)
                          ? "bg-secondary text-primary font-medium"
                          : "hover:bg-secondary",
                      ].join(" ")}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
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
