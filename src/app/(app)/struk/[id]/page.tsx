"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sale } from "@/lib/types";
import { getSale } from "@/lib/api-client";
import { ReceiptContent } from "@/components/receipt/ReceiptContent";
import { ReceiptActions } from "@/components/receipt/ReceiptActions";
import { usePrint } from "@/hooks/use-print";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ReceiptPage() {
  const params = useParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const { print } = usePrint();

  useEffect(() => {
    const id = params.id as string;
    getSale(id).then((res) => {
      if (res.success) setSale(res.data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-sm space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="mx-auto max-w-sm text-center py-12">
        <p className="font-medium">Struk tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          Transaksi dengan ID tersebut tidak ada
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Struk Belanja</h1>
        <p className="text-sm text-muted-foreground">
          Preview struk siap cetak
        </p>
      </div>

      <Card className="p-4 bg-white">
        <ReceiptContent sale={sale} />
      </Card>

      <ReceiptActions onPrint={print} />
    </div>
  );
}
