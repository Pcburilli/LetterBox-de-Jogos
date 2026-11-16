# 1. Etapa de Dependências
FROM node:20-alpine AS deps
WORKDIR /app

# Copia os arquivos de manifesto do pacote
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Etapa de Build (Compilação)
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Passa a variável de ambiente para o Next.js durante o "npm run build"
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 3. Etapa Final de Execução (Runner leve)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copia apenas o necessário para a execução
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Executa em modo de produção
CMD ["npm", "run", "start"]