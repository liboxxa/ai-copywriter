import * as React from "react";

import { cn } from "@/lib/utils";

export type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
} & Omit<React.ComponentProps<"button">, "onChange">;

/**
 * 开关组件，支持键盘和鼠标操作。
 */
export function Switch({
  checked,
  onCheckedChange,
  className,
  ...props
}: SwitchProps): JSX.Element {
  const handleToggle = (): void => {
    onCheckedChange(!checked);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full border border-slate-600 bg-slate-800 px-0.5 text-xs outline-none transition-colors",
        checked && "border-emerald-400 bg-emerald-500/30",
        "focus-visible:ring-2 focus-visible:ring-sky-500/60",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-slate-300 shadow-[0_2px_6px_rgba(15,23,42,0.6)] transition-transform",
          checked && "translate-x-4 bg-emerald-300"
        )}
      />
    </button>
  );
}

