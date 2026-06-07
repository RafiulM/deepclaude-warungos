"use client";

import { Product, ExpenseFormItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RestockItemEntryProps {
  item: ExpenseFormItem;
  index: number;
  products: Product[];
  onChange: (index: number, field: keyof ExpenseFormItem, value: string | number) => void;
  onRemove: (index: number) => void;
}

export function RestockItemEntry({
  item,
  index,
  products,
  onChange,
  onRemove,
}: RestockItemEntryProps) {
  const selectedProduct = products.find((p) => p.id === item.productId);

  return (
    <div className="flex flex-col sm:flex-row gap-2 rounded-lg border bg-card p-3">
      <Select
        value={item.productId}
        onValueChange={(v) => onChange(index, "productId", v ?? "")}
      >
        <SelectTrigger className="sm:flex-1 min-h-[44px]">
          <SelectValue placeholder="Pilih barang" />
        </SelectTrigger>
        <SelectContent>
          {products.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name} ({formatCurrency(p.purchasePrice)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <div className="w-20">
          <Input
            type="number"
            placeholder="Qty"
            value={item.quantityAdded || ""}
            onChange={(e) =>
              onChange(index, "quantityAdded", parseInt(e.target.value) || 0)
            }
            className="h-11 text-center"
            min={1}
            inputMode="numeric"
          />
        </div>
        <div className="relative flex-1 sm:w-36">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            Rp
          </span>
          <Input
            type="number"
            placeholder="Total"
            value={item.totalCost || ""}
            onChange={(e) =>
              onChange(index, "totalCost", parseInt(e.target.value) || 0)
            }
            className="h-11 pl-10"
            inputMode="numeric"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-11 w-11 shrink-0 text-muted-foreground hover:text-red-500 min-h-[44px] min-w-[44px]"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
