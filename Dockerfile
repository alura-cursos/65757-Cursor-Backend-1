# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate && npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3333
ENV DATABASE_URL=file:/data/dev.db

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
COPY docker/entrypoint.sh ./docker/entrypoint.sh

RUN sed -i 's/\r$//' ./docker/entrypoint.sh \
  && chmod +x ./docker/entrypoint.sh \
  && mkdir -p /data

EXPOSE 3333

ENTRYPOINT ["./docker/entrypoint.sh"]
