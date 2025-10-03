# 🚀 Professional Squeeze Scanner 4.0 - ULTIMATE EDITION

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/enhanced-squeeze-scanner)

> **Advanced Short Squeeze Detection System with Enhanced Ortex Integration**

![Scanner Preview](https://via.placeholder.com/800x400/0a0e27/60a5fa?text=Professional+Squeeze+Scanner+4.0)

## 🎯 **Key Features**

### 📊 **Enhanced Holy Grail Algorithm (13 Factors)**
- **Short Interest Analysis** - Real-time SI tracking with confidence levels
- **Utilization Monitoring** - Borrow availability and pressure metrics  
- **Cost-to-Borrow Tracking** - CTB rates with trend acceleration detection
- **Days-to-Cover Analysis** - Market depth and liquidity assessment
- **Float Analysis** - Free float vs outstanding shares evaluation
- **Options Flow Integration** - Unusual activity and gamma exposure
- **Fundamental Safety** - Financial strength and profitability scoring
- **Data Quality Metrics** - Coverage confidence and freshness indicators

### 🔥 **6 Advanced Squeeze Classifications**
1. **GAMMA_SHORT_COMBO** - High SI + High Util + High CTB + Positive Flow
2. **CLASSIC_SHORT_SQUEEZE** - Traditional squeeze fundamentals
3. **BORROWING_CRISIS** - Cost-to-borrow explosion scenarios
4. **GAMMA_SQUEEZE** - Options-driven momentum setups
5. **LOW_FLOAT_SQUEEZE** - Small float high-pressure situations
6. **POTENTIAL_SETUP** - Early-stage opportunity identification

### 🎨 **Professional Interface**
- **Dark Theme Design** - Professional trading terminal aesthetics
- **Real-time Dashboard** - Live statistics with color-coded tiers
- **Advanced Filtering** - Multi-parameter screening capabilities
- **Alert System** - Critical, High, and Medium priority notifications
- **Responsive Layout** - Desktop and mobile optimized

## 🚀 **Quick Start**

### **1. Clone & Install**
```bash
git clone https://github.com/yourusername/enhanced-squeeze-scanner.git
cd enhanced-squeeze-scanner
npm install
```

### **2. Environment Setup**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### **3. Start Development**
```bash
npm run dev
# Open http://localhost:3000
```

### **4. Deploy to Vercel** 
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/enhanced-squeeze-scanner)

## 🔑 **API Configuration**

