import { useTheme } from "next-themes";

import { Card, CardContent, CardDescription, CardTitle } from "@shared/ui/card";
import { MagicCard } from "@shared/ui/magic-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { CroppedUser } from "@/shared/types/bd-types";

export function UserCard({ user }: { user: CroppedUser }) {
  const { resolvedTheme } = useTheme();

  if (!resolvedTheme) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Card className="w-full max-w-sm border-none p-0 shadow-none rounded-none">
      <MagicCard
        mode="orb"
        glowFrom={isDark ? "#ee4f27" : "#E9D5FF"}
        glowTo={isDark ? "#6b21ef" : "#FBCFE8"}
        className="p-0 rounded-none"
      >
        <CardContent className="border-border cursor-pointer border-b p-4 [.border-b]:pb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.image || undefined} alt="user-avatar" />
              <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{user.name}</CardTitle>
              <CardDescription className="mt-1">{user.email}</CardDescription>
            </div>
          </div>
        </CardContent>
      </MagicCard>
    </Card>
  );
}
