#!/bin/bash

echo "🚀 Token Mention Tracker - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create data directory
mkdir -p data

# Instructions
echo "📝 Next Steps:"
echo "=============="
echo ""
echo "1. Configure API Keys:"
echo "   Edit config.js and add your API keys:"
echo "   - Twitter Bearer Token (from developer.twitter.com)"
echo "   - Claude API Key (from console.anthropic.com)"
echo ""
echo "2. Test locally:"
echo "   npm start"
echo "   Open http://localhost:3000"
echo ""
echo "3. Run test:"
echo "   npm test"
echo ""
echo "4. Deploy to Vercel:"
echo "   - Push to GitHub"
echo "   - Connect to Vercel"
echo "   - Add environment variables"
echo ""
echo "📚 Full instructions in README.md"
