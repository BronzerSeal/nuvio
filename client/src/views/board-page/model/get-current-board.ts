import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { BoardWithTasks } from "@/shared/types/bd-types";

export const getCurrentBoard = async (
  boardId: string,
  companyId: string,
): Promise<BoardWithTasks> => {
  const response = await http.get(
    SERVER_ENDPOINTS.board.getCurrentBoard(companyId, boardId),
  );

  return response.data;
};
