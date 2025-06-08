FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Install Playwright browsers
RUN playwright install chromium
RUN playwright install-deps chromium

# Copy package.json and install Node.js dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /tmp/static /app/logs /app/data

# Set environment variables
ENV PYTHONPATH=/app/backend
ENV NODE_ENV=production
ENV API_HOST=0.0.0.0
ENV API_PORT=8000
ENV DATABASE_URL=sqlite:///app/data/social_commander.db
ENV LLM_MODEL_NAME=microsoft/DialoGPT-medium
ENV DEBUG=false

# Expose ports
EXPOSE 8000 3000

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Starting Social Commander Backend..."\n\
cd /app/backend\n\
python main.py &\n\
BACKEND_PID=$!\n\
\n\
echo "Backend started with PID: $BACKEND_PID"\n\
echo "Social Commander is ready!"\n\
echo "Backend API: http://0.0.0.0:8000"\n\
echo "Health check: http://0.0.0.0:8000/health"\n\
\n\
# Wait for backend to be ready\n\
sleep 5\n\
\n\
# Keep container running\n\
wait $BACKEND_PID\n\
' > /app/start.sh && chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["/app/start.sh"]
