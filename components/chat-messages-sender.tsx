"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { useAgentStore } from "@/stores/agent-store";
import { ArrowUp, Square, Circle } from "lucide-react";
import { useState } from "react";

export default function ChatMessagesSender({
  sendMessage,
}: {
  sendMessage: (message: any) => Promise<void>;
}) {
  const { agent, setAgent } = useAgentStore();

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  return (
    <PromptInput
      value={value}
      onValueChange={handleValueChange}
      isLoading={isLoading}
      onSubmit={() => {
        sendMessage({ text: value });
        setValue("");
      }}
      className="w-full"
    >
      <PromptInputTextarea
        placeholder="Ask me anything..."
        className="min-h-[66px]"
      />
      <PromptInputActions className="flex pt-2 justify-between">
        <div className="flex items-center gap-2">
          <PromptInputAction tooltip="Active agent">
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 text-green-500" fill="currentColor" />
              <Badge variant="secondary" className="text-xs">
                {agent.name}
              </Badge>
            </div>
          </PromptInputAction>
        </div>

        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full ml-auto cursor-pointer"
            onClick={() => {
              sendMessage({ text: value });
              setValue("");
            }}
          >
            {isLoading ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
