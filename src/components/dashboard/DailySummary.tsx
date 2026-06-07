"use client";

import { useEffect, useState } from "react";
import { DailySummary as DailySummaryType } from "@/lib/types";
import { getDailySummary } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function DailySummary() {
  const [summary, setSummary] = useState<DailySummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailySummary().then((res) => {
      if (res.success) setSummary(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-7 w-28 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Penjualan",
      value: summary ? formatCurrency(summary.totalSales) : "-",
      icon: DollarSign,
      gradient: "from-blue-500/10 to-blue-500/5",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: summary && summary.totalSales > 0 ? "up" : null,
      trendLabel: summary ? `${summary.totalTransactions} transaksi` : "",
    },
    {
      label: "Total Transaksi",
      value: summary ? `${summary.totalTransactions}` : "-",
      icon: ShoppingCart,
      gradient: "from-purple-500/10 to-purple-500/5",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: null,
      trendLabel: "Hari ini",
    },
    {
      label: "Total Belanja",
      value: summary ? formatCurrency(summary.totalExpenses) : "-",
      icon: TrendingDown,
      gradient: "from-orange-500/10 to-orange-500/5",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: summary && summary.totalExpenses > 0 ? "down" : null,
      trendLabel: "Pengeluaran restock",
    },
    {
      label: "Pendapatan Kotor",
      value: summary ? formatCurrency(summary.totalRevenue) : "-",
      icon: TrendingUp,
      gradient: summary && summary.totalRevenue >= 0
        ? "from-emerald-500/10 to-emerald-500/5"
        : "from-red-500/10 to-red-500/5",
      iconBg: summary && summary.totalRevenue >= 0 ? "bg-emerald-100" : "bg-red-100",
      iconColor: summary && summary.totalRevenue >= 0 ? "text-emerald-600" : "text-red-600",
      trend: summary && summary.totalRevenue >= 0 ? "up" : "down",
      trendLabel: "Penjualan - Belanja",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border-0 shadow-sm`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              {stat.trend && (
                <span
                  className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    stat.trend === "up"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                </span>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground font-medium">
              {stat.label}
            </p>
            <p className="mt-0.5 text-xl font-bold tracking-tight tabular-nums">
              {stat.value}
            </p>
            {stat.trendLabel && (
              <p className="mt-1 text-[10px] text-muted-foreground/70">
                {stat.trendLabel}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
