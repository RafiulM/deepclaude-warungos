"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { getLowStockProducts } from "@/lib/api-client";
import { LowStockCard } from "./LowStockCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export function LowStockAlertList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLowStockProducts().then((res) => {
      if (res.success) setProducts(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
          <AlertTriangle className="h-6 w-6 text-green-500" />
        </div>
        <p className="mt-3 font-medium">Semua stok aman</p>
        <p className="text-sm text-muted-foreground">
          Tidak ada barang yang perlu direstock saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <h2 className="font-semibold text-sm">
          Perlu Direstock ({products.length})
        </h2>
      </div>
      <div className="space-y-2">
        {products.map((p) => (
          <LowStockCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
