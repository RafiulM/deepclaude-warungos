"use client";

import { Product } from "@/lib/types";
import { formatCurrency, getStockStatus, getStockStatusColor } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const status = getStockStatus(product.currentStock, product.minStock);
  const statusColor = getStockStatusColor(product.currentStock, product.minStock);
  const isOut = product.currentStock === 0;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all active:scale-[0.97] hover:shadow-md",
        "min-h-[80px]",
        isOut && "opacity-50"
      )}
      onClick={() => !isOut && onAdd(product)}
    >
      <div className="flex flex-col justify-between h-full p-3 gap-1">
        <p className="text-sm font-medium leading-tight line-clamp-2">
          {product.name}
        </p>
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-bold tabular-nums">
            {formatCurrency(product.salePrice)}
          </span>
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-0 shrink-0 ${statusColor}`}
          >
            {product.currentStock}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
