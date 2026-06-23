import {
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  SquareTerminal,
  Bot,
  BookOpen,
  Settings2,
  Frame,
  PieChart,
} from "lucide-react";

export const COMPANY_ICONS = {
  gallery: GalleryVerticalEnd,
  waveform: AudioWaveform,
  command: Command,
  terminal: SquareTerminal,
  bot: Bot,
  book: BookOpen,
  settings: Settings2,
  frame: Frame,
  chart: PieChart,
} as const;

export type CompanyIcon = keyof typeof COMPANY_ICONS;
