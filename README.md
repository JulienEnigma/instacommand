# Social Commander - AI-Powered Instagram Automation Platform

A full-stack Instagram automation platform with local LLM integration, built with FastAPI backend and React frontend.

## 🚀 Features

- **Instagram Automation**: Hashtag scanning, following, DMs, and comments using Playwright
- **Local LLM Integration**: Stanley AI powered by transformers for command analysis and insights
- **Real-time Dashboard**: Live logs, metrics, and Instagram mirror with WebSocket updates
- **Queue Management**: Rate-limited operations to prevent Instagram blocking
- **RunPod Ready**: Containerized deployment for cloud hosting

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Instagram account credentials

## 🛠️ Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/JulienEnigma/instacommand.git
cd instacommand
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
playwright install chromium
python main.py
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🐳 Docker Deployment

### Local Docker
```bash
docker-compose up --build
```

### Production with Nginx
```bash
docker-compose --profile production up --build
```

## ☁️ RunPod Deployment

### Quick Setup
1. Create RunPod instance with the "Instagram" pod
2. Upload project files to `/workspace/instacommand`
3. Run setup script:
```bash
chmod +x runpod-setup.sh
./runpod-setup.sh
```

### Manual RunPod Setup
```bash
# Install dependencies
apt-get update && apt-get install -y docker.io docker-compose

# Clone and build
git clone https://github.com/JulienEnigma/instacommand.git
cd instacommand
docker-compose build

# Configure environment
cp .env.example .env
# Edit .env with your Instagram credentials

# Start services
docker-compose up -d
```

### RunPod Environment Variables
```bash
API_HOST=0.0.0.0
API_PORT=8000
DATABASE_URL=sqlite:///workspace/data/social_commander.db
LLM_MODEL_NAME=microsoft/DialoGPT-medium
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password
DEBUG=false
```

## 🔧 Configuration

### Instagram Credentials
Set your Instagram login credentials in the environment variables or through the web interface:
- `INSTAGRAM_USERNAME`: Your Instagram username
- `INSTAGRAM_PASSWORD`: Your Instagram password

### LLM Model Selection
Choose from supported models:
- `microsoft/DialoGPT-medium` (default, lightweight)
- `microsoft/DialoGPT-large` (better quality, more resources)
- `facebook/blenderbot-400M-distill` (alternative option)

### Rate Limiting
Configure operation delays in `backend/config/settings.py`:
- `FOLLOW_DELAY`: Seconds between follow operations (default: 60)
- `DM_DELAY`: Seconds between DM operations (default: 120)
- `SCAN_DELAY`: Seconds between scan operations (default: 30)

## 📊 API Endpoints

### Authentication
- `POST /auth/login` - Instagram login
- `GET /auth/status` - Check login status
- `POST /auth/logout` - Logout

### Instagram Operations
- `POST /instagram/scan` - Scan hashtag for targets
- `POST /instagram/follow` - Follow user
- `POST /instagram/dm` - Send direct message
- `POST /instagram/comment` - Add comment to post
- `GET /instagram/profile/stats` - Get profile statistics
- `GET /instagram/mirror/screenshot` - Get Instagram screenshot

### LLM & Stanley AI
- `POST /llm/generate` - Generate text with LLM
- `POST /llm/stanley/insight` - Get Stanley AI insights
- `POST /llm/stanley/recommendation` - Get recommendations

### Logs & Monitoring
- `GET /logs/` - Get recent logs
- `WebSocket /logs/stream` - Real-time log streaming
- `GET /status/` - System status
- `GET /health` - Health check

## 🎯 Usage Guide

### 1. Login to Instagram
Use the authentication interface or API to login with your Instagram credentials.

### 2. Start Operations
- **Scan**: `scan #photography` - Find targets in hashtag
- **Follow**: `follow @username` - Follow specific user
- **DM**: `dm @username "Hello!"` - Send direct message
- **Pause**: `pause ops` - Pause all operations

### 3. Monitor Activity
- View real-time logs in the dashboard
- Check Instagram mirror for profile updates
- Monitor Stanley AI insights and recommendations

### 4. Export Data
- Export logs as JSON/CSV
- Download Instagram mirror data
- View performance metrics

## 🔒 Security & Best Practices

### Rate Limiting
- Built-in delays prevent Instagram rate limiting
- Queue system manages operation timing
- Automatic retry logic for failed operations

### Data Privacy
- All data stored locally (SQLite database)
- No external API calls except Instagram
- Logs can be cleared anytime

### Instagram Safety
- Mimics human behavior patterns
- Randomized delays between actions
- Respects Instagram's terms of service

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check Python dependencies
pip install -r backend/requirements.txt

# Install Playwright browsers
playwright install chromium
```

**Frontend connection errors:**
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check CORS settings in main.py
```

**Instagram login fails:**
```bash
# Verify credentials in environment
echo $INSTAGRAM_USERNAME

# Check for 2FA requirements
# Use app-specific password if needed
```

**LLM model loading errors:**
```bash
# Clear model cache
rm -rf ~/.cache/huggingface/

# Try smaller model
export LLM_MODEL_NAME=microsoft/DialoGPT-medium
```

### Logs & Debugging
- Backend logs: `/tmp/social_commander.log`
- Frontend logs: Browser developer console
- Docker logs: `docker-compose logs -f`

## 📁 Project Structure

```
instacommand/
├── backend/                 # FastAPI backend
│   ├── config/             # Configuration settings
│   ├── database/           # SQLite database management
│   ├── models/             # Pydantic data models
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   └── main.py             # Application entry point
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── lib/                # API client and utilities
│   └── pages/              # Application pages
├── Dockerfile              # Container configuration
├── docker-compose.yml      # Multi-service orchestration
├── runpod-setup.sh         # RunPod deployment script
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is for educational and research purposes. Users are responsible for complying with Instagram's Terms of Service and applicable laws. Use responsibly and respect rate limits to avoid account restrictions.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review GitHub issues
3. Create new issue with detailed description
4. Include logs and error messages

---

**Built with ❤️ by Enigma Releasing**
