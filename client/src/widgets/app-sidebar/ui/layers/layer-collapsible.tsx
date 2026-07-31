import { useCompanyAvailability } from "@/entity/availability";
import { useCompanyTimeline } from "@/entity/timeline";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/ui/sidebar";
import { ChevronRight, Layers } from "lucide-react";
import { useParams } from "next/navigation";

const LayerCollapsible = () => {
  const { companyId } = useParams() as { companyId: string | undefined };
  const { data: timeline, isLoading: isTimelineLoading } = useCompanyTimeline(
    companyId!,
    !!companyId,
  );
  const { data: availability, isLoading: isAvailabilityLoading } =
    useCompanyAvailability(companyId!, !!companyId);
  // console.log(timeline);

  const items = [
    timeline && companyId
      ? {
          title: "Timeline",
          href: SITE_ENDPOINTS.timeline(companyId, timeline.id),
        }
      : null,

    availability && companyId
      ? {
          title: "Availability",
          href: SITE_ENDPOINTS.availability(companyId, availability.id),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <Collapsible asChild className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton asChild className="w-full" tooltip="Layers">
            <div className="flex w-full items-center">
              <Layers />
              <span>Layers</span>
              <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
            </div>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {/* {item.items?.map((subItem) => ( */}
            <SidebarMenuSubItem>
              {isTimelineLoading ? (
                <p>Loading</p>
              ) : (
                items.map((item) => (
                  <SidebarMenuSubButton key={item.href} asChild>
                    <a href={item.href}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuSubButton>
                ))
              )}
            </SidebarMenuSubItem>
            {/* ))} */}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default LayerCollapsible;
