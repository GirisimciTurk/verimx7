# Verimx7 — Next.js 16 standalone üretim imajı
# Çok aşamalı derleme: bağımlılıklar → derleme → yalın çalıştırma.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
# Kanonik adres DERLEME ANINDA gömülür (lib/site.ts).
ARG NEXT_PUBLIC_SITE_URL=https://verimx7.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# sharp'ı yalnızca kendi alt ağacıyla derle: çalışma imajına dar kopyalanır.
RUN mkdir -p /sharp-dist \
  && npm install --prefix /sharp-dist --omit=dev --no-save sharp@0.35.4 \
  && npm cache clean --force

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Root olmayan kullanıcı.
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs \
  && mkdir -p /var/lib/verimx7/leads \
  && chown -R nextjs:nodejs /var/lib/verimx7/leads \
  && chmod 700 /var/lib/verimx7/leads
# Standalone çıktısı: minimal sunucu + node_modules izi.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# next/image optimizasyonu için sharp; yalnızca sharp ve bağımlılıkları
# (tam `npm install` standalone izini şişirir, bu yüzden dar kopya).
COPY --from=builder /sharp-dist/node_modules ./node_modules
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
