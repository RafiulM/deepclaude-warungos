"use client";

import { Product } from "@/lib/types";
import { StockBadge } from "./StockBadge";
import { formatCurrency, CATEGORY_LABELS } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";

interface StockRowProps {
  product: Product;
}

export function StockRow({ product }: StockRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
        {CATEGORY_LABELS[product.category]}
      </TableCell>
      <TableCell className="tabular-nums">
        <StockBadge current={product.currentStock} min={product.minStock} />
      </TableCell>
      <TableCell className="hidden sm:table-cell tabular-nums text-sm">
        Min: {product.minStock}
      </TableCell>
      <TableCell className="text-right tabular-nums font-medium">
        {formatCurrency(product.salePrice)}
      </TableCell>
    </TableRow>
  );
}
