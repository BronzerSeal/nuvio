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
import { MoreHorizontal, Forward, Trash2 } from "lucide-react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useCompanyBoards, useDeleteBoard } from "@/entity/board";
import { useParams } from "next/navigation";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";
import { SimpleLoader } from "@/shared/ui/loader";
import { toast } from "sonner";
import Link from "next/link";

const NavBoards = () => {
  const isMobile = useIsMobile();
  const { companyId, boardId } = useParams() as {
    companyId?: string;
    boardId?: string;
  };
  const { mutate: deleteBoard } = useDeleteBoard();

  const { data: companyBoards, isLoading: isCompanyBoardsLoading } =
    useCompanyBoards(companyId!, !!companyId);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Boards</SidebarGroupLabel>
      <SidebarMenu>
        {isCompanyBoardsLoading ? (
          <div className="p-2">
            <SimpleLoader />
          </div>
        ) : !companyId ? (
          <p>no company</p>
        ) : (
          companyBoards?.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={boardId === item.id}>
                {boardId === item.id ? (
                  <span className="cursor-default">{item.name}</span>
                ) : (
                  <Link href={SITE_ENDPOINTS.boards(companyId!, item.id)}>
                    {item.name}
                  </Link>
                )}
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
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard
                        .writeText(SITE_ENDPOINTS.boards(companyId, item.id))
                        .then(() => toast.success("Copied to clipboard"))
                    }
                  >
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => deleteBoard(item.id)}>
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
