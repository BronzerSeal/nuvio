import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { Task } from "@/shared/types/bd-types";

export const getBoardTasks = async (boardId: string): Promise<Task[]> => {
  const response = await http.get(
    SERVER_ENDPOINTS.board.getBoardTasks(boardId),
  );

  return response.data;
};
