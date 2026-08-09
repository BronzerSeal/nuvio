import { useCompanyAvailability } from "@/entity/availability";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";
import { SidebarMenuButton, SidebarMenuItem } from "@/shared/ui/sidebar";
import { CalendarRange } from "lucide-react";
import { useParams } from "next/navigation";

const CalendarButton = () => {
  const { companyId } = useParams() as { companyId?: string };

  const { data: availabilityId } = useCompanyAvailability(
    companyId!,
    !!companyId,
  );
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="py-4">
        <a
          href={
            companyId && availabilityId
              ? SITE_ENDPOINTS.availability(companyId, availabilityId.id)
              : ""
          }
          className="flex w-full items-center"
        >
          <CalendarRange />
          <span>Calendar</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default CalendarButton;
