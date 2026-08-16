import {
  Blocks,
  ClipboardClock,
  Palette,
  StickyNotes,
  UserPen,
} from "lucide-react";

export const DATA = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Blocks,
    },
    {
      title: "Tasks",
      url: "/tasks",
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
    icon: UserPen,
  },
  {
    title: "Appearance",
    url: "appearance",
    icon: Palette,
  },
];
