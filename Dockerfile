# Build stage (railway-fix-v2: no packages copy)
FROM node:22-alpine AS builder

# Install pnpm matching lockfile version
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

# Copy workspace and lock files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Generate Prisma client before TypeScript compilation
RUN pnpm --filter api prisma:generate

# Build API
RUN pnpm --filter api build

# Production stage
FROM node:22-alpine

# Install pnpm matching lockfile version
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
