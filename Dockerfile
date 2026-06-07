# syntax=docker/dockerfile:1

# ---- Base ----------------------------------------------------------------
# Pinned Node 22 (LTS) on Alpine for a small image. libc6-compat is needed by
# some Node native addons; the SQLite driver (better-sqlite3) links libstdc++.
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat


# ---- Dependencies --------------------------------------------------------
# Install with the lockfile. python3/make/g++ are required to compile the
# better-sqlite3 native binding from source when no musl prebuild is available.
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci


# ---- Builder -------------------------------------------------------------
# Build the Next.js app. output: "standalone" (see next.config.ts) emits a
# self-contained server at .next/standalone.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Telemetry off in CI/build.
ENV NEXT_TELEMETRY_DISABLED=1

# The db module is evaluated during `next build` (page-data collection), which
# opens the SQLite file. Point it at a throwaway, always-writable path so the
# build never depends on the final DB location or on who runs the build.
# No secret is needed at build time — better-auth's secret is only read per
# request — so secrets are intentionally NOT passed as build args.
ENV DATABASE_URL=file:/tmp/build.db

# Build-time public env vars (NEXT_PUBLIC_*) are inlined into the client bundle
# during `next build`, so they must be passed as build args. Add more as needed.
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN npm run build


# ---- Runner --------------------------------------------------------------
# Minimal production image: only the standalone server, static assets, and a
# writable data dir for the SQLite database.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# su-exec lets the entrypoint run as root (to fix volume perms / seed the DB)
# then drop to the unprivileged user for the server.
RUN apk add --no-cache su-exec \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server + assets it does not copy itself (static, public).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Pristine seed DB kept OUTSIDE the volume. The entrypoint copies it into the
# (possibly empty / freshly-mounted) data volume when the schema is missing.
COPY --chown=nextjs:nodejs warungos.db /app/seed/warungos.db

# Writable, mountable data dir for the live SQLite DB (+ WAL/SHM sidecars).
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data
VOLUME /app/data

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# NOTE: stays root so the entrypoint can chown the volume; it drops to `nextjs`
# via su-exec before exec'ing the server.

# Runtime env vars. Pass secrets at `docker run` with -e / --env-file (read by
# the server at request time, NOT baked into the image — never use build ARGs
# for these):
#   BETTER_AUTH_SECRET  REQUIRED in production; better-auth throws without it.
#                       Generate with: openssl rand -base64 32
#   BETTER_AUTH_URL     public base URL of the app, e.g. https://warung.example
#   APP_PASSWORD        login password for the app
# Only the non-sensitive defaults below are baked in.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/app/data/warungos.db

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
