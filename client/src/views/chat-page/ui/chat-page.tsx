"use client";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { format } from "date-fns";
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Paperclip,
  Phone,
  ImagePlus,
  Plus,
  Search as SearchIcon,
  Send,
  Video,
  MessagesSquare,
} from "lucide-react";
import { cn } from "@shared/lib/utils";
import { getDisplayNameInitials } from "../model/get-display";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { Button } from "@shared/ui/button";
import { ScrollArea } from "@shared/ui/scroll-area/scroll-area";
import { Separator } from "@shared/ui/separator";
import { Main } from "@shared/ui/main";
import { NewChat } from "./new-chat";
import { useParams } from "next/navigation";
import {
  useChatMembers,
  useChatMessages,
  useConversation,
  useSendChatMessage,
} from "@/entity/chat";
import { ChatMember, ChatMessage } from "@/shared/types/bd-types";
import { useForm } from "react-hook-form";
import { useFindMe } from "@/entity/user";
import { socket } from "@/shared/api/websockets";
import { queryClient } from "@/shared/lib/query-client";
import { useChatMembersHook } from "@/entity/chat/hooks/use-chat-members-hook";

type SendFormValues = {
  message: string;
};

export default function ChatPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatMember | null>(null);
  const [mobileSelectedUser, setMobileSelectedUser] =
    useState<ChatMember | null>(null);
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false);

  //---------------------------------------
  // BD
  const { companyId } = useParams() as { companyId?: string };
  const { data: session } = useFindMe();
  // const { data: users } = useChatMembers(companyId!, !!companyId);
  const { members, cursor } = useChatMembersHook(companyId!, !!companyId);
  const { data: conversation } = useConversation(
    companyId!,
    selectedUser?.user.id!,
    !!companyId && !!selectedUser?.user.id,
  );

  const { data: messages } = useChatMessages(
    companyId!,
    conversation?.conversationId!,
    !!conversation?.conversationId,
  );

  const { handleSubmit, reset, register } = useForm<SendFormValues>({
    defaultValues: {
      message: "",
    },
    mode: "onChange",
  });

  const { mutate: sendChatMessage } = useSendChatMessage();

  const handleSubmitMessage = async (data: SendFormValues) => {
    if (
      !companyId ||
      !conversation?.conversationId ||
      !data.message.trim().length
    ) {
      console.log("Missing data for sending message", data);
      return;
    }

    sendChatMessage({
      companyId,
      conversationId: conversation.conversationId,
      message: data.message,
    });

    reset();
  };

  //WEBSOCKETS
  useEffect(() => {
    const conversationId = conversation?.conversationId;

    if (!conversationId) return;

    queryClient.invalidateQueries({
      queryKey: ["chat-messages", companyId, conversationId],
    });

    socket.emit("join-conversation", conversationId);

    const handleConversationUpdated = () => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", companyId, conversationId],
      });
    };

    socket.on("conversation-updated", handleConversationUpdated);

    return () => {
      socket.off("conversation-updated", handleConversationUpdated);
    };
  }, [conversation?.conversationId, companyId, queryClient]);

  //---------------------------------------

  const currentMessage = messages?.reduce(
    (acc: Record<string, ChatMessage[]>, obj) => {
      const key = format(obj.createdAt, "d MMM, yyyy");

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = [];
      }

      // Push the current object to the array
      acc[key].push(obj);

      return acc;
    },
    {},
  );

  return (
    <>
      <Main fixed>
        <section className="flex h-full min-h-0 gap-6">
          {/* Left Side */}
          <div className="flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80 ">
            <div className="sticky top-0 z-10 -mx-4  px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none">
              <div className="flex items-center justify-between py-2">
                <div className="flex gap-2 ">
                  <h1 className="text-2xl font-bold">Inbox</h1>
                  <MessagesSquare size={20} />
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setCreateConversationDialog(true)}
                  className="rounded-lg bg-background"
                >
                  <Edit size={24} className="stroke-muted-foreground" />
                </Button>
              </div>

              <label
                className={cn(
                  "focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden",
                  "bg-background flex h-10 w-full items-center space-x-0 rounded-md border border-border ps-2",
                )}
              >
                <SearchIcon size={15} className="me-2 stroke-slate-500" />
                <span className="sr-only">Search</span>
                <input
                  type="text"
                  className="w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden"
                  placeholder="Search chat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className="-mx-3 h-full overflow-scroll p-3">
              {members?.map((chatUsr) => {
                const { id, image, email, name } = chatUsr.user;
                // const lastConvo = messages[0];
                // const lastMsg =
                //   lastConvo.sender === "You"
                //     ? `You: ${lastConvo.message}`
                //     : lastConvo.message;
                return (
                  <Fragment key={id}>
                    <button
                      type="button"
                      className={cn(
                        "group hover:bg-accent hover:text-accent-foreground",
                        `flex w-full rounded-md px-2 py-2 text-start text-sm`,
                        selectedUser?.id === id && "sm:bg-muted",
                      )}
                      onClick={() => {
                        setSelectedUser(chatUsr);
                        setMobileSelectedUser(chatUsr);
                      }}
                    >
                      <div className="flex gap-2">
                        <Avatar>
                          <AvatarImage src={image} alt={email} />
                          <AvatarFallback>
                            {getDisplayNameInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="col-start-2 row-span-2 font-medium">
                            {name}
                          </span>
                          {/* <span className="col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground group-hover:text-accent-foreground/90">
                            {lastMsg}
                          </span> */}
                        </div>
                      </div>
                    </button>
                    <Separator className="my-1" />
                  </Fragment>
                );
              })}
              {cursor}
            </ScrollArea>
          </div>

          {/* Right Side */}
          {selectedUser ? (
            <div
              className={cn(
                "absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col border bg-background shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md",
                mobileSelectedUser && "inset-s-0 flex",
              )}
            >
              {/* Top Part */}
              <div className="mb-1 flex flex-none justify-between bg-card p-4 shadow-lg sm:rounded-t-md">
                {/* Left */}
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="-ms-2 h-full sm:hidden"
                    onClick={() => setMobileSelectedUser(null)}
                  >
                    <ArrowLeft className="rtl:rotate-180" />
                  </Button>
                  <div className="flex items-center gap-2 lg:gap-4">
                    <Avatar className="size-9 lg:size-11">
                      <AvatarImage
                        src={selectedUser.user.image || undefined}
                        alt={selectedUser.user?.name}
                      />
                      <AvatarFallback>
                        {getDisplayNameInitials(selectedUser.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="col-start-2 row-span-2 text-sm font-medium lg:text-base">
                        {selectedUser.user.name}
                      </span>
                      <span className="col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis text-muted-foreground lg:max-w-none lg:text-sm">
                        {selectedUser.user.bio || selectedUser.user.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="-me-1 flex items-center gap-1 lg:gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
                  >
                    <Video size={22} className="stroke-muted-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
                  >
                    <Phone size={22} className="stroke-muted-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6"
                  >
                    <MoreVertical className="stroke-muted-foreground sm:size-5" />
                  </Button>
                </div>
              </div>

              {/* Conversation */}
              <div className="flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4">
                <div className="flex size-full flex-1">
                  <div className="chat-text-container relative -me-4 flex flex-1 flex-col overflow-y-hidden">
                    <div className="chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4">
                      {/* currentMessage */}
                      {currentMessage &&
                        Object.keys(currentMessage).map((key) => (
                          <Fragment key={key}>
                            {currentMessage[key].map((msg, index) => (
                              <div
                                key={`${msg.senderId}-${msg.createdAt}-${index}`}
                                className={cn(
                                  "chat-box max-w-72 px-3 py-2 wrap-break-word shadow-lg",
                                  msg.senderId === session?.id
                                    ? "self-end rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/75"
                                    : "self-start rounded-[16px_16px_16px_0] bg-muted",
                                )}
                              >
                                {msg.message}{" "}
                                <span
                                  className={cn(
                                    "mt-1 block text-xs font-light text-foreground/75 italic",
                                    msg.senderId === session?.id &&
                                      "text-end text-primary-foreground/85",
                                  )}
                                >
                                  {format(msg.createdAt, "h:mm a")}
                                </span>
                              </div>
                            ))}
                            <div className="text-center text-xs">{key}</div>
                          </Fragment>
                        ))}
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(handleSubmitMessage)}
                  className="flex w-full flex-none gap-2 "
                >
                  <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-2 py-1 focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden lg:gap-4">
                    <div className="space-x-1">
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="h-8 rounded-md"
                      >
                        <Plus size={20} className="stroke-muted-foreground" />
                      </Button>
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="hidden h-8 rounded-md lg:inline-flex"
                      >
                        <ImagePlus
                          size={20}
                          className="stroke-muted-foreground"
                        />
                      </Button>
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="hidden h-8 rounded-md lg:inline-flex"
                      >
                        <Paperclip
                          size={20}
                          className="stroke-muted-foreground"
                        />
                      </Button>
                    </div>
                    <label className="flex-1">
                      <span className="sr-only">Chat Text Box</span>
                      <input
                        type="text"
                        placeholder="Type your messages..."
                        className="h-8 w-full bg-inherit focus-visible:outline-hidden"
                        {...register("message", {
                          required: "Message is required",
                        })}
                      />
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden sm:inline-flex"
                      type="submit"
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                  <Button className="h-full sm:hidden" type="submit">
                    <Send size={18} /> Send
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "absolute inset-0 start-full  z-50 hidden w-full flex-1 flex-col justify-center rounded-md border bg-background shadow-xs sm:static sm:z-auto sm:flex",
              )}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-border">
                  <MessagesSquare className="size-8" />
                </div>
                <div className="space-y-2 text-center">
                  <h1 className="text-xl font-semibold">Your messages</h1>
                  <p className="text-sm text-muted-foreground">
                    Send a message to start a chat.
                  </p>
                </div>
                <Button onClick={() => setCreateConversationDialog(true)}>
                  Send message
                </Button>
              </div>
            </div>
          )}
        </section>
        <NewChat
          users={members}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened}
        />
      </Main>
    </>
  );
}
