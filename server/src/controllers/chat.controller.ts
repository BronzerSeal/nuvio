import { Request, Response } from "express";
import {
  getChatMembersDto,
  getChatMessagesDto,
  getChatMembersQuerySchemaDto,
  sendChatMessageBodyDto,
} from "../validate/chat.validation.js";
import { chatService } from "../services/index.js";

type getChatMemberRequest = Request<getChatMembersDto>;
type getChatMessagesRequest = Request<getChatMessagesDto>;
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

const sendChatMessage = async (req: sendChatMessageRequest, res: Response) => {
  const message = await chatService.sendChatMessage({
    userId: req.user.id,
    ...req.params,
    ...req.body,
  });

  return res.status(201).json(message);
};

export { getChatMembers, getChatMessages, sendChatMessage };
