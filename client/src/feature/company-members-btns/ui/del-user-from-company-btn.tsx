"use client";

import { useDeleteCompanyMember } from "@/entity/company";
import { LiquidButton } from "@/shared/ui/liquid-button";
import { LogOut } from "lucide-react";
import { useParams } from "next/navigation";

export const DelUserFromCompanyBtn = ({ memberId }: { memberId: string }) => {
  const { companyId } = useParams() as { companyId: string | undefined };
  const { mutate: deleleteUser, isPending } = useDeleteCompanyMember();

  const handleDeleteUserFromCompany = () => {
    if (!companyId) return;

    const formData = {
      companyId,
      memberId,
    };

    deleleteUser(formData);
  };

  return (
    <LiquidButton
      variant={"destructive"}
      size={"default"}
      className="shrink-0"
      disabled={isPending}
      onClick={handleDeleteUserFromCompany}
    >
      {<LogOut color="black" />}
    </LiquidButton>
  );
};
