"use client";

import { Button } from "@/components/ui/button";
import { ChartSplineIcon } from "@/components/ui/chart-spline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRefinePromptStore } from "@/stores/refine-prompt-store";
import ky from "ky";
import { useState } from "react";

function RenderTable({ testCases }: { testCases: any }) {
  const { setFeedback, refineButtonRef } = useRefinePromptStore();

  async function handleRefinePrompt(reason: string) {
    setFeedback(reason);

    refineButtonRef?.current.click();
  }

  return (
    <div className="flex w-full">
      <Table className="table-fixed">
        <TableCaption>A list of available test cases.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12 text-ellipsis">Input</TableHead>
            <TableHead className="w-2/12 text-ellipsis">
              Expected output
            </TableHead>
            <TableHead className="w-3/12 text-ellipsis">
              Actual output
            </TableHead>
            <TableHead className="w-3/12 text-ellipsis">Reason</TableHead>
            <TableHead className="w-1/12 text-ellipsis">Score</TableHead>
            <TableHead className="w-2/12 text-ellipsis"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testCases &&
            testCases.map((testCase: any, indexTestcase: number) =>
              testCase.map((invocation: any, indexInvocation: number) => (
                <TableRow key={(indexTestcase + 1) * (indexInvocation + 1)}>
                  <TableCell className="w-1/12 truncate">
                    {invocation.input}
                  </TableCell>
                  <TableCell className="w-2/12 truncate">
                    {invocation.expected_output}
                  </TableCell>
                  <TableCell
                    className="w-3/12 truncate"
                    title={invocation.actual_output}
                  >
                    {invocation.actual_output}
                  </TableCell>
                  <TableCell
                    className="w-3/12 truncate"
                    title={invocation.reason}
                  >
                    {invocation.reason}
                  </TableCell>
                  <TableCell className="w-1/12">{invocation.score}</TableCell>

                  <TableCell className="w-2/12">
                    <Button
                      variant="secondary"
                      className="cursor-pointer"
                      disabled={invocation.reason === ""}
                      onClick={() => handleRefinePrompt(invocation.reason)}
                    >
                      Refine prompt
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function DialogEvaluation() {
  const [testcases, setTestcases] = useState<any>(null);

  async function handleFetchEvalData() {
    const data = await ky
      .get("http://127.0.0.1:8000/get_testcases")
      .json<any>();

    setTestcases(data.test_cases);
  }

  async function handleEvaluation() {
    const data = await ky
      .get("http://127.0.0.1:8000/evaluate", { timeout: 600000 })
      .json<any>();

    setTestcases(data.test_cases);
  }

  return (
    <Dialog onOpenChange={handleFetchEvalData}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="cursor-pointer"
              onClick={() => {}}
            >
              <ChartSplineIcon className="text-blue-500" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Evaluate</TooltipContent>
      </Tooltip>
      <DialogContent className="flex flex-col min-w-4/5 max-w-4/5 max-h-3/4">
        <DialogHeader className="flex">
          <DialogTitle>Evaluation invocations</DialogTitle>
          <DialogDescription>with DeepEval</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          <div className="flex-1 min-h-0 overflow-y-scroll">
            <RenderTable testCases={testcases} />
          </div>
          <div className="flex justify-end">
            <Button className="cursor-pointer" onClick={handleEvaluation}>
              Evaluate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
