# Token Mention Tracker

AI-powered cryptocurrency token mention tracker with sentiment analysis.

## 🚀 Features

- **Real-time Tracking**: Monitor any crypto token's social mentions
- **AI Sentiment Analysis**: Claude-powered sentiment scoring (-10 to +10)
- **Spike Detection**: Automatic alerts when mentions spike 2x above average
- **Historical Data**: Track trends over time
- **Simple Dashboard**: Clean web interface to view results

## 📋 Prerequisites

1. **Twitter API Bearer Token**
   - Go to: https://developer.twitter.com
   - Apply for "Basic" (free tier)
   - Copy your Bearer Token

2. **Claude API Key**
   - Go to: https://console.anthropic.com
   - Get API key
   - Ensure you have API credits

## 🛠️ Setup

### 1. Clone and Install

```bash
git clone https://github.com/YonLearning/token-mention-tracker.git
cd token-mention-tracker
npm install
```

### 2. Configure API Keys

```bash
cp config.example.js config.js
# Edit config.js with your API keys
nano config.js
```

### 3. Run Locally

```bash
npm start
# Open http://localhost:3000
```

## 🌐 Deploy to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import `token-mention-tracker`
5. Add Environment Variables:
   - `TWITTER_BEARER_TOKEN` = your Twitter token
   - `CLAUDE_API_KEY` = your Claude key
6. Deploy!

### Step 3: Set Up Cron Job (Auto-tracking)
In Vercel dashboard:
1. Go to "Cron Jobs"
2. Add: `0 */6 * * *` (every 6 hours)
3. URL: `/api/cron/track`

## 📊 Usage

### Web Dashboard
1. Open your deployed URL
2. Enter token symbol (e.g., "BONK", "SOL")
3. Click "Track Now"
4. View mentions, sentiment, and spike alerts

### API Endpoints

```bash
# Track a token
GET /api/track/BONK

# Get historical data
GET /api/history/BONK

# Manual cron trigger
GET /api/cron/track
```

### Adding Tokens to Auto-Track

Edit `config.js`:
```javascript
trackedTokens: ['BONK', 'SOL', 'WIF', 'JUP']
```

## 🔧 Configuration

Edit `config.js`:

```javascript
module.exports = {
  // API Keys
  twitterBearerToken: process.env.TWITTER_BEARER_TOKEN || 'your-token-here',
  claudeApiKey: process.env.CLAUDE_API_KEY || 'your-key-here',
  
  // Tracking Settings
  trackedTokens: ['BONK'], // Tokens to auto-track
  checkInterval: '0 */6 * * *', // Every 6 hours
  spikeThreshold: 2.0, // 2x average = spike
  
  // Claude Settings
  claudeModel: 'claude-3-5-sonnet-20241022',
  maxTweetsToAnalyze: 100
};
```

## 💡 How It Works

1. **Fetch**: Gets recent tweets mentioning the token (Twitter API)
2. **Analyze**: Sends tweets to Claude for sentiment scoring
3. **Store**: Saves data to JSON files
4. **Detect**: Compares to historical average for spikes
5. **Alert**: Flags when mentions spike above threshold

## 🎯 Example Output

```json
{
  "token": "BONK",
  "mentions": 47,
  "sentiment": {
    "score": 6.5,
    "classification": "BULLISH",
    "summary": "Community excited about upcoming exchange listing"
  },
  "spike": {
    "isSpike": true,
    "increase": 235,
    "average": 14,
    "current": 47
  }
}
```

## 🚨 Twitter API Limits

- **Free Tier**: 100 requests / 24 hours
- **Your limits**:
  - 1 token every 15 minutes = 96 checks/day ✅
  - 4 tokens every 6 hours = 16 checks/day ✅
  - 10 tokens every 12 hours = 20 checks/day ✅

## 📝 Roadmap

- [ ] Telegram alerts for spikes
- [ ] Discord webhook integration
- [ ] Price correlation analysis
- [ ] More data sources (Reddit, Discord)
- [ ] Historical charts

## 👨‍💻 Built By

You! In one day with AI assistance.

**Tech Stack:**
- Node.js + Express
- Twitter API v2
- Claude AI (Anthropic)
- Vanilla JavaScript

## 📄 License

MIT - Feel free to modify and share!
