import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import getChatMembers from "../model/get-chat-members";
import getChatMessages from "../model/get-chat-messages";
import sendChatMessage from "../model/send-chat-message";

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
  senderId: string,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: ["chat-messages", companyId, senderId],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getChatMessages(companyId, senderId, pageParam),
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
      senderId,
    }: {
      message: string;
      companyId: string;
      senderId: string;
    }) => sendChatMessage({ companyId, senderId, message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", variables.companyId, variables.senderId],
      });
    },
  });
};
