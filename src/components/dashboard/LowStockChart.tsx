"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { getLowStockProducts } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency, getStockStatusColor } from "@/lib/utils";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LowStockChart() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getLowStockProducts().then((res) => {
      if (res.success) setProducts(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <AlertTriangle className="h-4 w-4 text-green-600" />
            </div>
            Stok Aman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <AlertTriangle className="h-8 w-8 text-green-500" />
            </div>
            <p className="mt-4 font-medium">Semua stok aman</p>
            <p className="text-sm text-muted-foreground">
              Tidak ada barang yang perlu direstock saat ini
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by stock ratio ascending (most critical first)
  const chartData = products
    .map((p) => ({
      name: p.name,
      stok: p.currentStock,
      min: p.minStock,
      ratio: p.minStock > 0 ? p.currentStock / p.minStock : 0,
      productId: p.id,
    }))
    .sort((a, b) => a.ratio - b.ratio);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-popover p-3 shadow-md">
        <p className="font-semibold text-sm max-w-[200px] truncate">{data.name}</p>
        <div className="mt-1 space-y-0.5 text-xs">
          <p>Stok saat ini: <span className="font-bold">{data.stok}</span></p>
          <p>Stok minimal: <span className="font-bold">{data.min}</span></p>
          <p className="text-muted-foreground">
            Rasio: {(data.ratio * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          Perlu Direstock ({products.length})
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => router.push("/catat-belanja")}
        >
          Restock <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="oklch(0.88 0.015 84)"
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.02 80)" }}
                domain={[0, "dataMax + 5"]}
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.25 0.03 80)" }}
                width={140}
                tickFormatter={(v) =>
                  v.length > 18 ? v.slice(0, 18) + "…" : v
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(0.95 0.005 84)" }} />
              <Bar
                dataKey="stok"
                radius={[0, 4, 4, 0]}
                barSize={20}
                label={{
                  position: "right",
                  fontSize: 10,
                  fill: "oklch(0.5 0.02 80)",
                  formatter: (v: unknown) => String(v),
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.stok === 0
                        ? "oklch(0.55 0.2 20)"
                        : entry.ratio <= 0.5
                          ? "oklch(0.6 0.16 38)"
                          : "oklch(0.65 0.14 55)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
