FROM node:18-alpine

WORKDIR /app

# Copy application source
COPY src/ ./
COPY package.json ./

# Install dependencies if package.json has them
RUN if [ -f package.json ]; then npm ci --only=production; fi

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "server.js"] 