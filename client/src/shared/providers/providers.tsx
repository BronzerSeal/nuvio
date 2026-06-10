"use client";
import { queryClient } from "@shared/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@shared/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@shared/ui/sidebar";
import { AppSidebar } from "@widgets/app-sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <TooltipProvider>
            <AppSidebar />
            <SidebarTrigger />
            {children}
          </TooltipProvider>
        </SidebarProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
