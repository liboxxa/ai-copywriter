import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * 表格容器组件，封装基础样式。
 */
export function Table({
  className,
  ...props
}: React.ComponentProps<"table">): JSX.Element {
  return (
    <div className="relative w-full overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-900/60 p-1.5 shadow-inner shadow-slate-950/60">
      <table
        className={cn(
          "w-full border-collapse text-left text-xs text-slate-200",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">): JSX.Element {
  return (
    <thead
      className={cn("bg-slate-900/80 text-[11px] uppercase tracking-wide", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">): JSX.Element {
  return <tbody className={cn("", className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: React.ComponentProps<"tr">): JSX.Element {
  return (
    <tr
      className={cn(
        "border-b border-slate-800/80 last:border-0 hover:bg-slate-800/60 focus-within:bg-slate-800/60 data-[state=updated]:data-updated",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ComponentProps<"th">): JSX.Element {
  return (
    <th
      className={cn("px-3 py-2 font-medium text-slate-400", className)}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.ComponentProps<"td">): JSX.Element {
  return (
    <td
      className={cn("px-3 py-2 align-middle text-slate-200", className)}
      {...props}
    />
  );
}

