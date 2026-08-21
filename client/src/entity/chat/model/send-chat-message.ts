import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { ChatMessage } from "@/shared/types/bd-types";

type SendChatMessageParams = {
  companyId: string;
  senderId: string;
  message: string;
};

const sendChatMessage = async ({
  companyId,
  senderId,
  message,
}: SendChatMessageParams): Promise<ChatMessage> => {
  const response = await http.post<ChatMessage>(
    SERVER_ENDPOINTS.chat.getChatMessages(companyId, senderId),
    { message },
  );

  return response.data;
};

export default sendChatMessage;
