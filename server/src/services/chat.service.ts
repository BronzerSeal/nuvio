import { NotFoundError } from "../errors/NotFoundError.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";

type getChatMembersParams = {
  userId: string;
  companyId: string;
  limit: number;
  cursorId?: string;
};

type getChatMessagesParams = {
  userId: string;
  companyId: string;
  conversationId: string;
  limit: number;
  cursorId?: string;
};

type sendChatMessageParams = {
  userId: string;
  companyId: string;
  conversationId: string;
  message: string;
};

type getConversationParams = {
  userId: string;
  companyId: string;
  targetUserId: string;
};

const requireConversationAccess = async ({
  userId,
  companyId,
  conversationId,
}: getChatMessagesParams) => {
  await requireCompanyRole(userId, companyId, ["member", "admin", "owner"]);

  const conversation = await prisma.chatConversation.findFirst({
    where: {
      id: conversationId,
      chat: { companyId },
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    select: { id: true },
  });

  if (!conversation) {
    throw new NotFoundError({ message: "Conversation not found" });
  }

  return conversation;
};

export const getChatMembers = async ({
  userId,
  companyId,
  limit,
  cursorId,
}: getChatMembersParams) => {
  // 1. есть ли доступ
  await requireCompanyRole(userId, companyId, ["member", "admin", "owner"]);

  const take = Number(limit);

  const memberships = await prisma.companyMember.findMany({
    where: {
      companyId,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
    },
    take: take + 1,

    cursor: cursorId ? { id: cursorId } : undefined,
    skip: cursorId ? 1 : undefined,

    orderBy: {
      id: "desc",
    },
  });

  const hasNextPage = memberships.length > take;

  const data = hasNextPage ? memberships.slice(0, -1) : memberships;

  const lastItem = data[data.length - 1];

  return {
    data,
    nextCursor: lastItem ? lastItem.id : null,
    hasNextPage,
  };
};

export const getConversation = async ({
  userId,
  companyId,
  targetUserId,
}: getConversationParams) => {
  await requireCompanyRole(userId, companyId, ["member", "admin", "owner"]);

  const recipient = await prisma.companyMember.findUnique({
    where: {
      userId_companyId: {
        userId: targetUserId,
        companyId,
      },
    },
    select: { userId: true },
  });

  if (!recipient) {
    throw new NotFoundError({ message: "Conversation participant not found" });
  }

  const [user1Id, user2Id] = [userId, targetUserId].sort();
  const chat = await prisma.chat.upsert({
    where: { companyId },
    update: {},
    create: { companyId },
    select: { id: true },
  });

  const conversation = await prisma.chatConversation.upsert({
    where: {
      chatId_user1Id_user2Id: {
        chatId: chat.id,
        user1Id,
        user2Id,
      },
    },
    update: {},
    create: {
      chatId: chat.id,
      user1Id,
      user2Id,
    },
    select: { id: true },
  });

  return { conversationId: conversation.id };
};

export const getChatMessages = async ({
  userId,
  companyId,
  conversationId,
  limit,
  cursorId,
}: getChatMessagesParams) => {
  const conversation = await requireConversationAccess({
    userId,
    companyId,
    conversationId,
    limit,
    cursorId,
  });

  const take = Number(limit);
  const messages = await prisma.chatMessage.findMany({
    where: {
      conversationId: conversation.id,
    },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
  });

  const hasNextPage = messages.length > take;
  const data = hasNextPage ? messages.slice(0, -1) : messages;
  const lastItem = data[data.length - 1];

  return {
    data,
    nextCursor: lastItem ? lastItem.id : null,
    hasNextPage,
  };
};

export const sendChatMessage = async ({
  userId,
  companyId,
  conversationId,
  message,
}: sendChatMessageParams) => {
  const conversation = await requireConversationAccess({
    userId,
    companyId,
    conversationId,
    limit: 1,
  });

  return prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      senderId: userId,
      message,
    },
  });
};
