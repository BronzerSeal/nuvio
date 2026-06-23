"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserMemberships } from "../model/get-user-memberships";
import { getUsers } from "../model/find-users";

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
