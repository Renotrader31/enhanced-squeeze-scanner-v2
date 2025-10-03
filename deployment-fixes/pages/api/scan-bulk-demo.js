// Demo version with realistic mock data that mimics real API responses
const generateRealisticMockData = (symbol) => {
  // Generate realistic but random data that mimics API structure
  const basePrice = {
    'AAPL': 175 + Math.random() * 20,
    'TSLA': 220 + Math.random() * 40, 
    'GME': 20 + Math.random() * 30,
    'AMC': 8 + Math.random() * 12,
    'NVDA': 440 + Math.random() * 60,
    'MSFT': 330 + Math.random() * 40
  }[symbol] || 50 + Math.random() * 100;

  const shortInterest = Math.random() * 35;
  const utilization = Math.random() * 100;
  const ctb = Math.random() * 80;
  const confidence = 60 + Math.random() * 40;
  
  const mockData = {
    short_interest: {
      estimated: shortInterest,
      confidence: confidence,
      change_1d: (Math.random() - 0.5) * 5,
      change_7d: (Math.random() - 0.5) * 15,
      change_30d: (Math.random() - 0.5) * 25
    },
    borrow_availability: {
      utilization: utilization,
      available: Math.random() * 2000000,
      change_1d: (Math.random() - 0.5) * 20,
      on_loan: utilization * 10000 + Math.random() * 50000
    },
    cost_to_borrow: {
      current: ctb,
      min: Math.max(0, ctb - Math.random() * 20),
      max: ctb + Math.random() * 30,
      trend: ['EXPLODING', 'RISING', 'STABLE', 'FALLING'][Math.floor(Math.random() * 4)],
      change_1d: (Math.random() - 0.5) * 10
    },
    days_to_cover: {
      ortex: Math.random() * 15,
      exchange: Math.random() * 10,
      trend: ['RISING', 'STABLE', 'FALLING'][Math.floor(Math.random() * 3)]
    },
    float_analysis: {
      free_float: Math.random() * 500000000,
      outstanding: Math.random() * 1000000000,
      float_percentage: 30 + Math.random() * 60
    },
    flow_analysis: {
      sentiment: Math.random() * 100 - 50,
      unusual: {
        multiplier: 1 + Math.random() * 5
      },
      volume: {
        total: Math.random() * 10000000
      }
    },
    fundamental_safety: {
      overall_safety: Math.random() * 100,
      financial_strength: Math.random() * 100,
      profitability: Math.random() * 100
    },
    stock_scores: {
      squeeze_score: Math.random() * 100,
      gamma_score: Math.random() * 100,
      overall_grade: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'][Math.floor(Math.random() * 8)]
    },
    data_quality: {
      ortex_coverage: 70 + Math.random() * 30,
      confidence_level: 80 + Math.random() * 20,
      last_updated: new Date().toISOString()
    }
  };

  // Calculate Holy Grail score using the same algorithm
  const holyGrail = calculateEnhancedHolyGrail(mockData);
  
  // Classify squeeze type
  const squeeze = classifySqueezeType(mockData, holyGrail);
  
  // Generate alerts
  const alerts = generateAlerts(mockData, holyGrail, squeeze);

  return {
    symbol,
    price: parseFloat(basePrice.toFixed(2)),
    holyGrail,
    squeeze,
    alerts,
    
    shortInterest: {
      estimated: parseFloat(mockData.short_interest.estimated.toFixed(1)),
      confidence: parseFloat(mockData.short_interest.confidence.toFixed(1)),
      change_1d: parseFloat(mockData.short_interest.change_1d.toFixed(1)),
      change_7d: parseFloat(mockData.short_interest.change_7d.toFixed(1)),
      change_30d: parseFloat(mockData.short_interest.change_30d.toFixed(1))
    },
    
    availability: {
      utilization: parseFloat(mockData.borrow_availability.utilization.toFixed(1)),
      available: Math.round(mockData.borrow_availability.available),
      change_1d: parseFloat(mockData.borrow_availability.change_1d.toFixed(1)),
      onLoan: Math.round(mockData.borrow_availability.on_loan)
    },
    
    costToBorrow: {
      current: parseFloat(mockData.cost_to_borrow.current.toFixed(1)),
      min: parseFloat(mockData.cost_to_borrow.min.toFixed(1)),
      max: parseFloat(mockData.cost_to_borrow.max.toFixed(1)),
      trend: mockData.cost_to_borrow.trend,
      change_1d: parseFloat(mockData.cost_to_borrow.change_1d.toFixed(1))
    },
    
    daysToCover: {
      ortex: parseFloat(mockData.days_to_cover.ortex.toFixed(1)),
      exchange: parseFloat(mockData.days_to_cover.exchange.toFixed(1)),
      trend: mockData.days_to_cover.trend
    },
    
    floatAnalysis: {
      free_float: Math.round(mockData.float_analysis.free_float),
      outstanding: Math.round(mockData.float_analysis.outstanding),
      float_percentage: parseFloat(mockData.float_analysis.float_percentage.toFixed(1))
    },
    
    flowAnalysis: {
      sentiment: parseFloat(mockData.flow_analysis.sentiment.toFixed(1)),
      unusual: {
        multiplier: parseFloat(mockData.flow_analysis.unusual.multiplier.toFixed(1))
      },
      volume: {
        total: Math.round(mockData.flow_analysis.volume.total)
      }
    },
    
    fundamentalSafety: {
      overall_safety: parseFloat(mockData.fundamental_safety.overall_safety.toFixed(1)),
      financial_strength: parseFloat(mockData.fundamental_safety.financial_strength.toFixed(1)),
      profitability: parseFloat(mockData.fundamental_safety.profitability.toFixed(1))
    },
    
    stockScores: {
      squeeze_score: parseFloat(mockData.stock_scores.squeeze_score.toFixed(1)),
      gamma_score: parseFloat(mockData.stock_scores.gamma_score.toFixed(1)),
      overall_grade: mockData.stock_scores.overall_grade
    },
    
    dataQuality: {
      ortex_coverage: parseFloat(mockData.data_quality.ortex_coverage.toFixed(1)),
      confidence_level: parseFloat(mockData.data_quality.confidence_level.toFixed(1)),
      last_updated: mockData.data_quality.last_updated
    },
    
    flow: parseFloat(mockData.flow_analysis.sentiment.toFixed(1)),
    timestamp: new Date().toISOString()
  };
};

