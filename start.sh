#!/bin/bash

# Discord Music Bot - Start Script (macOS/Linux)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Discord Music Bot - Starting...         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}✗${NC} Error: .env file not found!"
    echo -e "${BLUE}ℹ${NC} Please run './setup.sh' first to configure the bot."
    exit 1
fi

# Check if bot is already running
if pgrep -f "node src/index.js" > /dev/null; then
    echo -e "${RED}✗${NC} Bot is already running!"
    echo -e "${BLUE}ℹ${NC} Use './stop.sh' to stop it first."
    exit 1
fi

# Start the bot
echo -e "${GREEN}✓${NC} Starting Discord Music Bot..."
echo -e "${BLUE}ℹ${NC} Press Ctrl+C to stop the bot"
echo ""

npm start
