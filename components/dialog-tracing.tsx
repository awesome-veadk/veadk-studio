import { JsonViewer } from "@/components/json-tree-viewer";
import { ActivityIcon } from "@/components/ui/activity";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ky from "ky";
import { useState } from "react";

type Event = {
  event: string;
};

function SpanItems({
  spans,
  setEventData,
  setAttributes,
}: {
  spans: SpanItem[];
  setEventData: (data: any) => void;
  setAttributes: (data: any) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {spans.map((span, index) => (
        <div id={String(index)} className="pb-2 border-b border-gray-200">
          <SpanItem
            key={span.span_id}
            span={span}
            indent={0}
            setEventData={setEventData}
            setAttributes={setAttributes}
          />
        </div>
      ))}
    </div>
  );
}

function SpanItem({
  span,
  indent,
  setEventData,
  setAttributes,
}: {
  span: SpanItem;
  indent: number;
  setEventData: (data: any) => void;
  setAttributes: (data: any) => void;
}) {
  const paddingLeft = `${indent}rem`;

  async function getEvent(event_id: string) {
    const eventData = await ky
      .get(`http://127.0.0.1:8000/get_event?event_id=${event_id}`)
      .json<Event>();

    setEventData(JSON.parse(eventData.event));
  }

  return (
    <div>
      <div
        className="flex flex-row items-center gap-2 hover:bg-gray-100 hover:rounded-sm px-2 py-1 cursor-pointer"
        onClick={() => getEvent(span.event_id)}
      >
        <div
          className="w-1/2 font-mono text-sm"
          style={{ paddingLeft: paddingLeft }}
        >
          {span.name}
        </div>
        <div className="flex w-1/4 justify-end">
          {/* progress bar*/}
          <div
            className=" bg-blue-500 h-4 rounded"
            style={{ width: `${span.latency_proportion}%` }}
          ></div>
        </div>
        <div className="flex w-1/4 justify-end">
          <span className="text-sm text-muted-foreground">
            {span.latency} ms
          </span>
        </div>
      </div>

      {span.childs && span.childs.length > 0 && (
        <div>
          {span.childs.map((child) => (
            <SpanItem
              key={child.span_id}
              span={child}
              indent={indent + 1}
              setEventData={setEventData}
              setAttributes={setAttributes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type SpanItem = {
  name: string;
  span_id: string;
  trace_id: string;
  event_id: string;
  parent_span_id: string;
  latency: string;
  latency_proportion: string;
  childs: SpanItem[];
};

type RootSpans = {
  root_spans: SpanItem[];
};

export default function DialogTracing() {
  const [spans, setSpans] = useState<SpanItem[]>([]);
  const [spanData, setSpanData] = useState<RootSpans>();

  const [eventData, setEventData] = useState<any>();
  const [attributes, setAttributes] = useState<any>();

  const [open, setOpen] = useState(false);

  async function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      const data = await ky
        .get("http://127.0.0.1:8000/get_tracing")
        .json<RootSpans>();
      console.log(data);
      setSpanData(data);
      setSpans(data.root_spans);
    }
    setOpen(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" variant="secondary" className="cursor-pointer">
              {/* <BsActivity className="size-5 text-yellow-500" /> */}
              <ActivityIcon className="text-blue-500" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Tracing</TooltipContent>
      </Tooltip>
      <DialogContent className="flex flex-col max-w-3/4 min-w-3/4 min-h-[80vh] max-h-[80vh]">
        <DialogHeader className="flex">
          <DialogTitle>Tracing for your agent</DialogTitle>
          <DialogDescription>
            Trace ID: {spanData?.root_spans[0]?.trace_id}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row flex-1 min-h-0">
          {/* tracing graph */}
          <div className="overflow-auto w-1/2 pr-2 border-r border-gray-200">
            <Tabs defaultValue="graph" className="">
              <TabsList>
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
              <TabsContent value="graph">
                {spans && spans.length > 0 ? (
                  <SpanItems
                    spans={spans}
                    setEventData={setEventData}
                    setAttributes={setAttributes}
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No conversation founded.
                  </span>
                )}
              </TabsContent>
              <TabsContent value="text">
                <JsonViewer data={spanData} rootName="" />
              </TabsContent>
            </Tabs>
          </div>
          {/* event information */}
          <div className="overflow-auto w-1/2 pl-2">
            <Tabs defaultValue="event" className="">
              <TabsList>
                <TabsTrigger value="event">Event</TabsTrigger>
                <TabsTrigger value="attr">Attributions</TabsTrigger>
              </TabsList>
              <TabsContent value="event">
                {eventData ? (
                  <JsonViewer data={eventData} rootName="" />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Choose an event from left side
                  </span>
                )}
              </TabsContent>
              <TabsContent value="attr">
                <JsonViewer data={spanData} rootName="" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
