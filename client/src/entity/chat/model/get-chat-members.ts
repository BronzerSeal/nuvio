import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { ChatMember, CursorPaginationResponse } from "@/shared/types/bd-types";

const getChatMembers = async (
  companyId: string,
  cursorId?: string,
): Promise<CursorPaginationResponse<ChatMember>> => {
  const response = await http.get(
    SERVER_ENDPOINTS.chat.getChatMembers(companyId),
    {
      params: {
        cursorId,
      },
    },
  );

  return response.data;
};

export default getChatMembers;
