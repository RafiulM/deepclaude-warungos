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

# Run as an unprivileged user.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server + assets it does not copy itself (static, public).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Seed/working SQLite DB lives in a writable, mountable dir so WAL/SHM sidecar
# files can be created and data can persist across restarts via a volume.
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data
COPY --chown=nextjs:nodejs warungos.db /app/data/warungos.db
VOLUME /app/data

USER nextjs

# Runtime env vars. Override at `docker run` with -e / --env-file (these are
# read by the server at request time, not baked into the image).
#   DATABASE_URL  path to the SQLite file (file: prefix is stripped by the app)
#   APP_PASSWORD  login password for the app
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/app/data/warungos.db

EXPOSE 3000

CMD ["node", "server.js"]
