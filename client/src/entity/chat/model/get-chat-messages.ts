import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { ChatMessage, CursorPaginationResponse } from "@/shared/types/bd-types";

const getChatMessages = async (
  companyId: string,
  senderId: string,
  cursorId?: string,
): Promise<CursorPaginationResponse<ChatMessage>> => {
  const response = await http.get(
    SERVER_ENDPOINTS.chat.getChatMessages(companyId, senderId),
    { params: { cursorId } },
  );

  return response.data;
};

export default getChatMessages;
