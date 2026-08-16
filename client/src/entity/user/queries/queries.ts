"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserMemberships } from "../model/get-user-memberships";
import { getUsers } from "../model/find-users";
import { getMe } from "../model/get-me";
import { updateUser } from "../model/update-user";
import { toast } from "sonner";
import { queryClient } from "@/shared/lib/query-client";

export const useUserMemberships = () => {
  return useQuery({
    queryKey: ["user-memberships"],
    queryFn: () => getUserMemberships(),
  });
};
export const useFindUsers = (
  userNameOrEmail: string,
  companyId: string,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["find-users", userNameOrEmail],
    queryFn: () => getUsers(userNameOrEmail, companyId),
    enabled,
  });
};

export const useFindMe = () => {
  return useQuery({
    queryKey: ["find-me"],
    queryFn: getMe,
  });
};

export const useUpdateMe = () => {
  return useMutation({
    mutationKey: ["update-me"],
    mutationFn: (userData: {
      bio: string;
      name: string;
      email: string;
      urls: { value: string }[];
    }) => updateUser(userData),

    onSuccess: () => {
      toast.success("User updated ");
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["find-me"],
      });
    },
  });
};
