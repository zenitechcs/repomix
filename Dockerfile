FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /repomix
WORKDIR /repomix

# Install dependencies
COPY package*.json ./
RUN npm install

# Build and link repomix
COPY . .
RUN npm install \
    && npm run build \
    && npm link

WORKDIR /app

ENTRYPOINT ["repomix"]
