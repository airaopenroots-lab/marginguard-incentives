"use client";

import { Home, FileText, BarChart3, History, Settings, Brain } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Deal Approval", url: "/deal-approval", icon: FileText },
  { title: "Planning Workbench", url: "/planning", icon: BarChart3 },
  { title: "AI Insights", url: "/insights", icon: Brain },
  { title: "History & Feedback", url: "/history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <div className="font-semibold text-lg tracking-tight">Marginguard</div>
              <div className="text-[10px] text-muted-foreground -mt-1">INCENTIVES OS</div>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Core Workflows</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <div className="px-3 py-4 text-xs text-muted-foreground border-t">
              Sprint 0 • Version 1 Prototype<br />
              PostgreSQL + pgvector ready
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
