import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
} from "@/shared/ui/dropdown";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/ui/sidebar";
import { ChevronsUpDown, Sparkles, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { authClient } from "@/shared/lib/auth";
import { useParams, useRouter } from "next/navigation";
import { USER_NAV_URLS } from "../consts/consts";
import Link from "next/link";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";
import { useFindMe } from "@/entity/user";

const NavUser = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data: session } = useFindMe();
  const { companyId } = useParams() as { companyId?: string };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session?.image ?? undefined}
                  alt={session?.name}
                />
                <AvatarFallback className="rounded-lg">
                  {session?.name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{session?.name}</span>
                <span className="truncate text-xs">{session?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.image ?? undefined}
                    alt={session?.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.name}
                  </span>
                  <span className="truncate text-xs">{session?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {USER_NAV_URLS.map((item) => (
                <Link
                  href={SITE_ENDPOINTS.settings(companyId ?? "", item.url)}
                  key={item.title}
                >
                  <DropdownMenuItem>
                    {item.icon && <item.icon />}
                    {item.title}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
