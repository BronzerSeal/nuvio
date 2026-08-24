import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

type ConversationResponse = {
  conversationId: string;
};

const getConversation = async (
  companyId: string,
  userId: string,
): Promise<ConversationResponse> => {
  const response = await http.get<ConversationResponse>(
    SERVER_ENDPOINTS.chat.getConversation(companyId, userId),
  );

  return response.data;
};

export default getConversation;
