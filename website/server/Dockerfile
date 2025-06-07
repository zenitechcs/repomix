# ==============================================================================
# Base image
# ==============================================================================
FROM node:23-alpine AS builder

WORKDIR /app
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ==============================================================================
# Production dependencies
# ==============================================================================
FROM node:23-alpine AS deps

WORKDIR /app
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ==============================================================================
# Runtime image
# ==============================================================================
FROM node:23-alpine

# Install git (required by repomix for remote repository processing)
RUN apk add --no-cache git

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy production dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production \
    PORT=8080

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8080

# Start the server directly
CMD ["node", "dist/index.js"]
