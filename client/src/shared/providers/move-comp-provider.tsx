"use client";
import { TooltipProvider } from "@shared/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@shared/ui/sidebar";
import { AppSidebar } from "@widgets/app-sidebar";
import { useIsMobile } from "../hooks/use-mobile";
import { SearchPanel } from "@/widgets/search-panel/ui/search-panel";

export function MoveCompProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        {/* {isMobile && <SidebarTrigger className={"absolute"} />} */}
        <SidebarInset>
          <SearchPanel />
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
