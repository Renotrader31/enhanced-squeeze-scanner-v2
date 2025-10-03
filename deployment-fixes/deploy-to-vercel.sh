#!/bin/bash

echo "🚀 Preparing Enhanced Squeeze Scanner for Vercel Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project directory."
    exit 1
fi

echo "✅ Verifying project structure..."

# Check for required files
if [ ! -f "next.config.mjs" ]; then
    echo "❌ Error: next.config.mjs not found"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found"
    exit 1
fi

echo "✅ All configuration files present"

# Test build
echo "🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Check the errors above."
    exit 1
fi

echo ""
echo "🎉 Your project is ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Ready for Vercel deployment'"
echo "3. git push origin main"
echo "4. Go to vercel.com and import your repository"
echo ""
echo "Your app will be available at: https://your-project-name.vercel.app"
echo ""
echo "📄 Check VERCEL_DEPLOYMENT.md for detailed instructions"