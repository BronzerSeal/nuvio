import { Request, Response } from "express";
import {
  getChatMembersDto,
  getChatMessagesDto,
  getConversationDto,
  getChatMembersQuerySchemaDto,
  sendChatMessageBodyDto,
} from "../validate/chat.validation.js";
import { chatService } from "../services/index.js";
import { io } from "../server.js";

type getChatMemberRequest = Request<getChatMembersDto>;
type getChatMessagesRequest = Request<getChatMessagesDto>;
type getConversationRequest = Request<getConversationDto>;
type sendChatMessageRequest = Request<
  getChatMessagesDto,
  {},
  sendChatMessageBodyDto
>;

const getChatMembers = async (req: getChatMemberRequest, res: Response) => {
  const { limit, cursorId } =
    req.query as unknown as getChatMembersQuerySchemaDto;

  const boards = await chatService.getChatMembers({
    userId: req.user.id,
    ...req.params,
    limit,
    cursorId,
  });
  return res.status(200).json(boards);
};

const getChatMessages = async (req: getChatMessagesRequest, res: Response) => {
  const { limit, cursorId } =
    req.query as unknown as getChatMembersQuerySchemaDto;

  const messages = await chatService.getChatMessages({
    userId: req.user.id,
    ...req.params,
    limit,
    cursorId,
  });

  return res.status(200).json(messages);
};

const getConversation = async (req: getConversationRequest, res: Response) => {
  const conversation = await chatService.getConversation({
    userId: req.user.id,
    companyId: req.params.companyId,
    targetUserId: req.params.userId,
  });

  return res.status(200).json(conversation);
};

const sendChatMessage = async (req: sendChatMessageRequest, res: Response) => {
  const message = await chatService.sendChatMessage({
    userId: req.user.id,
    ...req.params,
    ...req.body,
  });

  io.to(req.params.conversationId).emit("conversation-updated");

  return res.status(201).json(message);
};

export { getChatMembers, getChatMessages, getConversation, sendChatMessage };
