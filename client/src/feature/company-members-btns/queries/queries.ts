import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/shared/lib/query-client";
import { CreateCompanyMember } from "../model/create-company-member";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { DeleteCompanyMember } from "../model/delete-company-member";

export const useCreateCompanyMember = () => {
  return useMutation({
    mutationKey: ["create-company-member"],
    mutationFn: ({
      companyId,
      memberId,
      memberRole,
    }: {
      companyId: string;
      memberId: string;
      memberRole?: string;
    }) => CreateCompanyMember(companyId, memberId, memberRole),

    onSuccess: () => {
      toast.success("user added successfull");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["company-memberships", variables.companyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["find-users"],
      });
    },
  });
};

export const useDeleteCompanyMember = () => {
  return useMutation({
    mutationKey: ["delete-company-member"],
    mutationFn: ({
      companyId,
      memberId,
    }: {
      companyId: string;
      memberId: string;
    }) => DeleteCompanyMember(companyId, memberId),

    onSuccess: () => {
      toast.success("user deleted successfull");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["company-memberships", variables.companyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["find-users"],
      });
    },
  });
};
