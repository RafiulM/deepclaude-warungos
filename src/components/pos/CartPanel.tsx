"use client";

import { useSaleStore } from "@/lib/stores/sale-store";
import { formatCurrency } from "@/lib/utils";
import { CartItemRow } from "./CartItemRow";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard } from "lucide-react";

interface CartPanelProps {
  onCheckout: () => void;
  compact?: boolean;
}

export function CartPanel({ onCheckout, compact }: CartPanelProps) {
  const cart = useSaleStore((s) => s.cart);
  const updateCartQty = useSaleStore((s) => s.updateCartQty);
  const removeFromCart = useSaleStore((s) => s.removeFromCart);
  const clearCart = useSaleStore((s) => s.clearCart);

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (compact) {
    // Mobile collapsed view: bottom bar
    if (cart.length === 0) return null;
    return (
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t bg-card px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">{itemCount} barang</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-bold tabular-nums">
              {formatCurrency(total)}
            </span>
            <Button onClick={onCheckout} size="sm" className="gap-1 min-h-[44px]">
              <CreditCard className="h-4 w-4" />
              Bayar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop / full cart view
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-sm">
            Keranjang ({itemCount})
          </h2>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
          >
            Kosongkan
          </button>
        )}
      </div>
      <Separator />

      {cart.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">
            Keranjang kosong
          </p>
          <p className="text-xs text-muted-foreground/60">
            Pilih barang untuk memulai transaksi
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {cart.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onUpdateQty={updateCartQty}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </ScrollArea>
          <Separator />
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(total)}
              </span>
            </div>
            <Button
              onClick={onCheckout}
              className="w-full gap-2 min-h-[48px] text-base"
              size="lg"
            >
              <CreditCard className="h-5 w-5" />
              Bayar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
