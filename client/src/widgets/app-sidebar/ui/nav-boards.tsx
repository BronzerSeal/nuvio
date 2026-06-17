import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from "@/shared/ui/dropdown";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/shared/ui/sidebar";
import { MoreHorizontal, Folder, Forward, Trash2 } from "lucide-react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useCompanyBoards } from "@/entity/board";
import { useParams } from "next/navigation";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";
import { SimpleLoader } from "@/shared/ui/loader";

const NavBoards = () => {
  const isMobile = useIsMobile();
  const { companyId } = useParams() as { companyId: string | undefined };

  const { data: companyBoards, isLoading: isCompanyBoardsLoading } =
    useCompanyBoards(companyId!, !!companyId);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Boards</SidebarGroupLabel>
      <SidebarMenu>
        {!companyId || isCompanyBoardsLoading ? (
          <div className="p-2">
            <SimpleLoader />
          </div>
        ) : (
          companyBoards?.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <a href={SITE_ENDPOINTS.boards(companyId, item.id)}>
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        )}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavBoards;
