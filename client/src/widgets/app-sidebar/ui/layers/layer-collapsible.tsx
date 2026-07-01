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
  // console.log(timeline);
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
                <SidebarMenuSubButton asChild>
                  {companyId && timeline ? (
                    <a href={SITE_ENDPOINTS.timeline(companyId, timeline?.id)}>
                      <span>Timeline</span>
                    </a>
                  ) : (
                    <p>No company</p>
                  )}
                </SidebarMenuSubButton>
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
