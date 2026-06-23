import { MoveCompProvider } from "@/shared/providers/move-comp-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MoveCompProvider>{children}</MoveCompProvider>;
}