### **Required APIs**
| Provider | Purpose | Free Tier | Get API Key |
|----------|---------|-----------|-------------|
| **Ortex** | Short interest, utilization, CTB data | ❌ Paid | [ortex.com/api](https://ortex.com/api) |
| **Unusual Whales** | Options flow and unusual activity | ❌ Paid | [unusualwhales.com/api](https://unusualwhales.com/api) |
| **Financial Modeling Prep** | Real-time price data | ✅ 250 calls/day | [financialmodelingprep.com](https://financialmodelingprep.com/developer/docs) |

### **Environment Variables**
```env
# Required for live data
ORTEX_API_KEY=your-ortex-api-key
UW_API_KEY=your-unusual-whales-api-key
FMP_API_KEY=your-fmp-api-key

# Optional: Enable demo mode
NEXT_PUBLIC_DEMO_MODE=true
```

## 📈 **Holy Grail Scoring System**

### **Enhanced Algorithm (100 Point Scale)**
```
🏆 LEGENDARY (90-100): Exceptional setups with high squeeze probability
🥇 STRONG (85-89): High-quality opportunities with solid fundamentals  
🥈 MODERATE (75-84): Good potential with reasonable risk/reward
🥉 WEAK (60-74): Limited potential, monitor for improvements
❌ AVOID (<60): Poor setup, high risk or insufficient data
```

### **Scoring Breakdown**
- **Short Interest** (20 pts) - Higher SI = Higher score
- **Utilization Rate** (15 pts) - >95% utilization = Maximum points
- **Cost to Borrow** (15 pts) - Rising CTB = Increased pressure
- **Days to Cover** (10 pts) - Higher DTC = More pressure
- **CTB Acceleration** (10 pts) - Exploding trend = Maximum points
- **Availability Pressure** (8 pts) - Low availability = Higher score
- **SI Confidence** (7 pts) - Data quality weighting
- **Float Analysis** (5 pts) - Lower float = Higher score
- **Options Flow** (5 pts) - Positive sentiment bonus
- **Unusual Activity** (3 pts) - High multipliers = Bonus points
- **Fundamental Safety** (3 pts) - Company stability factor
- **Data Quality** (2 pts) - Coverage confidence weighting
- **Stock Scores** (2 pts) - Ortex proprietary scores

## 🎛️ **Advanced Features**

### **Smart Filtering System**
- **Holy Grail Range** - Filter by score tiers
- **Short Interest** - Minimum SI percentage
- **Utilization** - Borrow availability thresholds
- **Cost to Borrow** - CTB rate filtering
- **Float Size** - Maximum float limits
- **Price Range** - Stock price boundaries
- **Squeeze Types** - Classification filtering
- **Alert Levels** - Priority-based sorting

### **Real-time Streaming**
- **Live Updates** - Automatic data refresh
- **Alert Notifications** - Instant critical alerts
- **Performance Tracking** - Historical score changes
- **Batch Processing** - Efficient API usage

### **Professional Analytics**
- **Trend Detection** - CTB acceleration monitoring
- **Volatility Analysis** - Price movement correlation
- **Flow Integration** - Options activity synthesis
- **Risk Assessment** - Multi-factor safety scoring

## 🛠️ **Customization**

### **Add More Stocks**
Edit `components/EnhancedSqueezeScanner.js`:
```javascript
const DEFAULT_SYMBOLS = [
  'AAPL', 'TSLA', 'GME', 'AMC', 'BBBY', 'NVDA', 'MSFT',
  // Add your symbols here
  'SPCE', 'PLTR', 'NIO', 'BABA', 'COIN', 'HOOD', 'RIVN'
];
```

### **Adjust Algorithm Weights**
Modify scoring in `pages/api/scan-bulk-smart.js`:
```javascript
// Increase short interest importance
score += Math.min(data.short_interest.estimated * 1.0, 25); // Was 0.67, 20

// Add custom factors
score += customRiskFactor * 5;
```

### **Custom Squeeze Classifications**
Add new types in `classifySqueezeType()` function:
```javascript
// Custom momentum squeeze
else if (momentum > threshold && volume > baseline) {
  return {
    classification: 'MOMENTUM_SQUEEZE',
    timing: 'BUILDING',
    overall_score: holyGrail
  };
}
```

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. **Fork this repository**
2. **Connect to Vercel** - Import your forked repo
3. **Add Environment Variables** - Set API keys in Vercel dashboard
4. **Deploy** - Automatic deployment on every push

### **Manual Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start

# Or export static files
npm run export
```

## 📊 **Performance**

- **API Response Time** - <2s average for bulk scans
- **Real-time Updates** - 30s refresh intervals
- **Concurrent Users** - Scales with Vercel serverless
- **Data Freshness** - Live market data integration

## 🔧 **Development**

### **Tech Stack**
- **Framework**: Next.js 14
- **Styling**: TailwindCSS with custom components
- **APIs**: RESTful integration with error handling
- **Deployment**: Vercel serverless functions
- **State Management**: React hooks with real-time updates

### **Project Structure**
```
enhanced-squeeze-scanner/
├── components/
│   └── EnhancedSqueezeScanner.js    # Main scanner component
├── pages/
│   ├── api/
│   │   ├── scan-bulk-smart.js       # Smart API with live/demo modes
│   │   └── scan-single.js           # Individual stock analysis
│   └── index.js                     # Main page
├── styles/
│   └── globals.css                  # Professional dark theme
├── .env.example                     # Environment template
└── vercel.json                      # Deployment configuration
```

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ **Disclaimer**

This tool is for educational and informational purposes only. Not financial advice. Always conduct your own research and consult with qualified financial advisors before making investment decisions.

---

**Built with ❤️ for the trading community**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/enhanced-squeeze-scanner)