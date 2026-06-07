"use client";

import { Sale } from "@/lib/types";
import { formatCurrency, formatDateTime, PAYMENT_LABELS } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ReceiptContentProps {
  sale: Sale;
  compact?: boolean;
}

export function ReceiptContent({ sale, compact }: ReceiptContentProps) {
  return (
    <div className="receipt-print-area mx-auto max-w-full bg-white text-black">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-sm font-bold uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
          WarungOS
        </h2>
        <p className="text-[10px] text-gray-600">
          Jl. Contoh No. 123, Jakarta
        </p>
        <p className="text-[10px] text-gray-600">
          Telp: 0812-3456-7890
        </p>
      </div>

      <Separator className="border-dashed border-gray-400 my-2" />

      {/* Info */}
      <div className="text-[10px] space-y-0.5 mb-2">
        <div className="flex justify-between">
          <span>No. Transaksi</span>
          <span className="font-mono font-medium">{sale.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Tanggal</span>
          <span>{formatDateTime(sale.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kasir</span>
          <span>{sale.cashierName}</span>
        </div>
        <div className="flex justify-between">
          <span>Metode</span>
          <span className="font-medium">
            {PAYMENT_LABELS[sale.paymentMethod]}
          </span>
        </div>
      </div>

      <Separator className="border-dashed border-gray-400 my-2" />

      {/* Items table */}
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-dashed border-gray-300">
            <th className="text-left pb-1 font-medium">Barang</th>
            <th className="text-center pb-1 font-medium">Qty</th>
            <th className="text-right pb-1 font-medium">Harga</th>
            <th className="text-right pb-1 font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item) => (
            <tr key={item.id} className="border-b border-dotted border-gray-200">
              <td className="py-0.5 text-left">{item.productName}</td>
              <td className="py-0.5 text-center">{item.quantity}</td>
              <td className="py-0.5 text-right tabular-nums">
                {item.unitPrice.toLocaleString("id-ID")}
              </td>
              <td className="py-0.5 text-right tabular-nums font-medium">
                {item.subtotal.toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Separator className="border-dashed border-gray-400 my-2" />

      {/* Total */}
      <div className="text-[10px] space-y-0.5 mb-2">
        <div className="flex justify-between font-bold text-xs">
          <span>TOTAL</span>
          <span className="tabular-nums">
            {formatCurrency(sale.totalAmount)}
          </span>
        </div>
      </div>

      <Separator className="border-dashed border-gray-400 my-2" />

      {/* Footer */}
      <div className="text-center text-[10px] text-gray-600 space-y-1">
        <p>Terima kasih atas kunjungan Anda!</p>
        <p>Barang yang sudah dibeli tidak dapat</p>
        <p>dikembalikan tanpa nota.</p>
      </div>
    </div>
  );
}
