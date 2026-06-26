"use client";
import { useCreateCompanyMember } from "@/entity/company";
import { LiquidButton } from "@/shared/ui/liquid-button";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

export const AddUserToCompanyBtn = ({ memberId }: { memberId: string }) => {
  const { mutate: createUser, isPending } = useCreateCompanyMember();
  const { companyId } = useParams() as { companyId: string | undefined };

  const handleAddUserToCompany = () => {
    if (!companyId) return;

    const formData = {
      companyId,
      memberId,
    };

    createUser(formData);
  };

  return (
    <LiquidButton
      variant={"default"}
      size={"default"}
      className="shrink-0"
      disabled={isPending}
      onClick={handleAddUserToCompany}
    >
      <Plus />
    </LiquidButton>
  );
};
