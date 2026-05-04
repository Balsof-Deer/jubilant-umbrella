#!/bin/bash

ROOT="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$ROOT/logs"

BACKEND_DIR="$ROOT/backend"
USER_DIR="$ROOT/USER/UserDashboard"
STAFF_DIR="$ROOT/STAFF/StaffDashboard"

echo "Starting backend on port 8080..."
cd "$BACKEND_DIR" && ./mvnw spring-boot:run > "$ROOT/logs/backend.log" 2>&1 &
BACKEND_PID=$!

echo "Starting User Dashboard on port 8082..."
cd "$USER_DIR" && { [ ! -d node_modules ] && echo "Installing dependencies..." && npm install; } ; npm run web > "$ROOT/logs/user.log" 2>&1 &
USER_PID=$!

echo "Starting Staff Dashboard on port 8083..."
cd "$STAFF_DIR" && { [ ! -d node_modules ] && echo "Installing dependencies..." && npm install; } ; npm run web > "$ROOT/logs/staff.log" 2>&1 &
STAFF_PID=$!

echo ""
echo "All services starting:"
echo "  Backend       -> http://localhost:8080"
echo "  User Dashboard  -> http://localhost:8082"
echo "  Staff Dashboard -> http://localhost:8083"
echo ""
echo "Logs are in the logs/ folder. Press Ctrl+C to stop everything."

cleanup() {
  echo ""
  echo "Stopping all services..."
  kill $BACKEND_PID $USER_PID $STAFF_PID 2>/dev/null
  wait $BACKEND_PID $USER_PID $STAFF_PID 2>/dev/null
  echo "Done."
  exit 0
}

trap cleanup SIGINT SIGTERM

wait
