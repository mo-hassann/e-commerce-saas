"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserSheet from "@/hooks/dashboard/use-user-sheet";
import { editUserFormSchema as FormSchema } from "@/validators/forms";
import useEditUser from "@/query-hooks/dashboard/use-edit-user";

type props = {
  user: z.infer<typeof FormSchema>;
  userId: string;
};

export default function EditUserForm({ user, userId }: props) {
  const editUserMutation = useEditUser();
  const userSheet = useUserSheet();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: user,
    disabled: editUserMutation.isPending,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    editUserMutation.mutate(
      { ...data, id: userId },
      {
        onSuccess: () => {
          form.reset();
          userSheet.onClose();
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
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>The Username must be unique.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button state={editUserMutation.isPending ? "loading" : "default"} disabled={!form.formState.isDirty} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
