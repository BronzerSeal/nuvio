import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import getChatMembers from "../model/get-chat-members";
import getChatMessages from "../model/get-chat-messages";
import getConversation from "../model/get-conversation";
import sendChatMessage from "../model/send-chat-message";

export const useConversation = (
  companyId: string,
  userId: string,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["chat-conversation", companyId, userId],
    queryFn: () => getConversation(companyId, userId),
    enabled,
  });
};

export const useChatMembers = (companyId: string, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: ["chat-members", companyId],

    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getChatMembers(companyId, pageParam),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
    },
    select: (result) => result.pages.flatMap((p) => p.data),

    enabled,
  });
};

export const useChatMessages = (
  companyId: string,
  conversationId: string,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: ["chat-messages", companyId, conversationId],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getChatMessages(companyId, conversationId, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    select: (result) => result.pages.flatMap((page) => page.data),
    enabled,
  });
};

export const useSendChatMessage = () => {
  return useMutation({
    mutationKey: ["send-chat-message"],
    mutationFn: ({
      message,
      companyId,
      conversationId,
    }: {
      message: string;
      companyId: string;
      conversationId: string;
    }) => sendChatMessage({ companyId, conversationId, message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "chat-messages",
          variables.companyId,
          variables.conversationId,
        ],
      });
    },
  });
};
