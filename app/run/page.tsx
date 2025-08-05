"use client";

import ChatMessagesContainer from "@/components/chat-messages-container";
import ChatMessagesSender from "@/components/chat-messages-sender";
import ChatStatusBar from "@/components/chat-status-bar";
import { Agent, useAgentStore } from "@/stores/agent-store";
import {
  RunnerConfig,
  useRunnerConfigStore,
} from "@/stores/runner-config-store";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ky from "ky";
import { useEffect } from "react";

export default function Chat() {
  const { setAgent } = useAgentStore();
  const { setRunnerConfig } = useRunnerConfigStore();

  const { messages, setMessages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "http://127.0.0.1:8000/run_sse",
    }),
  });

  useEffect(() => {
    const loadAgent = async () => {
      const data = await ky
        .get("http://127.0.0.1:8000/get_agent")
        .json<Agent>();
      console.log(data);
      setAgent(data);
    };

    const loadRunnerConfig = async () => {
      const data = await ky
        .get("http://127.0.0.1:8000/get_runner_config")
        .json<RunnerConfig>();
      setRunnerConfig(data);
    };

    const loadHistoryMessages = async () => {
      const data = await ky
        .get("http://127.0.0.1:8000/get_history_messages")
        .json<any>();

      setMessages(data.messages);
    };

    loadHistoryMessages();
    loadAgent();
    loadRunnerConfig();
  }, []);

  return (
    <div className="flex flex-col min-w-3xl max-w-3xl mx-auto min-h-0 w-full px-4 md:px-6 pb-3 gap-3">
      <ChatStatusBar />
      <ChatMessagesContainer messages={messages} />
      <ChatMessagesSender sendMessage={sendMessage} />
    </div>
  );
}
