#!/bin/bash

# Ultimate Squeeze Scanner 4.0 - Setup Script
# This script helps you set up the project for GitHub and Vercel deployment

echo "🚀 Ultimate Squeeze Scanner 4.0 - Setup Script"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "Visit: https://git-scm.com/"
    exit 1
fi

echo "✅ Node.js and Git are installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cp .env.example .env.local
    echo "✅ Created .env.local file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local with your API keys:"
    echo "   - ORTEX_API_KEY=your_ortex_api_key_here"
    echo "   - UW_API_KEY=your_unusual_whales_api_key_here"
    echo "   - FMP_API_KEY=your_fmp_api_key_here"
    echo ""
    
    # Ask if user wants to edit now
    read -p "Would you like to edit .env.local now? (y/n): " edit_env
    if [ "$edit_env" = "y" ] || [ "$edit_env" = "Y" ]; then
        if command -v nano &> /dev/null; then
            nano .env.local
        elif command -v vim &> /dev/null; then
            vim .env.local
        else
            echo "Please edit .env.local manually with your preferred text editor"
        fi
    fi
else
    echo "✅ Environment file already exists"
fi

echo ""

# Initialize Git repository if not already initialized
if [ ! -d .git ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""

# Test the application
echo "🧪 Testing the application..."
echo "Starting development server for 10 seconds..."

# Start the dev server in background
npm run dev &
DEV_PID=$!

# Wait a bit for server to start
sleep 5

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Application is running successfully"
    # Kill the dev server
    kill $DEV_PID 2>/dev/null
    wait $DEV_PID 2>/dev/null
else
    echo "❌ Application failed to start. Please check your API keys in .env.local"
    kill $DEV_PID 2>/dev/null
    wait $DEV_PID 2>/dev/null
    exit 1
fi

echo ""

# GitHub setup instructions
echo "📚 Next Steps for GitHub & Vercel Deployment:"
echo "=============================================="
echo ""
echo "1. CREATE GITHUB REPOSITORY:"
echo "   - Go to https://github.com"
echo "   - Click '+' → 'New repository'"
echo "   - Name: 'ultimate-squeeze-scanner'"
echo "   - Make it Private (recommended)"
echo "   - Don't initialize with README"
echo ""
echo "2. PUSH TO GITHUB:"
echo "   git add ."
echo "   git commit -m \"Initial commit: Ultimate Squeeze Scanner 4.0\""
echo "   git remote add origin https://github.com/YOUR_USERNAME/ultimate-squeeze-scanner.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. DEPLOY TO VERCEL:"
echo "   - Go to https://vercel.com"
echo "   - Login with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your repository"
echo "   - Add environment variables:"
echo "     * ORTEX_API_KEY"
echo "     * UW_API_KEY"
echo "     * FMP_API_KEY"
echo "     * NODE_ENV=production"
echo "   - Click 'Deploy'"
echo ""

# Ask if user wants to start the dev server
echo "🏃 Would you like to start the development server now?"
read -p "Start dev server? (y/n): " start_dev

if [ "$start_dev" = "y" ] || [ "$start_dev" = "Y" ]; then
    echo ""
    echo "🚀 Starting development server..."
    echo "Open http://localhost:3000 in your browser"
    echo "Press Ctrl+C to stop the server"
    echo ""
    npm run dev
fi

echo ""
echo "🎉 Setup complete! Follow the deployment instructions above."
echo "📖 For detailed instructions, see DEPLOYMENT.md"