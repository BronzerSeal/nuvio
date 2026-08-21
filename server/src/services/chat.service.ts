import { NotFoundError } from "../errors/NotFoundError.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";

type getChatMembersParams = {
  userId: string;
  companyId: string;
  limit: number;
  cursorId?: string;
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

type getChatMessagesParams = {
  userId: string;
  companyId: string;
  senderId: string;
  limit: number;
  cursorId?: string;
};

type sendChatMessageParams = {
  userId: string;
  companyId: string;
  senderId: string;
  message: string;
};

export const getChatMessages = async ({
  userId,
  companyId,
  senderId,
  limit,
  cursorId,
}: getChatMessagesParams) => {
  await requireCompanyRole(userId, companyId, ["member", "admin", "owner"]);

  const take = Number(limit);
  const messages = await prisma.chatMessage.findMany({
    where: {
      chat: { companyId },
      OR: [
        { senderId: userId, receiverId: senderId },
        { senderId, receiverId: userId },
      ],
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
  senderId,
  message,
}: sendChatMessageParams) => {
  await requireCompanyRole(userId, companyId, ["member", "admin", "owner"]);

  const recipient = await prisma.companyMember.findUnique({
    where: {
      userId_companyId: {
        userId: senderId,
        companyId,
      },
    },
    select: { userId: true },
  });

  if (!recipient) {
    throw new NotFoundError({ message: "Message recipient not found" });
  }

  const chat = await prisma.chat.findUnique({
    where: { companyId },
    select: { id: true },
  });

  if (!chat) {
    throw new NotFoundError({ message: "Chat not found for this company" });
  }

  return prisma.chatMessage.create({
    data: {
      chatId: chat.id,
      senderId: userId,
      receiverId: senderId,
      message,
    },
  });
};
