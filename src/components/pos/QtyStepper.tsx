"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QtyStepperProps {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

export function QtyStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  size = "sm",
}: QtyStepperProps) {
  const btnClass =
    size === "sm"
      ? "h-7 w-7 rounded-md"
      : "h-10 w-10 rounded-lg";
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textClass = size === "sm" ? "text-sm w-6" : "text-base w-8";

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          btnClass,
          "flex items-center justify-center border bg-background transition-all active:scale-95",
          "min-h-[32px] min-w-[32px]",
          value <= min
            ? "text-muted-foreground/40 cursor-not-allowed"
            : "hover:bg-accent hover:text-foreground"
        )}
      >
        <Minus className={iconClass} />
      </button>
      <span
        className={cn(
          textClass,
          "text-center font-semibold tabular-nums select-none"
        )}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          btnClass,
          "flex items-center justify-center border bg-background transition-all active:scale-95",
          "min-h-[32px] min-w-[32px]",
          value >= max
            ? "text-muted-foreground/40 cursor-not-allowed"
            : "hover:bg-accent hover:text-foreground"
        )}
      >
        <Plus className={iconClass} />
      </button>
    </div>
  );
}
