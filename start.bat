@echo off
echo Starting Job Apply MVP...
echo.

echo Starting Backend (Flask)...
cd backend
start "Flask Backend" cmd /k "python app.py"
cd ..

echo.
echo Starting Frontend (Next.js)...
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: https://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
