# 🚀 Quick Start Guide - Ultimate Squeeze Scanner 4.0

## ⚡ 5-Minute Setup

### Step 1: Get Your API Keys
1. **Ortex API Key** (Required - Paid)
   - Sign up at [ortex.com](https://ortex.com)
   - Go to API section
   - Generate API key

2. **Unusual Whales API Key** (Required)
   - Sign up at [unusualwhales.com](https://unusualwhales.com)
   - Access API section
   - Generate API key

3. **Financial Modeling Prep API Key** (Backup - Free tier available)
   - Sign up at [financialmodelingprep.com](https://financialmodelingprep.com)
   - Get free API key

### Step 2: Download and Setup
```bash
# Download the project files to your computer
# Navigate to the project folder
cd enhanced-squeeze-scanner

# Run the setup script (Mac/Linux)
./setup.sh

# Or manually install (Windows/All)
npm install
cp .env.example .env.local
```

### Step 3: Add Your API Keys
Edit `.env.local` file:
```env
ORTEX_API_KEY=your_ortex_api_key_here
UW_API_KEY=your_unusual_whales_api_key_here
FMP_API_KEY=your_fmp_api_key_here
```

### Step 4: Test Locally
```bash
npm run dev
# Open http://localhost:3000
# Click "Start Scan" to test
```

### Step 5: Deploy to Web (Free)

#### 5.1 GitHub
1. Create new repository at [github.com](https://github.com)
2. Name it `ultimate-squeeze-scanner`
3. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ultimate-squeeze-scanner.git
git push -u origin main
```

#### 5.2 Vercel (Free Hosting)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - `ORTEX_API_KEY`
   - `UW_API_KEY` 
   - `FMP_API_KEY`
   - `NODE_ENV` = `production`
6. Click "Deploy"

### Step 6: Use Your Scanner
- Your scanner will be live at: `https://your-app-name.vercel.app`
- Features available:
  - ✅ Real-time squeeze detection
  - ✅ Enhanced Holy Grail scoring
  - ✅ Live short interest data
  - ✅ Cost to borrow analysis
  - ✅ Advanced filtering
  - ✅ Professional interface

## 🎛️ Key Features Overview

### Holy Grail Scoring System
- **90+**: 🔥 LEGENDARY - Immediate attention
- **85-89**: 💪 STRONG - High potential
- **75-84**: 📈 MODERATE - Worth monitoring
- **60-74**: ⚠️ WEAK - Low priority
- **<60**: ❌ AVOID - Poor setup

### Squeeze Types Detected
1. **GAMMA_SHORT_COMBO** - Ultimate setup
2. **CLASSIC_SHORT_SQUEEZE** - Traditional squeeze
3. **BORROWING_CRISIS** - High CTB situation
4. **GAMMA_SQUEEZE** - Options-driven
5. **LOW_FLOAT_SQUEEZE** - Limited supply
6. **POTENTIAL_SETUP** - Developing

### Real-time Alerts
- CTB explosions (>50% increase)
- Extreme utilization (>95%)
- Legendary Holy Grail scores (90+)
- Imminent squeeze timing
- Data discrepancies

## 🔧 Troubleshooting

### Common Issues

**"API Key Invalid"**
- Double-check your API keys
- Ensure no extra spaces
- Verify keys are active

**"CORS Error"**
- Add your domain to environment variables
- Check Vercel deployment settings

**"No Data Loading"**
- Verify API keys are set in production
- Check API usage limits
- Monitor Vercel function logs

**"Real-time Stream Not Working"**
- Check WebSocket support
- Verify function timeout settings
- Monitor connection status

### Getting Help
1. Check the console for error messages
2. Verify API keys are correct
3. Test with a single stock first
4. Check API provider status pages

## 📊 Understanding the Data

### Short Interest Metrics
- **SI%**: Percentage of float sold short
- **Utilization**: Percentage of available shares borrowed
- **CTB**: Cost to borrow (annual percentage)
- **DTC**: Days to cover (SI ÷ daily volume)

### Quality Indicators
- **Green**: High confidence data
- **Yellow**: Medium confidence
- **Red**: Low confidence or discrepancies
- **⚠️**: Data validation issues

### Timing Predictions
- **IMMINENT**: Squeeze likely within days
- **NEAR_TERM**: 1-2 weeks potential
- **SHORT_TERM**: 2-4 weeks potential
- **MEDIUM_TERM**: 1-3 months potential

## 🎯 Best Practices

### For Day Trading
- Focus on IMMINENT timing + LEGENDARY scores
- Monitor CTB explosions closely
- Watch gamma exposure levels
- Use 15-30 second refresh rates

### For Swing Trading
- Look for STRONG scores + NEAR_TERM timing
- Monitor fundamental safety scores
- Track official filing discrepancies
- Use 1-5 minute refresh rates

### For Position Trading
- Focus on fundamental safety + squeeze potential
- Monitor longer-term trends
- Watch for float changes
- Use 5-15 minute refresh rates

## 📈 Advanced Tips

### Custom Watchlists
- Add symbols to your watchlist for focused monitoring
- Real-time updates for watched symbols
- Priority alerts for watchlist stocks

### Filter Combinations
- Combine multiple filters for precision
- Save filter presets for different strategies
- Use price ranges to match your account size

### Alert Management
- Critical alerts for immediate action
- High alerts for within-hour monitoring
- Medium alerts for daily review

---

**🚀 You're now ready to use the most advanced squeeze scanner available!**

**Need help?** Check DEPLOYMENT.md for detailed instructions or create an issue on GitHub.

**Pro tip:** Start with paper trading to familiarize yourself with the signals before using real money.