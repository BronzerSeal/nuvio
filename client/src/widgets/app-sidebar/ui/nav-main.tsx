import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/ui/sidebar";
import { DATA } from "../consts/consts";
import { MemberDrawer } from "./drawer/member-drawer";
import { useParams } from "next/navigation";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";

const NavMain = () => {
  const { companyId } = useParams() as { companyId?: string };

  if (!companyId) return <p>Loading</p>;
  return (
    <SidebarGroup>
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

        <MemberDrawer />
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
