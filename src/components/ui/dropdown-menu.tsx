import * as React from "react";

import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(
  null
);

/**
 * 下拉菜单容器组件，提供打开/关闭状态的上下文。
 */
export function DropdownMenu({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

/**
 * 下拉菜单触发器，通常包裹一个按钮。
 */
export function DropdownMenuTrigger({
  children,
  "aria-label": ariaLabel,
}: {
  children: React.ReactElement;
  "aria-label"?: string;
}): JSX.Element {
  const ctx = React.useContext(DropdownMenuContext);

  if (!ctx) {
    throw new Error("DropdownMenuTrigger 只能在 DropdownMenu 内部使用");
  }

  const { open, setOpen } = ctx;

  return React.cloneElement(children, {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-label": ariaLabel,
    onClick: (event: React.MouseEvent) => {
      children.props.onClick?.(event);
      setOpen(!open);
    },
  });
}

/**
 * 下拉菜单内容区域，内部可放置菜单项。
 */
export function DropdownMenuContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}): JSX.Element | null {
  const ctx = React.useContext(DropdownMenuContext);

  if (!ctx || !ctx.open) return null;

  return (
    <div
      role="menu"
      className={cn(
        "absolute right-0 z-40 mt-2 min-w-[10rem] rounded-xl border border-slate-700/60 bg-slate-900/95 p-1.5 text-sm text-slate-100 shadow-lg shadow-slate-950/40 backdrop-blur-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 下拉菜单项，支持键盘和鼠标交互。
 */
export function DropdownMenuItem({
  className,
  children,
  onSelect,
}: {
  className?: string;
  children: React.ReactNode;
  onSelect?: () => void;
}): JSX.Element {
  const ctx = React.useContext(DropdownMenuContext);

  const handleSelect = (): void => {
    onSelect?.();
    ctx?.setOpen(false);
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleSelect}
      className={cn(
        "flex w-full cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-200 outline-none hover:bg-slate-800/90 focus-visible:bg-slate-800/90 focus-visible:ring-2 focus-visible:ring-sky-500/60",
        "interactive-soft",
        className
      )}
    >
      {children}
    </button>
  );
}

