"use client";

import { useEffect, useState, useMemo } from "react";
import { Product, ProductCategory } from "@/lib/types";
import { getProducts } from "@/lib/api-client";
import { StockRow } from "./StockRow";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CATEGORY_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];

export function StockTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "stock">("name");

  useEffect(() => {
    getProducts().then((res) => {
      if (res.success) setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.currentStock - b.currentStock;
    });
    return result;
  }, [products, activeCategory, search, sortBy]);

  const lowStockCount = products.filter(
    (p) => p.currentStock <= p.minStock
  ).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search + stats */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} barang • {lowStockCount} perlu restock
        </p>
        <button
          onClick={() => setSortBy(sortBy === "name" ? "stock" : "name")}
          className="text-xs text-primary hover:underline"
        >
          Urut: {sortBy === "name" ? "Nama" : "Stok"}
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors min-h-[32px]",
            !activeCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          Semua
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors min-h-[32px]",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Barang</TableHead>
              <TableHead className="hidden sm:table-cell">Kategori</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="hidden sm:table-cell">Min</TableHead>
              <TableHead className="text-right">Harga Jual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Tidak ada barang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <StockRow key={product.id} product={product} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
