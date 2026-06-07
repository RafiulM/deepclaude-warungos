"use client";

import { Sale } from "@/lib/types";
import { formatCurrency, formatDateTime, PAYMENT_LABELS } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface SaleCardProps {
  sale: Sale;
}

export function SaleCard({ sale }: SaleCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
      onClick={() => router.push(`/struk/${sale.id}`)}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums">
              {formatCurrency(sale.totalAmount)}
            </p>
            <Badge variant="outline" className="text-[10px]">
              {PAYMENT_LABELS[sale.paymentMethod]}
            </Badge>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {formatDateTime(sale.createdAt)}
            </p>
            <p className="text-sm">
              {sale.items.length} barang • Kasir: {sale.cashierName}
            </p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </Card>
  );
}
