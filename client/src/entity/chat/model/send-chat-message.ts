import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { ChatMessage } from "@/shared/types/bd-types";

type SendChatMessageParams = {
  companyId: string;
  conversationId: string;
  message: string;
};

const sendChatMessage = async ({
  companyId,
  conversationId,
  message,
}: SendChatMessageParams): Promise<ChatMessage> => {
  const response = await http.post<ChatMessage>(
    SERVER_ENDPOINTS.chat.getChatMessages(companyId, conversationId),
    { message },
  );

  return response.data;
};

export default sendChatMessage;