// Use the same calculation functions from the real API
const calculateEnhancedHolyGrail = (data) => {
  let score = 0;
  let factors = 0;

  // 1. Short Interest (20 points)
  if (data.short_interest?.estimated) {
    score += Math.min(data.short_interest.estimated * 0.67, 20);
    factors++;
  }

  // 2. Utilization Rate (15 points) 
  if (data.borrow_availability?.utilization) {
    score += Math.min(data.borrow_availability.utilization * 0.15, 15);
    factors++;
  }

  // 3. Cost to Borrow (15 points)
  if (data.cost_to_borrow?.current) {
    score += Math.min(data.cost_to_borrow.current * 0.3, 15);
    factors++;
  }

  // 4. Days to Cover (10 points)
  if (data.days_to_cover?.ortex) {
    score += Math.min(data.days_to_cover.ortex * 2, 10);
    factors++;
  }

  // 5. CTB Acceleration (10 points)
  if (data.cost_to_borrow?.trend) {
    const trendScores = { 'EXPLODING': 10, 'RISING': 7, 'STABLE': 3, 'FALLING': 0 };
    score += trendScores[data.cost_to_borrow.trend] || 0;
    factors++;
  }

  // 6. Availability Pressure (8 points)
  if (data.borrow_availability?.available) {
    const pressure = Math.max(0, 100 - (data.borrow_availability.available / 10000));
    score += Math.min(pressure * 0.08, 8);
    factors++;
  }

  // 7. SI Confidence (7 points)
  if (data.short_interest?.confidence) {
    score += Math.min(data.short_interest.confidence * 0.07, 7);
    factors++;
  }

  // 8. Free Float Analysis (5 points)
  if (data.float_analysis?.free_float && data.float_analysis?.outstanding) {
    const floatRatio = data.float_analysis.free_float / data.float_analysis.outstanding;
    const floatScore = floatRatio < 0.3 ? 5 : floatRatio < 0.5 ? 3 : 1;
    score += floatScore;
    factors++;
  }

  // 9. Options Flow (5 points)
  if (data.flow_analysis?.sentiment) {
    score += Math.max(0, Math.min(data.flow_analysis.sentiment * 0.05, 5));
    factors++;
  }

  // 10. Unusual Activity (3 points)
  if (data.flow_analysis?.unusual?.multiplier) {
    score += Math.min(data.flow_analysis.unusual.multiplier * 0.5, 3);
    factors++;
  }

  // 11. Fundamental Safety (3 points)
  if (data.fundamental_safety?.overall_safety) {
    score += Math.min(data.fundamental_safety.overall_safety * 0.03, 3);
    factors++;
  }

  // 12. Data Quality (2 points)
  if (data.data_quality?.ortex_coverage) {
    score += Math.min(data.data_quality.ortex_coverage * 0.02, 2);
    factors++;
  }

  // 13. Stock Score (2 points)
  if (data.stock_scores?.squeeze_score) {
    score += Math.min(data.stock_scores.squeeze_score * 0.02, 2);
    factors++;
  }

  return Math.round(Math.min(score, 100));
};

