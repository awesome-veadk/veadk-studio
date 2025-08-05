"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAgentStore } from "@/stores/agent-store";
import ky from "ky";
import { Save } from "lucide-react";

export default function DialogSaveSession() {
  const { agent } = useAgentStore();

  async function handleSaveSession() {
    const res = await ky.get("http://127.0.0.1:8000/save_session").json<any>();
    console.log(res);
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
              disabled={!agent.long_term_memory_backend}
            >
              <Save className="size-5 text-blue-500" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Save session</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="min-w-3xl max-w-3xl">
        <DialogHeader>
          <DialogTitle>Save session</DialogTitle>
          <DialogDescription>
            Are you sure saving session to your long-term memory?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row w-full gap-4 justify-end">
          <DialogClose asChild>
            <Button className="flex w-1/5 cursor-pointer" variant="outline">
              No
            </Button>
          </DialogClose>

          <Button
            className="flex w-1/5 cursor-pointer"
            onClick={handleSaveSession}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
