import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

// Use native better-sqlite3 — no adapter needed
// Better Auth auto-creates user/session/account/verification tables
export const auth = betterAuth({
  database: new Database("warungos.db"),
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
