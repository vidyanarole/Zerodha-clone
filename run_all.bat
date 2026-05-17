@echo off
echo Starting Backend...
start cmd /k "cd backend && npm start"

echo Starting Dashboard...
start cmd /k "cd dashboard && npm start"

echo Starting Frontend...
start cmd /k "cd frontend && npm start"

echo All servers are starting up in separate windows!
