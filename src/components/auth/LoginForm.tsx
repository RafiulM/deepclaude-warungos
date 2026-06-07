"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api-client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Store, UserIcon } from "lucide-react";
import { toast } from "sonner";

const MOCK_ACCOUNTS = [
  { name: "Pak Budi", role: "pemilik", email: "budi@warungos.local" },
  { name: "Mbak Siti", role: "penjaga", email: "siti@warungos.local" },
  { name: "Mas Anto", role: "penjaga", email: "anto@warungos.local" },
];

const DEFAULT_PASSWORD = "warung123";

export function LoginForm() {
  const [loading, setLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setUser = useAuthStore((s) => s.login);

  const handleUserSelect = (email: string) => {
    setSelectedEmail(email);
    setShowPassword(true);
    setPassword("");
  };

  const handleLogin = async () => {
    if (!selectedEmail) return;
    setLoading(selectedEmail);
    const result = await login(selectedEmail, password || DEFAULT_PASSWORD);
    if (result.success && result.data) {
      setUser({
        id: result.data.id,
        name: result.data.name,
        role: (result.data as any).role || "penjaga",
      });
      toast.success(`Selamat datang, ${result.data.name}`);
      router.push("/");
    } else {
      toast.error(result.message || "Login gagal");
    }
    setLoading(null);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Branding */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <Store className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)]">WarungOS</h1>
        <p className="text-sm text-muted-foreground">
          Sistem Kasir & Inventaris Warung
        </p>
      </div>

      {!showPassword ? (
        /* User Selection */
        <div className="w-full max-w-sm">
          <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
            Pilih akun untuk masuk:
          </p>
          <div className="grid gap-3">
            {MOCK_ACCOUNTS.map((user) => (
              <Card
                key={user.email}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
                onClick={() => handleUserSelect(user.email)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {user.role}
                    </p>
                  </div>
                  <Button size="sm">Masuk</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Password Entry */
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <p className="font-medium">{MOCK_ACCOUNTS.find((a) => a.email === selectedEmail)?.name}</p>
            <p className="text-xs text-muted-foreground">{selectedEmail}</p>
          </div>
          <Input
            type="password"
            placeholder="Kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="h-11"
            autoFocus
          />
          <Button
            onClick={handleLogin}
            disabled={loading === selectedEmail}
            className="w-full min-h-[44px]"
          >
            {loading === selectedEmail ? "Masuk..." : "Masuk"}
          </Button>
          <button
            onClick={() => setShowPassword(false)}
            className="w-full text-center text-xs text-muted-foreground hover:underline"
          >
            ← Pilih akun lain
          </button>
        </div>
      )}
    </div>
  );
}
