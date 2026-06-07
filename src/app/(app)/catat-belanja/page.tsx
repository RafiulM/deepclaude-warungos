"use client";

import { RestockForm } from "@/components/restock/RestockForm";

export default function RestockPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">Catat Belanja</h1>
        <p className="text-sm text-muted-foreground">
          Input barang yang dibeli untuk restock hari ini
        </p>
      </div>
      <RestockForm />
    </div>
  );
}
