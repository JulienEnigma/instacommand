#!/bin/bash


set -e

echo "🚀 Setting up Social Commander on RunPod..."

apt-get update && apt-get upgrade -y

apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    python3-pip \
    nodejs \
    npm \
    supervisor

if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

if [ ! -d "/workspace/instacommand" ]; then
    cd /workspace
    git clone https://github.com/JulienEnigma/instacommand.git
    cd instacommand
else
    cd /workspace/instacommand
    git pull origin main
fi

mkdir -p /workspace/data /workspace/logs

cat > /workspace/instacommand/.env << EOF
API_HOST=0.0.0.0
API_PORT=8000
DATABASE_URL=sqlite:///workspace/data/social_commander.db
LLM_MODEL_NAME=microsoft/DialoGPT-medium
DEBUG=false
INSTAGRAM_USERNAME=
INSTAGRAM_PASSWORD=
EOF

echo "🔨 Building Social Commander..."
docker-compose build

echo "🚀 Starting Social Commander..."
docker-compose up -d

cat > /etc/supervisor/conf.d/social-commander.conf << EOF
[program:social-commander]
command=docker-compose up
directory=/workspace/instacommand
autostart=true
autorestart=true
stderr_logfile=/workspace/logs/social-commander.err.log
stdout_logfile=/workspace/logs/social-commander.out.log
user=root
EOF

supervisorctl reread
supervisorctl update
supervisorctl start social-commander

echo "✅ Social Commander setup complete!"
echo ""
echo "🌐 Access your application at:"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/health"
echo "   API Documentation: http://localhost:8000/docs"
echo ""
echo "📁 Data stored in: /workspace/data"
echo "📋 Logs stored in: /workspace/logs"
echo ""
echo "🔧 To configure Instagram credentials:"
echo "   Edit /workspace/instacommand/.env"
echo "   Set INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD"
echo "   Then restart: docker-compose restart"
echo ""
echo "📊 Monitor with: docker-compose logs -f"
