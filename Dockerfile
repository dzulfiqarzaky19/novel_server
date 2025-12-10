ARG NODE_VERSION=22.19.0

############################
# Build: TS -> dist -> bundle
############################
FROM node:${NODE_VERSION}-slim AS build
WORKDIR /app

# prevent Puppeteer from attempting any browser downloads during build
ENV PUPPETEER_SKIP_DOWNLOAD=1
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .

# produces /app/bundle/index.mjs via your prodbuild (tsc + esbuild)
RUN npm run prodbuild

############################
# Runtime: Node slim (Chrome runs in separate container)
############################
FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /app

# Only need CA certs for HTTPS requests
RUN apt-get update \
     && apt-get install -y --no-install-recommends ca-certificates \
     && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=1
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000



# Copy only the bundled server
COPY --from=build /app/bundle ./bundle

# Run as non-root
RUN useradd -m -u 10001 appuser
USER appuser

EXPOSE 3000
CMD ["node", "bundle/index.mjs"]