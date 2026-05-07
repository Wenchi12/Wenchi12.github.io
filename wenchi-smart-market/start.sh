#!/bin/bash

# Wenchi Smart Market — demo launcher
# Usage: ./start.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

echo ""
echo -e "${GREEN}⚔️  Wenchi Smart Market${RESET}"
echo -e "${CYAN}Starting backend + frontend...${RESET}"
echo ""

# Check for .env
if [ ! -f server/.env ]; then
  echo -e "${YELLOW}Warning: server/.env not found.${RESET}"
  echo -e "Copying from .env.example — edit DATABASE_URL before running."
  cp server/.env.example server/.env
fi

# Install dependencies if node_modules missing
if [ ! -d server/node_modules ]; then
  echo "Installing server dependencies..."
  (cd server && npm install --silent)
fi

if [ ! -d client/node_modules ]; then
  echo "Installing client dependencies..."
  (cd client && npm install --silent)
fi

# Generate Prisma client
echo -e "${CYAN}Generating Prisma client...${RESET}"
(cd server && npx prisma generate --silent 2>/dev/null)

echo ""
echo -e "${GREEN}Backend  →  http://localhost:3000${RESET}"
echo -e "${GREEN}Frontend →  http://localhost:5173${RESET}"
echo -e "${GREEN}USSD Sim →  open ussd-simulator/simulator.html${RESET}"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Boot both in parallel, stream logs with prefix
trap 'kill 0' INT

(cd server && npm run dev 2>&1 | sed 's/^/[server] /') &
(cd client && npm run dev 2>&1 | sed 's/^/[client] /') &

wait
