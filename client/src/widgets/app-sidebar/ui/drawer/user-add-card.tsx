import { useTheme } from "next-themes";

import { Card, CardContent, CardDescription, CardTitle } from "@shared/ui/card";
import { MagicCard } from "@shared/ui/magic-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { UserWithMembershipsId } from "@/shared/types/bd-types";
import {
  AddUserToCompanyBtn,
  DelUserFromCompanyBtn,
} from "@/feature/company-members-btns";

export function UserAddCard({ user }: { user: UserWithMembershipsId }) {
  const { resolvedTheme } = useTheme();
  if (!resolvedTheme) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Card className="w-full max-w-sm border-none p-0 shadow-none rounded-none">
      <MagicCard
        mode="orb"
        glowFrom={isDark ? "#10b981" : "#d1fae5"}
        glowTo={isDark ? "#34d399" : "#a7f3d0"}
        gradientFrom="#10b981"
        gradientTo="#34d399"
        className="p-0 rounded-none"
      >
        <CardContent className="border-border cursor-pointer border-b p-4 [.border-b]:pb-4">
          <div className="flex items-center justify-between">
            <Avatar className="shrink-0 mr-2">
              <AvatarImage src={user?.image || undefined} alt="user-avatar" />
              <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle>{user.name}</CardTitle>
              <CardDescription className="mt-1 truncate">
                {user.email}
              </CardDescription>
            </div>

            {user.isMember ? (
              <DelUserFromCompanyBtn memberId={user.id} />
            ) : (
              <AddUserToCompanyBtn memberId={user.id} />
            )}
          </div>
        </CardContent>
      </MagicCard>
    </Card>
  );
}
