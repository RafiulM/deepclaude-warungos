"use client";

import { StockTable } from "@/components/stock/StockTable";

export default function StockPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">Monitor Stok</h1>
        <p className="text-sm text-muted-foreground">
          Daftar barang dan status stok saat ini
        </p>
      </div>
      <StockTable />
    </div>
  );
}
