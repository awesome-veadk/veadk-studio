import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SettingsGearIcon } from "@/components/ui/settings-gear";
import { useAgentStore } from "@/stores/agent-store";
import {
  RunnerConfig,
  useRunnerConfigStore,
} from "@/stores/runner-config-store";
import ky from "ky";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RiRobot2Line } from "react-icons/ri";
import { toast } from "sonner";
import DialogEvaluation from "./dialog-evaluation";
import DialogRefinePrompt from "./dialog-refine-prompt";
import DialogSaveSession from "./dialog-save-session";
import DialogTracing from "./dialog-tracing";

export default function ChatStatusBar() {
  const { agent, setAgent } = useAgentStore();
  const { runnerConfig, setRunnerConfig } = useRunnerConfigStore();

  const form = useForm({
    defaultValues: {
      app_name: runnerConfig.app_name,
      user_id: runnerConfig.user_id,
      session_id: runnerConfig.session_id,
    },
  });

  useEffect(() => {
    form.reset({
      app_name: runnerConfig.app_name,
      user_id: runnerConfig.user_id,
      session_id: runnerConfig.session_id,
    });
  }, [runnerConfig, form]); // when runnerConfig changes, reset the form values

  async function handleUpdateRunnerConfig(runnerConfig: RunnerConfig) {
    const data = await ky
      .get(
        `http://127.0.0.1:8000/set_runner_config?app_name=${runnerConfig.app_name}&user_id=${runnerConfig.user_id}&session_id=${runnerConfig.session_id}`
      )
      .json<RunnerConfig>();

    setRunnerConfig(data);

    toast("Runner config has been updated", {
      action: {
        label: "Got it",
        onClick: () => console.log("Undo"),
      },
    });
  }

  return (
    <div className="flex flex-row gap-3 items-center">
      <div className="flex flex-1 mr-auto gap-3 border-r border-r-border items-center">
        <img
          src={`https://avatar.iran.liara.run/username?username=${agent.name}`}
          className="size-10 rounded-full shadow-md"
        />
        <div className="font-bold">{agent.name}</div>
      </div>
      <div className="flex ml-auto gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="secondary" className="cursor-pointer">
              <SettingsGearIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateRunnerConfig)}
                className="flex flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="app_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>APP name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="session_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="ml-auto">
                  <Button type="submit" className="cursor-pointer">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="secondary" className="cursor-pointer">
              <RiRobot2Line />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-3 w-256">
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <span className="text-sm text-text-2">{agent.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Description</Label>
              <span className="text-sm text-text-2">{agent.description}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Instruction</Label>
              <span className="text-sm text-text-2">{agent.instruction}</span>
            </div>
          </PopoverContent>
        </Popover>
        <DialogRefinePrompt />
        <DialogTracing />
        <DialogEvaluation />
        <DialogSaveSession />
      </div>
    </div>
  );
}
