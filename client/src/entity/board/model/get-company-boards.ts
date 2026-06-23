import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { Board } from "@/shared/types/bd-types";

export const getCompanyBoards = async (companyId: string): Promise<Board[]> => {
  const response = await http.get(
    SERVER_ENDPOINTS.board.companyBoard + companyId,
  );

  return response.data;
};
