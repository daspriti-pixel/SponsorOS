import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, CheckSquare, Database, Gauge, KanbanSquare, Users, Wallet } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";

export const NAV = [
  { group: "Overview", items: [{ title: "Command Center", url: "/", icon: Gauge }] },
  { group: "Growth", items: [
    { title: "Sponsors", url: "/sponsors", icon: Users },
    { title: "Deal Pipeline", url: "/pipeline", icon: KanbanSquare },
    { title: "Growth Analytics", url: "/analytics", icon: BarChart3 },
  ] },
  { group: "Revenue", items: [{ title: "Revenue & Collections", url: "/revenue", icon: Wallet }] },
  { group: "Execution", items: [{ title: "Task Manager", url: "/tasks", icon: CheckSquare }] },
  { group: "System", items: [{ title: "Data Explorer", url: "/data", icon: Database }] },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">S</div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-semibold text-sidebar-foreground">SponsorOS</div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">From Prospect to Payment.</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {NAV.map((g) => (
          <SidebarGroup key={g.group}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">{g.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={path === item.url} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-3 pb-4 text-[11px] text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
        Sponsorship growth workspace
      </SidebarFooter>
    </Sidebar>
  );
}