const classifySqueezeType = (data, holyGrail) => {
  const si = data.short_interest?.estimated || 0;
  const util = data.borrow_availability?.utilization || 0;
  const ctb = data.cost_to_borrow?.current || 0;
  const flow = data.flow_analysis?.sentiment || 0;
  const dtc = data.days_to_cover?.ortex || 0;
  const float = data.float_analysis?.free_float || Infinity;

  // GAMMA_SHORT_COMBO - High SI + High Util + High CTB + Positive Flow
  if (si > 20 && util > 90 && ctb > 30 && flow > 0) {
    return {
      classification: 'GAMMA_SHORT_COMBO',
      timing: holyGrail > 85 ? 'IMMINENT' : holyGrail > 75 ? 'BUILDING' : 'EARLY',
      overall_score: holyGrail
    };
  }
  
  // CLASSIC_SHORT_SQUEEZE - Traditional squeeze setup
  else if (si > 15 && util > 85 && dtc > 3) {
    return {
      classification: 'CLASSIC_SHORT_SQUEEZE',
      timing: holyGrail > 80 ? 'IMMINENT' : holyGrail > 70 ? 'BUILDING' : 'EARLY',
      overall_score: holyGrail
    };
  }
  
  // BORROWING_CRISIS - CTB explosion
  else if (ctb > 50 || data.cost_to_borrow?.trend === 'EXPLODING') {
    return {
      classification: 'BORROWING_CRISIS',
      timing: ctb > 100 ? 'IMMINENT' : 'BUILDING',
      overall_score: holyGrail
    };
  }
  
  // GAMMA_SQUEEZE - Options flow driven
  else if (flow > 30 && data.flow_analysis?.unusual?.multiplier > 2) {
    return {
      classification: 'GAMMA_SQUEEZE',
      timing: holyGrail > 75 ? 'BUILDING' : 'EARLY',
      overall_score: holyGrail
    };
  }
  
  // LOW_FLOAT_SQUEEZE - Small float play
  else if (float < 50000000 && si > 10 && util > 70) {
    return {
      classification: 'LOW_FLOAT_SQUEEZE',
      timing: holyGrail > 70 ? 'BUILDING' : 'EARLY',
      overall_score: holyGrail
    };
  }
  
  // POTENTIAL_SETUP - Good fundamentals
  else if (holyGrail > 60) {
    return {
      classification: 'POTENTIAL_SETUP',
      timing: holyGrail > 75 ? 'BUILDING' : 'MONITORING',
      overall_score: holyGrail
    };
  }
  
  // Default
  else {
    return {
      classification: 'MONITORING',
      timing: 'EARLY',
      overall_score: holyGrail
    };
  }
};

