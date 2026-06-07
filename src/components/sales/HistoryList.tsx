"use client";

import { useEffect, useState, useMemo } from "react";
import { Sale } from "@/lib/types";
import { getSales } from "@/lib/api-client";
import { SaleCard } from "./SaleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReceiptText } from "lucide-react";

type DateFilter = "today" | "week" | "month" | "all";

export function HistoryList() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DateFilter>("today");

  useEffect(() => {
    getSales().then((res) => {
      if (res.success) setSales(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    switch (filter) {
      case "today":
        return sales.filter((s) => s.createdAt.slice(0, 10) === today);
      case "week": {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        return sales.filter((s) => s.createdAt.slice(0, 10) >= weekAgo);
      }
      case "month": {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        return sales.filter((s) => s.createdAt.slice(0, 10) >= monthAgo);
      }
      default:
        return sales;
    }
  }, [sales, filter]);

  const filters: { key: DateFilter; label: string }[] = [
    { key: "today", label: "Hari Ini" },
    { key: "week", label: "7 Hari" },
    { key: "month", label: "Bulan Ini" },
    { key: "all", label: "Semua" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Date filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors min-h-[36px]",
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ReceiptText className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 font-medium">Belum ada transaksi</p>
          <p className="text-sm text-muted-foreground">
            Transaksi akan muncul di sini setelah penjualan
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((sale) => (
            <SaleCard key={sale.id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
}
