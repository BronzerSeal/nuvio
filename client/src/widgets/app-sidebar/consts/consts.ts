import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";
import {
  Blocks,
  ChartNoAxesColumn,
  CalendarRange,
  StickyNotes,
} from "lucide-react";

export const DATA = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      // isActive: true,
      icon: Blocks,
    },
    {
      title: "Tasks",
      url: "#",
      // isActive: true,
      icon: StickyNotes,
    },
    {
      title: "Calendar",
      url: "#",
      // isActive: true,
      icon: CalendarRange,
    },
    {
      title: "Analytics",
      url: "#",
      // isActive: true,
      icon: ChartNoAxesColumn,
    },
    //   {
    //     title: "Documentation",
    //     url: "#",
    //     isActive: true,
    //     icon: BookOpen,
    //     items: [
    //       {
    //         title: "Introduction",
    //         url: "#",
    //       },
    //       {
    //         title: "Get Started",
    //         url: "#",
    //       },
    //       {
    //         title: "Tutorials",
    //         url: "#",
    //       },
    //       {
    //         title: "Changelog",
    //         url: "#",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings2,
    //     items: [
    //       {
    //         title: "General",
    //         url: `${SITE_ENDPOINTS.account}/settings`,
    //       },
    //       {
    //         title: "Team",
    //         url: "#",
    //       },
    //       {
    //         title: "Billing",
    //         url: "#",
    //       },
    //       {
    //         title: "Limits",
    //         url: "#",
    //       },
    //     ],
    //   },
    // ],
    // projects: [
    //   {
    //     name: "Design Engineering",
    //     url: "#",
    //     icon: Frame,
    //   },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
  ],
};
