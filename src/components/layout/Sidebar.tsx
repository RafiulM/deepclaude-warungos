"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingCart, PackagePlus, Package, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/penjualan", label: "POS", icon: ShoppingCart },
  { href: "/catat-belanja", label: "Restock", icon: PackagePlus },
  { href: "/stok", label: "Stok", icon: Package },
  { href: "/riwayat", label: "Riwayat", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r bg-card h-full">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)]">WarungOS</h1>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                "min-h-[44px]",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
