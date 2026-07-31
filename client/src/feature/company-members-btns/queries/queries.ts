import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/shared/lib/query-client";
import { CreateCompanyMember } from "../model/create-company-member";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { DeleteCompanyMember } from "../model/delete-company-member";
import type { MembershipWithUser } from "@/shared/types/bd-types";

type CompanyMembershipsCache = {
  pages: Array<{
    data: MembershipWithUser[];
    nextCursor: string | null;
    hasNextPage: boolean;
  }>;
  pageParams: Array<string | undefined>;
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

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["company-memberships", variables.companyId],
      });

      const previousMemberships =
        queryClient.getQueryData<CompanyMembershipsCache>([
          "company-memberships",
          variables.companyId,
        ]);

      const optimisticMember = {
        id: `optimistic-${crypto.randomUUID()}`,
        companyId: variables.companyId,
        createdAt: new Date().toISOString(),
        role: (variables.memberRole === "admin" ||
        variables.memberRole === "owner"
          ? variables.memberRole
          : "member") as MembershipWithUser["role"],
        userId: variables.memberId,
        user: {
          id: variables.memberId,
          email: "",
          image: undefined,
          name: "New member",
        },
        optimistic: true,
      } as MembershipWithUser & { optimistic: boolean };

      queryClient.setQueryData(
        ["company-memberships", variables.companyId],
        (old: CompanyMembershipsCache | undefined) => {
          if (!old) {
            return {
              pages: [
                {
                  data: [optimisticMember],
                  nextCursor: null,
                  hasNextPage: false,
                },
              ],
              pageParams: [undefined],
            };
          }

          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: [optimisticMember, ...page.data],
                  }
                : page,
            ),
          };
        },
      );

      return {
        previousMemberships,
        optimisticId: optimisticMember.id,
      };
    },

    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(
        ["company-memberships", variables.companyId],
        (old: CompanyMembershipsCache | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: page.data.map((member) =>
                      member.id === context?.optimisticId
                        ? {
                            ...member,
                            ...data,
                            id: data.id ?? member.id,
                            user: member.user,
                            optimistic: false,
                          }
                        : member,
                    ),
                  }
                : page,
            ),
          };
        },
      );

      toast.success("user added successfull");
    },

    onError: (error, variables, context) => {
      if (context?.previousMemberships) {
        queryClient.setQueryData(
          ["company-memberships", variables.companyId],
          context.previousMemberships,
        );
      }

      toast.error(getErrorMessage(error));
    },

    onSettled: (_, __, variables) => {
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
