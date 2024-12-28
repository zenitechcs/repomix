FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g repomix --no-cache-dir \
    && npm cache clean --force

WORKDIR /app

ENTRYPOINT ["repomix"]
