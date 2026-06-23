"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCompanyBoards } from "../model/get-company-boards";
import { createBoard } from "../model/create-board";
import { toast } from "sonner";
import { queryClient } from "@/shared/lib/query-client";
import { getBoardTasks } from "../model/get-board-tasks";

export const useCompanyBoards = (companyId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["company-boards", companyId],
    queryFn: () => getCompanyBoards(companyId),
    enabled,
  });
};

export const useBoardTasks = (boardId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["board-task", boardId],
    queryFn: () => getBoardTasks(boardId),
    enabled,
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

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-boards"],
      });
    },
  });
};
