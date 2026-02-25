# Dockerfile for Google Cloud Run
# Multi-stage build for Remotion application

FROM node:20-alpine AS base

# Install dependencies for Remotion
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++ \
    pixman \
    cairo \
    pango \
    libjpeg-turbo \
    libgcc

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY src/ src/
COPY public/ public/

# Build the project
RUN npm run build

# Production stage
FROM base AS production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV REMOTION_OVERTIME=120

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Install tsx as dev dependency (will be installed with npm ci)

# Copy server file
COPY src/server.ts src/server.ts

# Start API server (which includes Remotion)
CMD ["npm", "run", "server"]
