import { z } from "zod";

export const getChatMembers = z.object({
  companyId: z.string(),
});
export const getChatMessages = z.object({
  companyId: z.string(),
  conversationId: z.string(),
});
export const getConversation = z.object({
  companyId: z.string(),
  userId: z.string(),
});
export const sendChatMessageBody = z.object({
  message: z.string().trim().min(1).max(5000),
});
export const getChatMembersQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  cursorId: z.string().optional(),
});

export type getChatMembersDto = z.infer<typeof getChatMembers>;
export type getChatMessagesDto = z.infer<typeof getChatMessages>;
export type getConversationDto = z.infer<typeof getConversation>;
export type sendChatMessageBodyDto = z.infer<typeof sendChatMessageBody>;
export type getChatMembersQuerySchemaDto = z.infer<
  typeof getChatMembersQuerySchema
>;
