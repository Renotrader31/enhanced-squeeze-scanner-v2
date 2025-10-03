export default async function handler(req, res) {
  // Handle both GET and POST requests
  const symbol = req.method === 'POST' ? req.body.symbol : req.query.symbol;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol required' });
  }
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const data = await generateDemoData(symbol);
    res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error scanning ${symbol}:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      symbol
    });
  }
}

async function generateDemoData(symbol) {
  // Simulate realistic data based on symbol
  const basePrice = getBasePrice(symbol);
  const volatility = getVolatility(symbol);
  
  // Generate realistic short interest based on symbol
  const shortInterest = getShortInterest(symbol);
  const utilization = Math.min(95, shortInterest * 2.5 + Math.random() * 20);
  const ctb = Math.max(0.5, shortInterest * 1.5 + Math.random() * 30);
  
  // Calculate Holy Grail score
  const holyGrail = calculateHolyGrail(shortInterest, utilization, ctb, symbol);
  
  // Generate other metrics
  const flowSentiment = Math.random() * 100 - 50;
  const daysToCover = Math.max(0.1, shortInterest / 10 + Math.random() * 5);
  
  // Determine squeeze classification
  const squeeze = classifySqueezeType(shortInterest, utilization, ctb, holyGrail);
  
  // Generate alerts if conditions are met
  const alerts = generateAlerts(symbol, holyGrail, shortInterest, utilization, ctb);
  
  return {
    symbol,
    price: basePrice + (Math.random() - 0.5) * basePrice * 0.1,
    change: (Math.random() - 0.5) * 10,
    holyGrail: Math.round(holyGrail),
    squeeze,
    
    // Short Interest Data
    shortInterest: {
      estimated: Math.round(shortInterest * 100) / 100,
      confidence: Math.random() * 40 + 60,
      change_1d: (Math.random() - 0.5) * 5,
      discrepancy: Math.random() * 8
    },
    
    // Availability/Utilization
    availability: {
      utilization: Math.round(utilization * 100) / 100,
      available: Math.floor(Math.random() * 2000000),
      change_1d: (Math.random() - 0.5) * 20
    },
    
    // Cost to Borrow
    costToBorrow: {
      current: Math.round(ctb * 100) / 100,
      min: Math.round((ctb * 0.3) * 100) / 100,
      max: Math.round((ctb * 2.5) * 100) / 100,
      trend: getCTBTrend(ctb)
    },
    
    // Days to Cover
    daysToCover: {
      ortex: Math.round(daysToCover * 10) / 10,
      confidence: 'high'
    },
    
    // Float Analysis
    floatAnalysis: {
      free_float: Math.floor(Math.random() * 500000000),
      shares_outstanding: Math.floor(Math.random() * 1000000000),
      float_ratio: Math.random() * 0.8 + 0.2
    },
    
    // Options Flow
    flow: Math.round(flowSentiment),
    flowAnalysis: {
      call_volume: Math.floor(Math.random() * 100000),
      put_volume: Math.floor(Math.random() * 100000),
      sentiment: flowSentiment > 0 ? 'BULLISH' : 'BEARISH',
      unusual: {
        detected: Math.random() > 0.7,
        multiplier: Math.random() * 5 + 1
      }
    },
    
    // Fundamental Safety
    fundamentalSafety: {
      financial_health: Math.round(Math.random() * 40 + 30),
      valuation_risk: Math.round(Math.random() * 60 + 20),
      bankruptcy_risk: Math.round(Math.random() * 30),
      overall_safety: Math.round(Math.random() * 60 + 20)
    },
    
    // Data Quality
    dataQuality: {
      ortex_coverage: Math.round(Math.random() * 30 + 70),
      confidence_level: 'HIGH',
      last_updated: new Date().toISOString()
    },
    
    // Alerts
    alerts: alerts,
    
    // Metadata
    lastUpdate: new Date().toISOString(),
    source: 'DEMO_MODE'
  };
}

function getBasePrice(symbol) {
  const prices = {
    'AAPL': 255.65,
    'TSLA': 434.21,
    'GME': 67.89,
    'AMC': 23.45,
    'BBBY': 12.34,
    'NVDA': 512.78,
    'MSFT': 345.67,
    'GOOGL': 234.56,
    'AMZN': 187.43,
    'META': 298.76
  };
  return prices[symbol] || (Math.random() * 300 + 50);
}

