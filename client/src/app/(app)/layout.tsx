import { BackgroundRippleEffect } from "@/shared/ui/ripple-effect-bg/BackgroundRippleEffect";
import { MoveCompProvider } from "@/shared/providers/move-comp-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MoveCompProvider>
      <div className="relative isolate overflow-x-hidden bg-background text-foreground min-h-0 h-full">
        <BackgroundRippleEffect />
        <div className="relative z-10 flex h-full flex-col ">{children}</div>
      </div>
    </MoveCompProvider>
  );
}
