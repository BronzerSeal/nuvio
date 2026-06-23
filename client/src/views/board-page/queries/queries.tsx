import { useQuery } from "@tanstack/react-query";
import { getCurrentBoard } from "../model/get-current-board";

export const useCurrentBoard = (
  boardId: string,
  companyId: string,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["current-board", boardId, companyId],
    queryFn: () => getCurrentBoard(boardId, companyId),
    enabled,
  });
};
