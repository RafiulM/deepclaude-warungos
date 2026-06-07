"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Package } from "lucide-react";

const COLORS = {
  habis: "oklch(0.55 0.2 20)",
  menipis: "oklch(0.65 0.16 48)",
  aman: "oklch(0.55 0.12 160)",
};

const LABELS = { habis: "Habis", menipis: "Menipis", aman: "Aman" };

export function StockDonutChart() {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((res) => {
      if (!res.success) {
        setLoading(false);
        return;
      }
      const products = res.data;
      const counts = { habis: 0, menipis: 0, aman: 0 };

      products.forEach((p) => {
        if (p.currentStock === 0) counts.habis++;
        else if (p.currentStock <= p.minStock) counts.menipis++;
        else counts.aman++;
      });

      setData([
        { name: "Aman", value: counts.aman, color: COLORS.aman },
        { name: "Menipis", value: counts.menipis, color: COLORS.menipis },
        { name: "Habis", value: counts.habis, color: COLORS.habis },
      ].filter((d) => d.value > 0));

      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const pct = ((d.value / total) * 100).toFixed(0);
    return (
      <div className="rounded-lg border bg-popover p-2 shadow-md text-xs">
        <p className="font-semibold">{d.name}</p>
        <p>
          {d.value} barang ({pct}%)
        </p>
      </div>
    );
  };

  const renderLegend = ({ payload }: any) => (
    <div className="flex justify-center gap-4 mt-3">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">
            {entry.value} ({((entry.payload.value / total) * 100).toFixed(0)}%)
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
            <Package className="h-4 w-4 text-accent-foreground" />
          </div>
          Status Stok
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={2}
                stroke="oklch(1 0 0)"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-1">
          Total: {total} produk
        </p>
      </CardContent>
    </Card>
  );
}
