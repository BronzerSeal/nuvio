"use client";
import { useMutation } from "@tanstack/react-query";
import { joinOrCreateCompany } from "../model/create-company";
import { queryClient } from "@/shared/lib/query-client";
import { toast } from "sonner";
import { createBoard } from "../model/create-board";

export const useJoinOrCreateCompany = () => {
  return useMutation({
    mutationKey: ["join-or-create-company"],
    mutationFn: (companyName: string) => joinOrCreateCompany(companyName),

    onSuccess: () => {
      toast.success("Company created / joined successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-memberships"],
      });
    },
  });
};

export const useCreateBoard = () => {
  return useMutation({
    mutationKey: ["create-board"],
    mutationFn: ({
      boardName,
      companyId,
    }: {
      boardName: string;
      companyId: string;
    }) => createBoard(boardName, companyId),

    onSuccess: () => {
      toast.success("board created ");
    },

    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["user-info"],
    //   });
    // },
  });
};
