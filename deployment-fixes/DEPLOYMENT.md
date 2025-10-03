# 🚀 Deployment Guide - Ultimate Squeeze Scanner 4.0

## 📋 Prerequisites

Before deploying, make sure you have:
- [ ] Ortex API Key (paid subscription required)
- [ ] Unusual Whales API Key
- [ ] Financial Modeling Prep API Key
- [ ] GitHub account
- [ ] Vercel account (free tier available)

## 🔧 Step 1: Prepare Your Local Environment

### 1.1 Clone or Download the Project
```bash
# If you have the files locally, navigate to the project directory
cd enhanced-squeeze-scanner

# Initialize git repository
git init
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the file with your API keys
nano .env.local  # or use your preferred editor
```

**Required Environment Variables:**
```env
ORTEX_API_KEY=your_ortex_api_key_here
UW_API_KEY=your_unusual_whales_api_key_here
FMP_API_KEY=your_fmp_api_key_here
```

### 1.4 Test Locally
```bash
# Run the development server
npm run dev

# Open http://localhost:3000 to test
```

## 📁 Step 2: Create GitHub Repository

### 2.1 Create New Repository on GitHub
1. Go to [GitHub.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `ultimate-squeeze-scanner`
4. Make it **Private** (recommended due to trading algorithms)
5. Don't initialize with README (we already have files)
6. Click "Create repository"

### 2.2 Push Code to GitHub
```bash
# Add all files to git
git add .

# Make initial commit
git commit -m "Initial commit: Ultimate Squeeze Scanner 4.0"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ultimate-squeeze-scanner.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Import your `ultimate-squeeze-scanner` repository
5. Click "Import"

### 3.2 Configure Deployment Settings

**Framework Preset**: Next.js (should auto-detect)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next` (leave as default)
- Install Command: `npm install`

### 3.3 Add Environment Variables in Vercel
1. In the Vercel deployment settings, go to "Environment Variables"
2. Add each variable:

```
Name: ORTEX_API_KEY
Value: your_ortex_api_key_here
```

```
Name: UW_API_KEY
Value: your_unusual_whales_api_key_here
```

```
Name: FMP_API_KEY
Value: your_fmp_api_key_here
```

```
Name: NODE_ENV
Value: production
```

**Optional Production Variables:**
```
Name: CORS_ORIGIN
Value: https://your-app-name.vercel.app
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. Click "Visit" to see your live scanner

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Update API URLs (if needed)
If you encounter CORS issues, you may need to update the API base URLs in your environment variables:

```env
ORTEX_BASE_URL=https://api.ortex.com/api/v2
UW_BASE_URL=https://api.unusualwhales.com/api
FMP_BASE_URL=https://financialmodelingprep.com/api/v3
```

### 4.2 Test All Features
1. **Basic Scanning**: Click "Start Scan" button
2. **Real-time Streaming**: Verify connection status
3. **Stock Details**: Click on any stock to view detailed analysis
4. **Filters**: Test different filter tabs
5. **Alerts**: Monitor the alerts panel

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. API Key Errors
```
Error: 401 Unauthorized
Solution: Double-check API keys in Vercel environment variables
```

#### 2. CORS Errors
```
Error: CORS policy blocking request
Solution: Add your Vercel domain to CORS_ORIGIN environment variable
```

#### 3. Rate Limiting
```
Error: Too Many Requests
Solution: Reduce SCAN_BATCH_SIZE and increase SCAN_DELAY_MS
```

#### 4. Build Errors
```
Error: Module not found
Solution: Ensure all dependencies are in package.json
```

#### 5. Real-time Streaming Issues
```
Error: WebSocket connection failed
Solution: Check Vercel function timeout settings (max 5 minutes on hobby plan)
```

### Environment Variable Checklist
- [ ] ORTEX_API_KEY set and valid
- [ ] UW_API_KEY set and valid  
- [ ] FMP_API_KEY set and valid
- [ ] NODE_ENV=production
- [ ] CORS_ORIGIN matches your domain

## 🔄 Step 5: Making Updates

### 5.1 Update Code
```bash
# Make your changes locally
# Test locally with npm run dev

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### 5.2 Automatic Deployment
Vercel will automatically redeploy when you push to the main branch.

### 5.3 Manual Redeploy
1. Go to Vercel dashboard
2. Select your project
3. Click "Redeploy" on latest deployment

## 📊 Step 6: Monitoring and Optimization

### 6.1 Monitor Usage
- **Vercel Analytics**: Monitor page views and performance
- **API Usage**: Track API call consumption
- **Error Monitoring**: Check Vercel function logs

### 6.2 Performance Optimization
```env
# Optimize for production
SCAN_BATCH_SIZE=5
SCAN_DELAY_MS=2000
STREAM_INTERVAL=45000
MAX_CONNECTIONS=50
```

### 6.3 Scaling Considerations
- **Hobby Plan**: 100GB bandwidth, 1000GB-hours compute
- **Pro Plan**: Unlimited bandwidth, better performance
- **Monitor API limits**: Each service has different rate limits

## 🔒 Security Best Practices

### 6.1 Environment Variables
- Never commit API keys to GitHub
- Use different keys for development/production
- Rotate keys regularly

### 6.2 Access Control
- Keep repository private
- Limit Vercel team access
- Monitor deployment logs

### 6.3 API Security
- Monitor API usage for unusual patterns
- Set up alerts for high usage
- Keep API keys secure

## 📈 Advanced Configuration

### 6.1 Custom Domain (Optional)
1. Purchase domain
2. In Vercel, go to project settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### 6.2 Analytics Integration
```env
# Add to environment variables
GOOGLE_ANALYTICS_ID=your_ga_id
MIXPANEL_TOKEN=your_mixpanel_token
```

### 6.3 Alert Integrations
```env
# Slack integration for alerts
SLACK_WEBHOOK_URL=your_slack_webhook

# Discord integration
DISCORD_WEBHOOK_URL=your_discord_webhook
```

## 🎯 Final Checklist

Before going live:
- [ ] All API keys working
- [ ] Local testing completed
- [ ] GitHub repository created
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Real-time streaming working
- [ ] All features tested
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Security measures in place

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify API key validity
3. Test API endpoints directly
4. Check GitHub repository settings
5. Review environment variables

**Common URLs:**
- GitHub Repo: `https://github.com/YOUR_USERNAME/ultimate-squeeze-scanner`
- Vercel App: `https://your-app-name.vercel.app`
- Vercel Dashboard: `https://vercel.com/dashboard`

---

🎉 **Congratulations! Your Ultimate Squeeze Scanner 4.0 is now live and ready for professional trading analysis!**