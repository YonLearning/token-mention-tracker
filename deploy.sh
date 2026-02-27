#!/bin/bash

echo "🚀 Token Mention Tracker - Deploy to Vercel"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo -e "${RED}❌ Error: Must run from token-tracker directory${NC}"
    echo "   cd /home/ubuntu/.openclaw/workspace/token-tracker"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📦 Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Token Mention Tracker"
fi

# Check for config.js
if grep -q "YOUR_TWITTER_BEARER_TOKEN_HERE" config.js; then
    echo -e "${RED}⚠️  Warning: You haven't set your API keys in config.js${NC}"
    echo ""
    echo "   Edit config.js and add:"
    echo "   - Twitter Bearer Token"
    echo "   - Claude API Key"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Add vercel.json if not exists
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}📝 Creating vercel.json...${NC}"
    cat > vercel.json << 'EOF'
{
  "version": 2,
  "name": "token-mention-tracker",
  "builds": [{"src": "server.js", "use": "@vercel/node"}],
  "routes": [{"src": "/(.*)", "dest": "/server.js"}],
  "crons": [{"path": "/api/cron/track", "schedule": "0 */6 * * *"}]
}
EOF
fi

# Commit any changes
echo -e "${YELLOW}💾 Saving changes...${NC}"
git add .
git commit -m "Ready for Vercel deployment" 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Project is ready!${NC}"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/YonLearning/token-mention-tracker.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Click 'Add New Project'"
echo "   - Import your GitHub repo"
echo "   - Add Environment Variables:"
echo "     • TWITTER_BEARER_TOKEN"
echo "     • CLAUDE_API_KEY"
echo "   - Click Deploy"
echo ""
echo "3. Read full guide:"
echo "   cat VERCEL_DEPLOY.md"
echo ""
echo -e "${GREEN}🚀 Ready to deploy!${NC}"
