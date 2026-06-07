"use client";

import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReceiptActionsProps {
  onPrint: () => void;
}

export function ReceiptActions({ onPrint }: ReceiptActionsProps) {
  const router = useRouter();

  return (
    <div className="no-print flex items-center justify-between gap-2">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="gap-2 min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Button>
      <Button
        onClick={onPrint}
        className="gap-2 min-h-[44px]"
      >
        <Printer className="h-4 w-4" />
        Cetak Struk
      </Button>
    </div>
  );
}
