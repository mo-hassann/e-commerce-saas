"use client";

import { Button } from "@/components/ui/button";
import useSignOut from "../../query-hooks/auth/use-sign-out";
import React, { ComponentProps } from "react";

interface props extends React.InputHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export default function SignOutBtn({ children, asChild = false, type, size, ...props }: props) {
  const signOutMutation = useSignOut();
  const { isPending, isSuccess } = signOutMutation;
  return (
    <Button asChild={asChild} state={isPending || isSuccess ? "loading" : "default"} variant="ghost" onClick={() => signOutMutation.mutate({})} {...props}>
      {children}
    </Button>
  );
}
