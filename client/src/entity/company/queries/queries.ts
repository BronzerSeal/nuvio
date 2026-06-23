import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { joinOrCreateCompany } from "../model/create-company";
import { toast } from "sonner";
import { queryClient } from "@/shared/lib/query-client";
import { CompanyIcon } from "../consts/company-icons";
import { getUserCompanies } from "../model/get-user-companies";
import getCompanyMemberships from "../model/get-user-memberships";
import { CreateCompanyMember } from "../model/create-company-member";
import { DeleteCompanyMember } from "../model/delete-company-member";
import { getErrorMessage } from "@/shared/utils/get-error-msg";

export const useJoinOrCreateCompany = () => {
  return useMutation({
    mutationKey: ["join-or-create-company"],
    mutationFn: ({
      companyName,
      description,
      logo,
    }: {
      companyName: string;
      description?: string;
      logo?: CompanyIcon;
    }) => joinOrCreateCompany(companyName, description, logo),

    onSuccess: () => {
      toast.success("Company created / joined successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-memberships"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-companies"],
      });
    },
  });
};

export const useUserCompanies = () => {
  return useQuery({
    queryKey: ["user-companies"],
    queryFn: () => getUserCompanies(),
  });
};

export const useCompanyMemberships = (companyId: string, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: ["company-memberships", companyId],

    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getCompanyMemberships(companyId, pageParam),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
    },
    select: (result) => result.pages.flatMap((p) => p.data),

    enabled,
  });
};

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
