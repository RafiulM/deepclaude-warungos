"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-6xl font-bold text-muted-foreground/30">404</h1>
      <p className="text-lg font-medium">Halaman tidak ditemukan</p>
      <p className="text-sm text-muted-foreground text-center">
        Halaman yang Anda cari tidak tersedia di WarungOS
      </p>
      <Button
        onClick={() => router.push("/")}
        className="gap-2 min-h-[44px] mt-4"
      >
        <Home className="h-4 w-4" />
        Kembali ke Dashboard
      </Button>
    </div>
  );
}
