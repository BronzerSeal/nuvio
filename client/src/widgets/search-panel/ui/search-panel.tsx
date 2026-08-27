"use client";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { SidebarTrigger } from "@/shared/ui/sidebar";

export function SearchPanel() {
  const isMobile = useIsMobile();
  return (
    <div className="w-full flex flex-col z-10">
      <div className="p-2 flex items-center">
        {isMobile && <SidebarTrigger />}
        <Input placeholder="Search" className="max-w-50" />
      </div>

      <Separator />
    </div>
  );
}
