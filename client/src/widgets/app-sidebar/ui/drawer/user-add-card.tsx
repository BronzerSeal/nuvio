import { useTheme } from "next-themes";

import { Card, CardContent, CardDescription, CardTitle } from "@shared/ui/card";
import { MagicCard } from "@shared/ui/magic-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { UserWithMembershipsId } from "@/shared/types/bd-types";
import { Button } from "@/shared/ui/button";
import { Plus, X } from "lucide-react";
import { useCreateCompanyMember } from "@/entity/company/queries/queries";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/get-error-msg";

export function UserAddCard({
  user,
  companyId,
}: {
  user: UserWithMembershipsId;
  companyId: string | undefined;
}) {
  const { resolvedTheme } = useTheme();
  const { mutate } = useCreateCompanyMember();

  if (!resolvedTheme) return null;

  const isDark = resolvedTheme === "dark";

  const handleAddUserToCompany = () => {
    if (!companyId) return;

    const formData = {
      companyId,
      memberId: user.id,
    };

    mutate(formData, {
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },

      onSuccess: () => {
        toast.success("successful added to company");
      },
    });
  };

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
            <Button
              className={` ${user.isMember ? `bg-green-700 dark:bg-green-800 hover:bg-green-800` : "bg-gray-400 dark:bg-gray-700 hover:bg-gray-500"} `}
              onClick={handleAddUserToCompany}
            >
              {user.isMember ? <X /> : <Plus />}
            </Button>
          </div>
        </CardContent>
      </MagicCard>
    </Card>
  );
}
