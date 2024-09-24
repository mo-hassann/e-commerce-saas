"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useTagSheet from "@/hooks/dashboard/use-tag-sheet";
import useTag from "@/query-hooks/tags/use-tag";

const FormSchema = z.object({
  name: z.string().min(2).max(255),
});

type props = {
  name: string;
  id?: string;
};

export default function TagForm({ name, id }: props) {
  const tagMutation = useTag();
  const tagSheet = useTagSheet();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name },
    disabled: tagMutation.isPending,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    tagMutation.mutate(
      { ...data, id },
      {
        onSuccess: () => {
          form.reset();
          tagSheet.onClose();
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button state={tagMutation.isPending ? "loading" : "default"} disabled={!form.formState.isDirty} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
