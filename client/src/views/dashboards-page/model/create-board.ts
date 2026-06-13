import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const createBoard = async (boardName: string, companyId: string) => {
  const response = await http.post(SERVER_ENDPOINTS.board.createBoard, {
    name: boardName,
    companyId,
  });

  return response.data;
};
