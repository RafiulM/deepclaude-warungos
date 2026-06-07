#!/bin/sh
set -e

# Resolve the SQLite path from DATABASE_URL (strip the file: prefix).
DB_PATH="${DATABASE_URL#file:}"
: "${DB_PATH:=/app/data/warungos.db}"
DB_DIR="$(dirname "$DB_PATH")"

mkdir -p "$DB_DIR"

# Seed from the baked copy when the database is missing or has no schema. This
# happens when a fresh/empty persistent volume (Coolify, docker volume, bind
# mount) is mounted over the image's copy, leaving better-sqlite3 to create an
# empty, tableless file -> "no such table: user".
needs_seed=0
if [ ! -f "$DB_PATH" ]; then
  needs_seed=1
elif ! node -e "const D=require('better-sqlite3');try{const db=new D(process.argv[1],{readonly:true});process.exit(db.prepare(\"select 1 from sqlite_master where type='table' and name='user'\").get()?0:1)}catch(e){process.exit(1)}" "$DB_PATH"; then
  needs_seed=1
fi

if [ "$needs_seed" = "1" ]; then
  echo "[entrypoint] seeding database at $DB_PATH from /app/seed/warungos.db"
  rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"
  cp /app/seed/warungos.db "$DB_PATH"
fi

# Volumes may be root-owned; make sure the runtime user can read/write the DB.
chown -R nextjs:nodejs "$DB_DIR" 2>/dev/null || true

# Drop privileges and exec the server (CMD).
exec su-exec nextjs:nodejs "$@"
