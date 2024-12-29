FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /repomix
WORKDIR /repomix

# Install dependencies and build repomix, then link the package to the global scope
COPY . .
RUN npm ci \
    && npm run build \
    && npm link \
    && npm ci --omit=dev \
    && npm cache clean --force \
    && repomix --help

WORKDIR /app

ENTRYPOINT ["repomix"]
