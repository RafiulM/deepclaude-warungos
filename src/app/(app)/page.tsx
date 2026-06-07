"use client";

import { DailySummary } from "@/components/dashboard/DailySummary";
import { LowStockChart } from "@/components/dashboard/LowStockChart";
import { StockDonutChart } from "@/components/dashboard/StockDonutChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan aktivitas warung hari ini
        </p>
      </div>

      {/* Stats row — full width, 4 cols */}
      <DailySummary />

      {/* Charts section — full width, 3-col grid: bar chart spans 2, donut spans 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LowStockChart />
        <StockDonutChart />
      </div>
    </div>
  );
}
