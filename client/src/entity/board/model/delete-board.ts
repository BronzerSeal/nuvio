import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const deleteBoard = async (boardId: string) => {
  const response = await http.delete(
    SERVER_ENDPOINTS.board.deleteBaord(boardId),
  );

  return response.data;
};
