"use client";
import { TooltipProvider } from "@shared/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@shared/ui/sidebar";
import { AppSidebar } from "@widgets/app-sidebar";
import { SearchPanel } from "@/widgets/search-panel/ui/search-panel";

export function MoveCompProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset className="min-h-0">
          <SearchPanel />

          <div className="min-h-0 flex-1">{children}</div>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
