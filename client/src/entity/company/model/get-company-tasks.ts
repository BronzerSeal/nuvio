import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { CursorPaginationResponse, Task } from "@/shared/types/bd-types";

export const getCompanyTasks = async (
  companyId: string,
  cursorId?: string,
): Promise<CursorPaginationResponse<Task[]>> => {
  const response = await http.get(
    SERVER_ENDPOINTS.company.companyTasks(companyId),
    {
      params: {
        cursor: cursorId,
        limit: 15,
      },
    },
  );

  return response.data;
};
