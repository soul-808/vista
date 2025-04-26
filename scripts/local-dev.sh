#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Vista development environment...${NC}"

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting."; exit 1; }
command -v java >/dev/null 2>&1 || { echo "Java is required but not installed. Aborting."; exit 1; }
command -v mvn >/dev/null 2>&1 || { echo "Maven is required but not installed. Aborting."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting."; exit 1; }

# Start backend
echo -e "${GREEN}Starting backend services...${NC}"
cd apps/backend
mvn spring-boot:run &
BACKEND_PID=$!

# Start frontend
echo -e "${GREEN}Starting frontend services...${NC}"
cd ../frontend/shell
npm install
npm start &
FRONTEND_PID=$!

# Function to handle cleanup
cleanup() {
    echo -e "${BLUE}Shutting down services...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

echo -e "${GREEN}Development environment is running!${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend: http://localhost:8080"
echo -e "Press Ctrl+C to stop all services"

# Wait for both processes
wait
