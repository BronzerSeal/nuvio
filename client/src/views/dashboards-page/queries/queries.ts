"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBoard } from "../model/create-board";
import { queryClient } from "@/shared/lib/query-client";

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

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-boards"],
      });
    },
  });
};
