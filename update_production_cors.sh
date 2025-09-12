#!/bin/bash

# Script to update production CORS configuration
# Run this on your production server (13.48.45.245)

echo "🔧 Updating CORS configuration for production..."

# Navigate to backend directory (adjust path as needed)
cd /path/to/your/backend

# Create or update .env file with correct CORS settings
cat > .env << EOF
# Production Environment Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swiftapply_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# CORS Configuration - Include Vercel frontend URL
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,https://swift-apply-ai.vercel.app

# Chrome binary path for Selenium WebDriver
CHROME_BINARY_PATH=/usr/bin/google-chrome
GOOGLE_CHROME_BIN=/usr/bin/google-chrome
EOF

echo "✅ .env file updated with CORS configuration"
echo "🔄 Restarting Flask application..."

# Restart the Flask application
# Adjust the command based on how you're running the app
pkill -f "python.*app.py"
nohup python app.py > app.log 2>&1 &

echo "✅ Flask application restarted"
echo "🌐 CORS should now allow requests from https://swift-apply-ai.vercel.app"
