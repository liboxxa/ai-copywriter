import * as React from "react";

import { cn } from "@/lib/utils";

export type SliderProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
} & Omit<React.ComponentProps<"input">, "type" | "onChange" | "value">;

/**
 * 简单的范围滑块组件，封装 input[type=range] 样式。
 */
export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  className,
  onChange,
  ...props
}: SliderProps): React.JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextValue = Number(event.target.value);
    onChange(nextValue);
  };

  return (
    <input
      type="range"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={handleChange}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary/70 border border-border outline-none",
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30",
        "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-primary/30",
        className
      )}
      {...props}
    />
  );
}

