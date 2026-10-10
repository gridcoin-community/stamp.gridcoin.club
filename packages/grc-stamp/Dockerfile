FROM node:22.16.0-alpine3.22

LABEL maintainer="Gridcoin Stamp Project"
LABEL description="Development environment for GRC Stamp backend service"

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose default port
EXPOSE 7000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT:-7000}/status || exit 1

# Set development environment
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
