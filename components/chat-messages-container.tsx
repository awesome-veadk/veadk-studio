"use client";

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import { Loader } from "@/components/ui/loader";
import { Markdown } from "@/components/ui/markdown";
import {
  Message,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Tool } from "@/components/ui/tool";

export default function ChatMessagesContainer({ messages }: { messages: any }) {
  return (
    <div className="flex flex-1 h-full w-full flex-col overflow-hidden relative">
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 py-4 px-2">
          {console.log(messages)}
          {messages.map((message: any) => {
            const isAssistant = message.role === "assistant";

            return (
              <Message
                key={message.id}
                className={
                  message.role === "user" ? "justify-end" : "justify-start"
                }
              >
                {/* {isAssistant && (
                  <MessageAvatar
                    src="/avatars/ai.png"
                    alt="AI Assistant"
                    fallback="AI"
                  />
                )} */}
                <div className="min-w-0 max-w-[85%] flex-1 sm:max-w-[75%]">
                  {isAssistant ? (
                    <>
                      {message.parts &&
                      message.parts.length > 0 &&
                      message.parts[0]?.text !== undefined &&
                      message.parts[0]?.text !== "" ? (
                        message.parts.map((part: any) => {
                          if (part.type === "text") {
                            return (
                              <div
                                key={part.id || `${message.id}-text`}
                                className="mr-auto max-w-fit min-w-0 text-foreground bg-muted prose rounded-lg px-3 py-2"
                              >
                                <Markdown>{part.text}</Markdown>
                              </div>
                            );
                          } else if (part.type.startsWith("tool-")) {
                            return (
                              <Tool
                                key={
                                  part.id || `${message.id}-tool-${part.type}`
                                }
                                className="w-full max-w-md"
                                toolPart={{
                                  type: part.type.replace("tool-", ""),
                                  state: part.state,
                                  input: part.input,
                                  output: part.output,
                                  errorText: part.errorText,
                                }}
                              />
                            );
                          }
                        })
                      ) : (
                        // <div className="mr-auto max-w-fit min-w-0 text-foreground bg-muted prose rounded-lg px-3 py-2">
                        <Loader variant="pulse-dot" size="md" />
                        // </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col group gap-1">
                      <MessageContent className="ml-auto max-w-fit min-w-0 rounded-lg bg-primary text-primary-foreground px-3 py-2">
                        {message.parts[0].text}
                      </MessageContent>
                      <MessageActions className="justify-end ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <span className="text-sm text-muted-foreground">
                          51 tokens
                        </span>
                      </MessageActions>
                    </div>
                  )}
                </div>
              </Message>
            );
          })}
        </ChatContainerContent>
        <div className="absolute right-7 bottom-4">
          <ScrollButton className="shadow-sm" />
        </div>
      </ChatContainerRoot>
    </div>
  );
}
