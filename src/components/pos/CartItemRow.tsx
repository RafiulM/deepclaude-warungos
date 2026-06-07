"use client";

import { CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { QtyStepper } from "./QtyStepper";
import { Trash2 } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({ item, onUpdateQty, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.productName}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {formatCurrency(item.unitPrice)}
        </p>
      </div>
      <QtyStepper
        value={item.quantity}
        onChange={(qty) => onUpdateQty(item.productId, qty)}
        size="sm"
      />
      <span className="w-20 text-right text-sm font-semibold tabular-nums">
        {formatCurrency(item.subtotal)}
      </span>
      <button
        onClick={() => onRemove(item.productId)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors min-h-[32px] min-w-[32px]"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