const generateAlerts = (data, holyGrail, squeeze) => {
  const alerts = [];
  
  // Critical alerts
  if (data.cost_to_borrow?.trend === 'EXPLODING') {
    alerts.push({
      level: 'CRITICAL',
      type: 'CTB_EXPLOSION',
      message: `Cost to borrow exploding: ${data.cost_to_borrow.current.toFixed(1)}%`,
      value: data.cost_to_borrow.current
    });
  }
  
  if (holyGrail >= 90) {
    alerts.push({
      level: 'CRITICAL', 
      type: 'LEGENDARY_SETUP',
      message: `Legendary Holy Grail score: ${holyGrail}`,
      value: holyGrail
    });
  }
  
  // High priority alerts
  if (data.borrow_availability?.utilization > 95) {
    alerts.push({
      level: 'HIGH',
      type: 'EXTREME_UTILIZATION',
      message: `Extreme utilization: ${data.borrow_availability.utilization.toFixed(1)}%`,
      value: data.borrow_availability.utilization
    });
  }
  
  if (data.short_interest?.estimated > 25) {
    alerts.push({
      level: 'HIGH',
      type: 'HIGH_SHORT_INTEREST',
      message: `High short interest: ${data.short_interest.estimated.toFixed(1)}%`,
      value: data.short_interest.estimated
    });
  }
  
  // Medium priority alerts
  if (squeeze.timing === 'IMMINENT') {
    alerts.push({
      level: 'MEDIUM',
      type: 'SQUEEZE_IMMINENT',
      message: `${squeeze.classification} timing: ${squeeze.timing}`,
      value: squeeze.overall_score
    });
  }
  
  if (data.flow_analysis?.unusual?.multiplier > 3) {
    alerts.push({
      level: 'MEDIUM',
      type: 'UNUSUAL_FLOW',
      message: `Unusual options flow: ${data.flow_analysis.unusual.multiplier.toFixed(1)}x`,
      value: data.flow_analysis.unusual.multiplier
    });
  }
  
  return alerts;
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbols, filters } = req.body;
  
  if (!symbols || !Array.isArray(symbols)) {
    return res.status(400).json({ error: 'Symbols array required' });
  }

  try {
    console.log(`🎭 Starting DEMO bulk scan for ${symbols.length} symbols...`);
    
    // Generate mock data for all symbols
    const results = symbols.map(symbol => {
      const mockData = generateRealisticMockData(symbol);
      console.log(`📊 Generated ${symbol}: $${mockData.price} - HG ${mockData.holyGrail} - ${mockData.squeeze.classification}`);
      return mockData;
    });
    
    // Apply filters if provided
    const filteredResults = applyFilters(results, filters);
    
    // Sort by Holy Grail score (highest first)
    const sortedResults = filteredResults.sort((a, b) => b.holyGrail - a.holyGrail);

    // Generate summary statistics
    const summary = generateSummary(sortedResults);
    
    console.log(`🎭 DEMO scan complete: ${symbols.length} processed, ${sortedResults.length} results`);
    
    const response = {
      success: true,
      summary,
      results: sortedResults,
      timestamp: new Date().toISOString(),
      processed_count: symbols.length,
      filtered_count: filteredResults.length,
      api_status: 'DEMO',
      note: '🎭 Demo data - Replace with real API keys in .env.local for live data'
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Demo scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      api_status: 'DEMO_ERROR'
    });
  }
}

