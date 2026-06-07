"use client";

import { useState, useEffect } from "react";
import { PaymentMethod } from "@/lib/types";
import { formatCurrency, calculateChange, PAYMENT_LABELS } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Banknote, QrCode, CreditCard, CheckCircle } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onConfirm: (method: PaymentMethod, amountPaid: number) => void;
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { id: "tunai", label: "Tunai", icon: Banknote },
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "transfer", label: "Transfer", icon: CreditCard },
];

export function PaymentDialog({
  open,
  onOpenChange,
  total,
  onConfirm,
}: PaymentDialogProps) {
  const [method, setMethod] = useState<PaymentMethod>("tunai");
  const [amountPaid, setAmountPaid] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) {
      setMethod("tunai");
      setAmountPaid("");
      setConfirmed(false);
    }
  }, [open]);

  const paidNum = parseInt(amountPaid) || 0;
  const change = calculateChange(paidNum, total);
  const isExact = paidNum >= total;

  const handleConfirm = () => {
    if (method !== "tunai" || isExact) {
      setConfirmed(true);
      setTimeout(() => {
        onConfirm(method, paidNum);
        onOpenChange(false);
      }, 600);
    }
  };

  if (confirmed) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-lg font-bold text-center">Pembayaran Berhasil!</p>
            <p className="text-sm text-muted-foreground">Menyimpan transaksi...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
          <DialogDescription>
            Konfirmasi metode pembayaran
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Total */}
          <div className="rounded-lg bg-primary/5 p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Tagihan</p>
            <p className="text-2xl font-bold tabular-nums">
              {formatCurrency(total)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Metode Pembayaran</p>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border p-3 transition-all min-h-[72px]",
                    "active:scale-95",
                    method === pm.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "hover:bg-accent text-muted-foreground"
                  )}
                >
                  <pm.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash input */}
          {method === "tunai" && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Jumlah Dibayar</p>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="text-lg font-bold h-12"
                autoFocus
              />
              {/* Quick amounts */}
              <div className="flex gap-1.5">
                {[total, total + 5000, total + 10000, total + 20000]
                  .filter((v) => v > 0)
                  .map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmountPaid(v.toString())}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs transition-colors min-h-[32px]",
                        amountPaid === v.toString()
                          ? "border-primary bg-primary/10 text-primary"
                          : "hover:bg-accent"
                      )}
                    >
                      {formatCurrency(v)}
                    </button>
                  ))}
              </div>
              {amountPaid && (
                <div className="flex justify-between text-sm">
                  <span>Kembalian</span>
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      change >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {formatCurrency(change)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* QRIS / Transfer placeholder */}
          {method === "qris" && (
            <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/30 p-6">
              <QrCode className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">
                Scan QRIS dengan aplikasi pembayaran pelanggan
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirm}
                className="w-full min-h-[44px]"
              >
                Konfirmasi Pembayaran QRIS
              </Button>
            </div>
          )}

          {method === "transfer" && (
            <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/30 p-6">
              <CreditCard className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">
                Konfirmasi setelah pelanggan selesai transfer
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirm}
                className="w-full min-h-[44px]"
              >
                Konfirmasi Pembayaran Transfer
              </Button>
            </div>
          )}

          {/* Confirm button for cash */}
          {method === "tunai" && (
            <Button
              onClick={handleConfirm}
              disabled={!isExact}
              className="w-full min-h-[48px] text-base"
              size="lg"
            >
              {isExact
                ? `Bayar ${formatCurrency(total)}`
                : "Masukkan jumlah pembayaran"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
