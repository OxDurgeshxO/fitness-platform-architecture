# ==========================================
# Realtime Service Production Dockerfile
# Node 22 Alpine Multi-Stage Container
# ==========================================

FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# --- Dependencies & Build Stage ---
FROM base AS builder
WORKDIR /app

# Copy package manifests
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/realtime-service/package.json ./apps/realtime-service/
COPY packages/types/package.json ./packages/types/
COPY packages/observability/package.json ./packages/observability/
COPY packages/ai/package.json ./packages/ai/
COPY packages/cv/package.json ./packages/cv/
COPY packages/core/package.json ./packages/core/
COPY packages/db/package.json ./packages/db/
COPY packages/pose-engine/package.json ./packages/pose-engine/

RUN pnpm install --frozen-lockfile

# Copy source trees
COPY tsconfig.json ./
COPY apps/realtime-service/ ./apps/realtime-service/
COPY packages/ ./packages/

# Build required packages and realtime-service
RUN pnpm --filter @fitness/types run build
RUN pnpm --filter @fitness/observability run build
RUN pnpm --filter @fitness/ai run build
RUN pnpm --filter @fitness/cv run build
RUN pnpm --filter @fitness/core run build
RUN pnpm --filter @fitness/realtime-service run build

# --- Production Runner Stage ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 realtimeuser

COPY --from=builder /app /app

USER realtimeuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["node", "apps/realtime-service/dist/index.js"]