function getVolatility(symbol) {
  const highVolSymbols = ['GME', 'AMC', 'BBBY', 'SPCE'];
  return highVolSymbols.includes(symbol) ? 0.4 : 0.2;
}

function getShortInterest(symbol) {
  const highShortSymbols = {
    'GME': 15 + Math.random() * 20,
    'AMC': 10 + Math.random() * 15,
    'BBBY': 20 + Math.random() * 25,
    'TSLA': 8 + Math.random() * 12,
    'NVDA': 3 + Math.random() * 7
  };
  return highShortSymbols[symbol] || (Math.random() * 12 + 2);
}

function calculateHolyGrail(shortInterest, utilization, ctb, symbol) {
  let score = 0;
  
  // Short Interest (25 points)
  score += Math.min(shortInterest * 1.2, 25);
  
  // Utilization (20 points) 
  score += Math.min(utilization * 0.2, 20);
  
  // Cost to Borrow (20 points)
  score += Math.min(ctb * 0.4, 20);
  
  // Symbol-specific bonus
  const bonusSymbols = ['GME', 'AMC', 'BBBY'];
  if (bonusSymbols.includes(symbol)) {
    score += 15;
  }
  
  // Add some randomization for other factors
  score += Math.random() * 20;
  
  return Math.min(100, Math.max(0, score));
}

function classifySqueezeType(shortInterest, utilization, ctb, holyGrail) {
  if (shortInterest > 20 && utilization > 90 && ctb > 30) {
    return {
      classification: 'GAMMA_SHORT_COMBO',
      timing: holyGrail > 85 ? 'IMMINENT' : 'BUILDING',
      overall_score: holyGrail
    };
  } else if (shortInterest > 15 && utilization > 85) {
    return {
      classification: 'CLASSIC_SHORT_SQUEEZE',
      timing: holyGrail > 80 ? 'IMMINENT' : 'BUILDING', 
      overall_score: holyGrail
    };
  } else if (ctb > 50) {
    return {
      classification: 'BORROWING_CRISIS',
      timing: 'BUILDING',
      overall_score: holyGrail
    };
  } else if (Math.random() > 0.7) {
    return {
      classification: 'GAMMA_SQUEEZE',
      timing: 'BUILDING',
      overall_score: holyGrail
    };
  } else if (holyGrail > 70) {
    return {
      classification: 'POTENTIAL_SETUP',
      timing: 'EARLY',
      overall_score: holyGrail
    };
  } else {
    return {
      classification: 'LOW_FLOAT_SQUEEZE',
      timing: 'MONITORING',
      overall_score: holyGrail
    };
  }
}

function getCTBTrend(ctb) {
  if (ctb > 50) return 'EXPLODING';
  if (ctb > 25) return 'RISING';
  if (ctb > 10) return 'STABLE';
  return 'FALLING';
}

function generateAlerts(symbol, holyGrail, shortInterest, utilization, ctb) {
  const alerts = [];
  
  if (holyGrail > 90) {
    alerts.push({
      type: 'LEGENDARY_SCORE',
      message: `🔥 LEGENDARY Holy Grail Score: ${Math.round(holyGrail)}`,
      priority: 'CRITICAL',
      timestamp: new Date().toISOString()
    });
  }
  
  if (ctb > 50) {
    alerts.push({
      type: 'CTB_EXPLOSION',
      message: `💥 Cost to Borrow EXPLODING: ${ctb.toFixed(1)}%`,
      priority: 'CRITICAL',
      timestamp: new Date().toISOString()
    });
  }
  
  if (utilization > 95) {
    alerts.push({
      type: 'EXTREME_UTILIZATION',
      message: `⚡ Extreme Utilization: ${utilization.toFixed(1)}%`,
      priority: 'HIGH',
      timestamp: new Date().toISOString()
    });
  }
  
  if (shortInterest > 25) {
    alerts.push({
      type: 'HIGH_SHORT_INTEREST',
      message: `🎯 High Short Interest: ${shortInterest.toFixed(1)}%`,
      priority: 'HIGH',
      timestamp: new Date().toISOString()
    });
  }
  
  return alerts;
}