import { BackgroundRippleEffect } from "@/shared/ui/ripple-effect-bg/BackgroundRippleEffect";
import { MoveCompProvider } from "@/shared/providers/move-comp-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MoveCompProvider>
      <div className="relative isolate min-h-screen overflow-x-hidden bg-background text-foreground ">
        <BackgroundRippleEffect />
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </div>
    </MoveCompProvider>
  );
}