function applyFilters(results, filters) {
  if (!filters) return results;
  
  return results.filter(stock => {
    // Holy Grail filter
    if (filters.minHolyGrail && stock.holyGrail < filters.minHolyGrail) {
      return false;
    }
    
    // Short Interest filter
    if (filters.minShortInterest && 
        (!stock.shortInterest || stock.shortInterest.estimated < filters.minShortInterest)) {
      return false;
    }
    
    // Utilization filter
    if (filters.minUtilization && 
        (!stock.availability || stock.availability.utilization < filters.minUtilization)) {
      return false;
    }
    
    // Days to Cover filter
    if (filters.minDTC && 
        (!stock.daysToCover || stock.daysToCover.ortex < filters.minDTC)) {
      return false;
    }
    
    // Cost to Borrow filter
    if (filters.minCTB && 
        (!stock.costToBorrow || stock.costToBorrow.current < filters.minCTB)) {
      return false;
    }
    
    // Float filter
    if (filters.maxFloat && 
        (!stock.floatAnalysis || stock.floatAnalysis.free_float > filters.maxFloat)) {
      return false;
    }
    
    // Price range filter
    if (filters.minPrice && stock.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && stock.price > filters.maxPrice) {
      return false;
    }
    
    // Squeeze classification filter
    if (filters.squeezeTypes && filters.squeezeTypes.length > 0) {
      if (!stock.squeeze || !filters.squeezeTypes.includes(stock.squeeze.classification)) {
        return false;
      }
    }
    
    return true;
  });
}

function generateSummary(results) {
  const total = results.length;
  
  if (total === 0) {
    return {
      total: 0,
      legendary: 0,
      strong: 0,
      moderate: 0,
      weak: 0,
      avoid: 0,
      averageHolyGrail: 0,
      topSqueezeTypes: [],
      alertCount: 0,
      highValueOpportunities: 0,
      ctbExplosions: 0,
      imminentSqueezes: 0,
      dataQuality: 0
    };
  }
  
  // Holy Grail tier counts
  const legendary = results.filter(r => r.holyGrail >= 90).length;
  const strong = results.filter(r => r.holyGrail >= 85 && r.holyGrail < 90).length;
  const moderate = results.filter(r => r.holyGrail >= 75 && r.holyGrail < 85).length;
  const weak = results.filter(r => r.holyGrail >= 60 && r.holyGrail < 75).length;
  const avoid = results.filter(r => r.holyGrail < 60).length;
  
  const averageHolyGrail = Math.round(
    results.reduce((sum, r) => sum + r.holyGrail, 0) / total
  );
  
  // Top squeeze types
  const squeezeTypes = {};
  results.forEach(r => {
    if (r.squeeze && r.squeeze.classification) {
      squeezeTypes[r.squeeze.classification] = (squeezeTypes[r.squeeze.classification] || 0) + 1;
    }
  });
  
  const topSqueezeTypes = Object.entries(squeezeTypes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));
  
  // Count alerts
  const alertCount = results.reduce((sum, r) => {
    return sum + (r.alerts ? r.alerts.length : 0);
  }, 0);
  
  // High value opportunities
  const highValueOpportunities = results.filter(r => 
    r.holyGrail >= 85 && 
    r.squeeze && 
    ['GAMMA_SHORT_COMBO', 'CLASSIC_SHORT_SQUEEZE', 'BORROWING_CRISIS'].includes(r.squeeze.classification)
  ).length;
  
  // CTB explosions
  const ctbExplosions = results.filter(r => 
    r.costToBorrow && r.costToBorrow.trend === 'EXPLODING'
  ).length;
  
  // Imminent squeezes
  const imminentSqueezes = results.filter(r => 
    r.squeeze && r.squeeze.timing === 'IMMINENT'
  ).length;
  
  // Average data quality
  const dataQuality = Math.round(
    results.reduce((sum, r) => sum + (r.dataQuality?.ortex_coverage || 0), 0) / total
  );
  
  return {
    total,
    legendary,
    strong,
    moderate,
    weak,
    avoid,
    averageHolyGrail,
    topSqueezeTypes,
    alertCount,
    highValueOpportunities, 
    ctbExplosions,
    imminentSqueezes,
    dataQuality
  };
}