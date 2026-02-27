#!/bin/bash

echo "🐳 Token Mention Tracker - Docker Deployment"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "   Install: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed${NC}"
    echo "   Install: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker found${NC}"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo ""
    echo "Creating .env template..."
    cat > .env << EOF
# Token Tracker Environment Variables
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
CLAUDE_API_KEY=your_claude_api_key_here
PORT=3000
NODE_ENV=production
EOF
    echo -e "${YELLOW}📝 Created .env file${NC}"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your real API keys:"
    echo "   nano .env"
    echo ""
    read -p "Press Enter after you've added your API keys..."
fi

echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker-compose build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Token Tracker is running!${NC}"
echo ""
echo "📊 Access your app:"
echo "   Local: http://localhost:3000"
echo "   Health: http://localhost:3000/api/health"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop:         docker-compose down"
echo "   Restart:      docker-compose restart"
echo "   Update:       docker-compose pull && docker-compose up -d"
echo ""
echo "💾 Data is persisted in ./data folder"
echo ""
