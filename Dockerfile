# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.19.0

# --- build (TS -> dist) ---
FROM node:${NODE_VERSION}-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime with Chrome already installed ---
FROM ghcr.io/puppeteer/puppeteer:24 AS runtime
WORKDIR /app

# only prod deps (no dev, no optional metadata)
COPY package*.json ./
RUN npm ci --omit=dev --omit=optional --no-audit --no-fund

# bring compiled app only
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# optional: use system Chromium provided by the image
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

USER pptruser
EXPOSE 3000
CMD ["node", "dist/index.js"]
