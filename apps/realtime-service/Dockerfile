FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@12.21.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/realtime-service ./apps/realtime-service
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @fitness/types build
RUN pnpm --filter @fitness/cv build
RUN pnpm --filter @fitness/ai build
RUN pnpm --filter @fitness/core build
RUN pnpm --filter @fitness/realtime-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 8080 9121
CMD ["node", "apps/realtime-service/dist/index.js"]
