"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCategorySheet from "@/hooks/dashboard/use-category-sheet";
import useCategory from "@/query-hooks/categories/use-category";

const FormSchema = z.object({
  name: z.string().min(2).max(255),
});

type props = {
  name: string;
  id?: string;
};

export default function CategoryForm({ name, id }: props) {
  const categoryMutation = useCategory();
  const categorySheet = useCategorySheet();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name },
    disabled: categoryMutation.isPending,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    categoryMutation.mutate(
      { ...data, id },
      {
        onSuccess: () => {
          form.reset();
          categorySheet.onClose();
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
        <Button state={categoryMutation.isPending ? "loading" : "default"} disabled={!form.formState.isDirty} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
