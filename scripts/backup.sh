#!/usr/bin/env bash
set -euo pipefail
# Simple backup script for the SQLite DB used by the backend.
# Usage: ./scripts/backup.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$REPO_ROOT/data"
BACKUP_DIR="$REPO_ROOT/backups"
DB_FILE="$DATA_DIR/colonias.db"

mkdir -p "$BACKUP_DIR"

if [ ! -f "$DB_FILE" ]; then
  echo "Database file not found: $DB_FILE" >&2
  exit 1
fi

ts=$(date -u +"%Y%m%dT%H%M%SZ")
OUT_SQL="$BACKUP_DIR/colonias-${ts}.sql"

echo "Backing up $DB_FILE -> $OUT_SQL.gz"
# Use SQL dump to avoid copying a hot DB file
sqlite3 "$DB_FILE" .dump > "$OUT_SQL"
gzip -f "$OUT_SQL"

# Rotate: keep last 30 days of backups
find "$BACKUP_DIR" -type f -mtime +30 -name '*.gz' -delete || true

echo "Backup completed: $BACKUP_DIR/colonias-${ts}.sql.gz"
