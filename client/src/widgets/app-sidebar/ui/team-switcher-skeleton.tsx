import { Skeleton } from "@/shared/ui/skeleton";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/ui/sidebar";

export const TeamSwitcherSkeleton = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="flex items-center gap-2">
          {/* icon */}
          <Skeleton className="size-8 rounded-lg bg-black/10 dark:bg-white/10" />
          {/* text */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <Skeleton className="block h-3 w-24 bg-black/10 dark:bg-white/10" />
            <Skeleton className="block h-3 w-12 bg-black/10 dark:bg-white/10" />
          </div>

          {/* chevron */}
          <Skeleton className="ml-auto size-4 rounded bg-black/10 dark:bg-white/10" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
