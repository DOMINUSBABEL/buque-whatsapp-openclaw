# ==============================================================================
# BUQUE B2B AGENTIC SWARM - PRODUCTION DOCKERFILE
# Multi-stage lightweight deployment container with FFmpeg support
# ==============================================================================

FROM node:20-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    fonts-freefont-ttf \
    fonts-liberation \
    ca-certificates \
    dumb-init \
    procps \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p /app/whatsapp_auth_info /app/data /app/generated_sites /app/generated_videos

VOLUME ["/app/whatsapp_auth_info", "/app/data", "/app/generated_sites", "/app/generated_videos"]

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]
