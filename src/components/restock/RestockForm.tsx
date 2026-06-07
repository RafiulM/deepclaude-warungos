"use client";

import { useState, useEffect } from "react";
import { Product, ExpenseFormItem } from "@/lib/types";
import { getProducts, createExpense } from "@/lib/api-client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { RestockItemEntry } from "./RestockItemEntry";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";

function emptyItem(): ExpenseFormItem {
  return { productId: "", quantityAdded: 0, totalCost: 0 };
}

export function RestockForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ExpenseFormItem[]>([emptyItem()]);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    getProducts().then((res) => {
      if (res.success) setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const handleChange = (
    index: number,
    field: keyof ExpenseFormItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemove = (index: number) => {
    if (items.length === 1) {
      setItems([emptyItem()]);
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setItems((prev) => [...prev, emptyItem()]);
  };

  const totalCost = items.reduce(
    (sum, item) => sum + (item.totalCost || 0),
    0
  );

  const handleSave = async () => {
    const validItems = items.filter(
      (item) => item.productId && item.quantityAdded > 0 && item.totalCost > 0
    );

    if (validItems.length === 0) {
      toast.error("Isi minimal satu barang dengan lengkap");
      return;
    }

    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    setSaving(true);
    const result = await createExpense(validItems);
    setSaving(false);

    if (result.success) {
      toast.success(`Berhasil mencatat ${result.data.length} barang (${formatCurrency(totalCost)})`);
      setItems([emptyItem()]);
      router.push("/");
    } else {
      toast.error(result.message || "Gagal menyimpan");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item, i) => (
          <RestockItemEntry
            key={i}
            item={item}
            index={i}
            products={products}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleAdd}
        className="w-full gap-2 border-dashed min-h-[44px]"
      >
        <Plus className="h-4 w-4" />
        Tambah Barang
      </Button>

      {/* Summary */}
      {totalCost > 0 && (
        <div className="rounded-lg bg-primary/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Belanja</p>
          <p className="text-xl font-bold tabular-nums">
            {formatCurrency(totalCost)}
          </p>
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={saving || totalCost === 0}
        className="w-full gap-2 min-h-[48px] text-base"
        size="lg"
      >
        <Save className="h-5 w-5" />
        {saving ? "Menyimpan..." : "Simpan Catatan Belanja"}
      </Button>
    </div>
  );
}
