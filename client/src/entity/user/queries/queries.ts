"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserMemberships } from "../model/get-user-memberships";

export const useUserMemberships = () => {
  return useQuery({
    queryKey: ["user-memberships"],
    queryFn: () => getUserMemberships(),
  });
};
