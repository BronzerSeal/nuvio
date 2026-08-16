import {
  BadgeCheck,
  Bell,
  Blocks,
  ClipboardClock,
  CreditCard,
  StickyNotes,
} from "lucide-react";

export const DATA = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      // isActive: true,
      icon: Blocks,
    },
    {
      title: "Tasks",
      url: "/tasks",
      // isActive: true,
      icon: StickyNotes,
    },
    {
      title: "Schedule",
      url: "/schedule",
      icon: ClipboardClock,
    },
  ],
};

export const USER_NAV_URLS = [
  {
    title: "Profile",
    url: "profile",
    icon: BadgeCheck,
  },
  {
    title: "Appearance",
    url: "appearance",
    icon: CreditCard,
  },
  {
    title: "Account",
    url: "account",
    icon: Bell,
  },
];
