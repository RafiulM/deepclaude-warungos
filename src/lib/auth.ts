import { betterAuth } from "better-auth";
import { sqlite } from "@/db";

// Reuse the single shared better-sqlite3 connection (absolute, writable path)
// so auth tables and app data live in the same database file. Opening a second
// relative "warungos.db" here breaks under the standalone server / Docker
// (cwd is not writable) with SQLITE_CANTOPEN.
//
// secret / baseURL come from the runtime environment. In production better-auth
// throws if BETTER_AUTH_SECRET is unset, so it must be provided at run time
// (generate with `openssl rand -base64 32`).
export const auth = betterAuth({
  database: sqlite,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    minPasswordLength: 3,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "penjaga",
      },
    },
  },
});
