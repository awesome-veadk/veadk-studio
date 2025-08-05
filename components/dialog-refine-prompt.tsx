import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAgentStore } from "@/stores/agent-store";
import { useRefinePromptStore } from "@/stores/refine-prompt-store";
import ky from "ky";
import { CornerDownRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GiFairyWand } from "react-icons/gi";
import { toast } from "sonner";

export default function DialogRefinePrompt() {
  const { agent, setAgent } = useAgentStore();

  const currentPromptTextareaRef = useRef(null);
  const feedbackTextareaRef = useRef(null);
  const optimizedPromptTextareaRef = useRef(null);

  const refineButtonRef = useRef<HTMLButtonElement>(null);
  const { feedback, setFeedback, setRefineButtonRef } = useRefinePromptStore();

  const [currentPrompt, setCurrentPrompt] = useState(agent.instruction); // not best-practice
  const [optimizedPrompt, setOptimizedPrompt] = useState("");

  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    setCurrentPrompt(agent.instruction);
  }, [agent.instruction]);

  useEffect(() => {
    setRefineButtonRef(refineButtonRef as React.RefObject<HTMLButtonElement>);
  }, []);

  async function onUpdate() {
    await ky.get("http://127.0.0.1:8000/set_prompt?prompt=" + currentPrompt);

    setAgent({
      ...agent,
      instruction: currentPrompt,
    });

    toast("Agent instruction has been updated", {
      action: {
        label: "Got it",
        onClick: () => console.log("Undo"),
      },
    });
  }

  async function onOptimize() {
    setIsOptimizing(true);

    const data = await ky
      .get("http://127.0.0.1:8000/refine_prompt?feedback=" + feedback, {
        timeout: 600000,
      })
      .json<any>();

    setOptimizedPrompt(data.prompt);

    setIsOptimizing(true);
  }

  async function onReplace() {
    await ky.get("http://127.0.0.1:8000/set_prompt?prompt=" + optimizedPrompt, {
      timeout: 60000, // 1 minute
    });

    setCurrentPrompt(optimizedPrompt);
    setFeedback("");
    setOptimizedPrompt("");

    setAgent({
      ...agent,
      instruction: optimizedPrompt,
    });

    toast("Agent instruction has been updated", {
      action: {
        label: "Got it",
        onClick: () => console.log("Undo"),
      },
    });
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="cursor-pointer"
              // onClick={() => {}}
              ref={refineButtonRef}
            >
              {/* <BsActivity className="size-5 text-yellow-500" /> */}
              <GiFairyWand className="text-blue-500" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Refine prompt</TooltipContent>
      </Tooltip>
      <DialogContent
        className="flex flex-col min-w-4/5 max-w-4/5 min-h-1/2 max-h-full gap-1"
        style={{ zIndex: 9999 }}
      >
        <DialogHeader className="flex">
          <DialogTitle>Refine instruction</DialogTitle>
          <DialogDescription>
            make your agent system prompt powerful with Volcengine AgentPilot
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-row gap-5 min-h-0">
          {/* current prompt */}
          <div className="flex flex-1 flex-col min-h-0 mt-3 w-full gap-3">
            <span className="flex text-sm font-medium">Current prompt</span>
            <Textarea
              ref={currentPromptTextareaRef}
              className="flex-1 w-full resize-none min-h-0"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
            />

            <Button
              type="button"
              className="w-1/3 ml-auto cursor-pointer"
              onClick={onUpdate}
            >
              Update
            </Button>
          </div>
          {/* optimizer prompt */}
          <div className="flex flex-1 flex-col min-h-0 mt-3 w-full gap-3 min-h-0">
            <span className="flex text-sm font-medium">Optimizer prompt</span>
            <Textarea
              ref={feedbackTextareaRef}
              className="w-full flex-1 min-h-0 resize-none"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Make my prompt more clearer ..."
              rows={5}
            />

            <Button
              type="button"
              className="w-1/3 ml-auto cursor-pointer"
              onClick={onOptimize}
              disabled={isOptimizing}
            >
              Optimize
            </Button>
          </div>
          {/* optimized prompt */}
          <div className="flex flex-1 flex-col min-h-0 mt-3 w-full gap-3">
            <span className="text-sm font-medium">Optimized prompt</span>
            <Textarea
              ref={optimizedPromptTextareaRef}
              className="w-full flex-1 min-h-0 resize-none"
              value={optimizedPrompt}
              onChange={(e) => setOptimizedPrompt(e.target.value)}
              rows={5}
              placeholder="Optimized prompt will be rendered here."
            />

            <Button
              type="button"
              className="w-1/3 ml-auto cursor-pointer"
              onClick={onReplace}
            >
              <CornerDownRight /> Use this
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
