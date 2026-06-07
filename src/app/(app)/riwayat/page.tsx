"use client";

import { HistoryList } from "@/components/sales/HistoryList";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">Riwayat Penjualan</h1>
        <p className="text-sm text-muted-foreground">
          Daftar transaksi yang telah diproses
        </p>
      </div>
      <HistoryList />
    </div>
  );
}
