import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * 轻量级表单容器，主要用于统一样式和布局。
 */
export function Form({
  className,
  ...props
}: React.ComponentProps<"form">): JSX.Element {
  return (
    <form
      className={cn("space-y-4 text-xs text-slate-200", className)}
      {...props}
    />
  );
}

export function FormField({
  className,
  ...props
}: React.ComponentProps<"div">): JSX.Element {
  return (
    <div className={cn("space-y-1.5", className)} {...props} />
  );
}

export function FormLabel({
  className,
  ...props
}: React.ComponentProps<"label">): JSX.Element {
  return (
    <label
      className={cn("block text-[11px] font-medium text-slate-300", className)}
      {...props}
    />
  );
}

export function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">): JSX.Element {
  return (
    <p
      className={cn("text-[11px] text-slate-500", className)}
      {...props}
    />
  );
}

