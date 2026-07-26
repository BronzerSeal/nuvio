import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { joinOrCreateCompany } from "../model/create-company";
import { toast } from "sonner";
import { queryClient } from "@/shared/lib/query-client";
import { CompanyIcon } from "../consts/company-icons";
import { getUserCompanies } from "../model/get-user-companies";
import getCompanyMemberships from "../model/get-user-memberships";

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
