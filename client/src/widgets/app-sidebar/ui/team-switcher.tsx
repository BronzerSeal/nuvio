import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
  DropdownMenu,
} from "@/shared/ui/dropdown";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/ui/sidebar";
import { ChevronsUpDown, Plus, PlusIcon } from "lucide-react";
import React from "react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  COMPANY_ICONS,
  CreateCompanyModal,
  useUserCompanies,
} from "@/entity/company";
import { TeamSwitcherSkeleton } from "./team-switcher-skeleton";
import { useParams, useRouter } from "next/navigation";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";

const TeamSwitcher = () => {
  const isMobile = useIsMobile();
  const params = useParams();
  const router = useRouter();

  const { data: companies, isLoading } = useUserCompanies();

  const activeTeamId = params.companyId as string | undefined;

  React.useEffect(() => {
    if (!companies?.length) return;

    if (!activeTeamId) {
      router.replace(SITE_ENDPOINTS.companyBoards(companies[0].id));
    }
  }, [companies, activeTeamId, router]);

  const activeTeam = React.useMemo(() => {
    return companies?.find((c) => c.id === activeTeamId) ?? null;
  }, [companies, activeTeamId]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (companies?.length == 0)
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => setIsModalOpen((prev) => !prev)}
          >
            <PlusIcon color="black" />
          </SidebarMenuButton>
        </SidebarMenuItem>
        <CreateCompanyModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </SidebarMenu>
    );
  if (isLoading || !activeTeam) return <TeamSwitcherSkeleton />;

  const Icon = COMPANY_ICONS[activeTeam.logo];
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {Icon && <Icon className="size-4" />}
                  {/* {COMPANY_ICONS[activeTeam.logo as CompanyIcon]} */}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                companies
              </DropdownMenuLabel>
              {companies?.map((team, index) => {
                const Icon = COMPANY_ICONS[team.logo];

                return (
                  <DropdownMenuItem
                    key={team.name}
                    onClick={() => {
                      router.push(SITE_ENDPOINTS.companyBoards(team.id));
                    }}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {Icon && <Icon className="size-4 shrink-0" />}
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setIsModalOpen((prev) => !prev)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add company
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateCompanyModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default TeamSwitcher;
