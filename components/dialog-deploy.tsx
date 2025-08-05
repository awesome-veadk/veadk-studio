"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ky from "ky";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";

export default function DialogDeploy() {
  const form = useForm({
    defaultValues: {
      ak: "",
      sk: "",
      name: "",
      gw_name: "",
      gw_svr_name: "",
      gw_upstream_name: "",
    },
  });

  async function handleDeploy(data: any) {
    const res = await ky
      .get("http://127.0.0.1:8000/deploy?", {
        searchParams: data,
      })
      .json<any>();

    console.log(res.url);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="text-sm cursor-pointer">
          <span className="flex items-baseline gap-2">Deploy to VeFaaS</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl max-w-3xl">
        <DialogHeader>
          <DialogTitle>Deploy to VeFaaS</DialogTitle>
          <DialogDescription>
            Volcengine VeFaaS platform facilates the deployment of your agent!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(handleDeploy)}
          >
            <FormField
              control={form.control}
              name="ak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volcengine Access Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volcengine Secret Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gw_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway (VeAPIG) instance name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="not required" />
                  </FormControl>
                  <FormDescription />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gw_svr_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway (VeAPIG) service name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="not required" />
                  </FormControl>
                  <FormDescription />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gw_upstream_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway (VeAPIG) upstream name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="not required" />
                  </FormControl>
                  <FormDescription />
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer">
              Deploy
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
