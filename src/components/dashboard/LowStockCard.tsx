"use client";

import { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { getStockStatus, getStockStatusColor, formatCurrency } from "@/lib/utils";

interface LowStockCardProps {
  product: Product;
}

export function LowStockCard({ product }: LowStockCardProps) {
  const router = useRouter();
  const status = getStockStatus(product.currentStock, product.minStock);
  const statusColor = getStockStatusColor(product.currentStock, product.minStock);

  return (
    <Card className="overflow-hidden border-l-4 border-l-red-500 transition-all hover:shadow-md">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate text-sm">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              Harga: {formatCurrency(product.salePrice)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="secondary"
            className={`text-xs font-bold ${statusColor}`}
          >
            {status === "habis" ? "Habis" : `${product.currentStock} tersisa`}
          </Badge>
          <button
            onClick={() => router.push("/catat-belanja")}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all min-h-[32px] min-w-[32px]"
          >
            <span className="hidden sm:inline">Restock</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
      {/* Stock progress bar */}
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-red-500 transition-all"
          style={{
            width: `${Math.min(100, (product.currentStock / product.minStock) * 100)}%`,
          }}
        />
      </div>
    </Card>
  );
}
