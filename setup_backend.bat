@echo off
echo Setting up Python Backend Environment...
echo.

cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Backend environment setup complete!
echo.
echo To start the backend server:
echo 1. cd backend
echo 2. venv\Scripts\activate
echo 3. python app.py
echo.
echo Press any key to exit...
pause >nul
