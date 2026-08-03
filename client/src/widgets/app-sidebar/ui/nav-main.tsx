import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/shared/ui/sidebar";

import { PlusIcon } from "lucide-react";
import { DATA } from "../consts/consts";
import React from "react";
import { CreateBoardModal } from "@/entity/board/ui/create-board-modal";
import { MemberDrawer } from "./drawer/member-drawer";
import { useParams } from "next/navigation";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";
const NavMain = () => {
  const [isNewBoardOpen, setIsNewBoardOpen] = React.useState(false);
  const { companyId } = useParams() as { companyId?: string };

  if (!companyId) return <p>Loading</p>;
  return (
    <SidebarGroup>
      {/* else */}
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {DATA.navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="py-4">
              <a
                href={SITE_ENDPOINTS.company(companyId) + item.url}
                className="flex w-full items-center"
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

        {/* Layer path  */}
        {/* <LayerCollapsible /> */}
        {/* members */}
        <MemberDrawer />
      </SidebarMenu>

      {/* new board */}
      <SidebarMenuSubItem
        className="cursor-pointer"
        onClick={() => setIsNewBoardOpen((prev) => !prev)}
      >
        <SidebarMenuSubButton asChild className="h-8">
          <div>
            <PlusIcon />
            <p>new board</p>
          </div>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <CreateBoardModal isOpen={isNewBoardOpen} setIsOpen={setIsNewBoardOpen} />
    </SidebarGroup>
  );
};

export default NavMain;
