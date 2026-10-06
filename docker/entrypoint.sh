#!/bin/sh
set -e

echo "Aplicando migrations..."
npx prisma migrate deploy

if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "Executando seed..."
  npx tsx prisma/seed.ts
fi

echo "Iniciando API Hermex..."
exec node dist/server.js
