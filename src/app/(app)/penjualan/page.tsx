"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { CartPanel } from "@/components/pos/CartPanel";
import { PaymentDialog } from "@/components/pos/PaymentDialog";
import { createSale } from "@/lib/api-client";
import { useSaleStore } from "@/lib/stores/sale-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PosPage() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const router = useRouter();
  const cart = useSaleStore((s) => s.cart);
  const addToCart = useSaleStore((s) => s.addToCart);
  const user = useAuthStore((s) => s.user);

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} ditambahkan`, { duration: 1000 });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    setCartSheetOpen(false);
    setPaymentOpen(true);
  };

  const handleConfirmPayment = async (method: string) => {
    if (!user) return;
    const result = await createSale(cart, method as "tunai" | "qris" | "transfer");
    if (result.success) {
      toast.success("Transaksi berhasil disimpan");
      router.push(`/struk/${result.data.id}`);
    } else {
      toast.error(result.message || "Gagal menyimpan transaksi");
    }
  };

  // Mobile cart sheet
  const MobileCartTrigger = () => (
    <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
      <SheetTrigger className="fixed bottom-16 left-0 right-0 z-40 flex items-center justify-between border-t bg-card px-4 py-3 md:hidden cursor-pointer">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{cartCount} barang</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tabular-nums">
            Rp {cartTotal.toLocaleString("id-ID")}
          </span>
          {cartCount > 0 && (
            <Badge variant="default" className="h-6 px-2 text-xs">
              Lihat
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-xl p-0">
        <div className="h-full">
          <CartPanel onCheckout={handleCheckout} />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="mx-auto flex h-full max-w-6xl gap-4">
      {/* Product area */}
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <div className="mb-3">
          <h1 className="text-xl font-bold tracking-tight">Penjualan POS</h1>
          <p className="text-sm text-muted-foreground">Pilih barang untuk transaksi</p>
        </div>
        <ProductGrid onAddToCart={handleAddToCart} />
      </div>

      {/* Desktop cart panel */}
      <div className="hidden md:block md:w-80 lg:w-96 border-l bg-card/50 rounded-lg overflow-hidden">
        <CartPanel onCheckout={handleCheckout} />
      </div>

      {/* Mobile cart bar + sheet */}
      {cart.length > 0 && <MobileCartTrigger />}

      {/* Payment dialog */}
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        total={cartTotal}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}
