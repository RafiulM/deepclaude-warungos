"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { LogOut, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";

export function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    logout();
    toast.success("Berhasil keluar");
    router.push("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2 md:hidden">
        <Store className="h-5 w-5 text-primary" />
        <h1 className="text-base font-bold tracking-tight font-[family-name:var(--font-display)]">WarungOS</h1>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden sm:inline">
              {user.name}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
              {user.role}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleLogout}
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
