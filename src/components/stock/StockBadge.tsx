"use client";

import { Badge } from "@/components/ui/badge";
import { getStockStatus, getStockStatusColor } from "@/lib/utils";

interface StockBadgeProps {
  current: number;
  min: number;
}

export function StockBadge({ current, min }: StockBadgeProps) {
  const status = getStockStatus(current, min);
  const color = getStockStatusColor(current, min);

  const label =
    status === "habis"
      ? "Habis"
      : status === "menipis"
        ? `Menipis (${current})`
        : current.toString();

  return (
    <Badge variant="secondary" className={`text-xs font-bold ${color}`}>
      {label}
    </Badge>
  );
}
