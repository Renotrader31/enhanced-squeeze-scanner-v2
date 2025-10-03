// Smart Bulk Scanner - Uses real APIs when available, falls back to realistic demo data
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
      message: `Cost to borrow exploding: ${data.cost_to_borrow.current}%`,
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
      message: `Extreme utilization: ${data.borrow_availability.utilization}%`,
      value: data.borrow_availability.utilization
    });
  }
  
  if (data.short_interest?.estimated > 25) {
    alerts.push({
      level: 'HIGH',
      type: 'HIGH_SHORT_INTEREST',
      message: `High short interest: ${data.short_interest.estimated}%`,
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
      message: `Unusual options flow: ${data.flow_analysis.unusual.multiplier}x`,
      value: data.flow_analysis.unusual.multiplier
    });
  }
  
  return alerts;
};

// Generate realistic demo data that changes over time
const generateRealisticDemoData = (symbol) => {
  const now = Date.now();
  const seed = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + Math.floor(now / 60000); // Changes every minute
  const random = (min, max) => min + (seed * 9301 + 49297) % 233280 / 233280 * (max - min);
  const randomInt = (min, max) => Math.floor(random(min, max + 1));
  
  // Base prices for known stocks
  const basePrices = {
    'AAPL': 195, 'TSLA': 245, 'GME': 18, 'AMC': 4.5, 'BBBY': 0.3,
    'NVDA': 485, 'MSFT': 375, 'GOOGL': 165, 'AMZN': 145, 'META': 485,
    'SPCE': 2.1, 'PLTR': 24, 'NIO': 8.5, 'BABA': 95, 'NFLX': 485
  };
  
  const basePrice = basePrices[symbol] || random(5, 100);
  const priceVariation = random(-0.05, 0.05);
  const currentPrice = basePrice * (1 + priceVariation);
  
  // Generate realistic metrics with some correlation
  const shortInterest = random(5, 35);
  const utilization = Math.min(99.8, random(60, 98));
  const costToBorrow = Math.min(300, random(5, shortInterest * 3));
  const daysToCover = Math.min(15, random(0.5, shortInterest / 3));
  const freeFloat = randomInt(20000000, 500000000);
  const outstanding = freeFloat * random(1.2, 3.0);
  
  const trends = ['EXPLODING', 'RISING', 'STABLE', 'FALLING'];
  const ctbTrend = costToBorrow > 50 ? 'EXPLODING' : 
                   costToBorrow > 20 ? 'RISING' : 
                   costToBorrow > 10 ? 'STABLE' : 'FALLING';
  
  return {
    short_interest: {
      estimated: parseFloat(shortInterest.toFixed(2)),
      confidence: randomInt(75, 98),
      change_1d: parseFloat(random(-2, 3).toFixed(2)),
      change_7d: parseFloat(random(-5, 8).toFixed(2)),
      change_30d: parseFloat(random(-10, 15).toFixed(2))
    },
    borrow_availability: {
      utilization: parseFloat(utilization.toFixed(1)),
      available: randomInt(1000, 50000),
      change_1d: parseFloat(random(-5, 5).toFixed(2)),
      on_loan: randomInt(100000, 5000000)
    },
    cost_to_borrow: {
      current: parseFloat(costToBorrow.toFixed(2)),
      min: parseFloat((costToBorrow * 0.3).toFixed(2)),
      max: parseFloat((costToBorrow * 1.8).toFixed(2)),
      trend: ctbTrend,
      change_1d: parseFloat(random(-10, 15).toFixed(2))
    },
    days_to_cover: {
      ortex: parseFloat(daysToCover.toFixed(2)),
      exchange: parseFloat((daysToCover * 0.8).toFixed(2)),
      trend: daysToCover > 5 ? 'RISING' : 'STABLE'
    },
    float_analysis: {
      free_float: freeFloat,
      outstanding: Math.round(outstanding),
      float_percentage: parseFloat((freeFloat / outstanding * 100).toFixed(1))
    },
    stock_scores: {
      squeeze_score: randomInt(0, 100),
      gamma_score: randomInt(0, 100),
      overall_grade: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'][randomInt(0, 7)]
    },
    official_filings: {
      last_13f: new Date(now - randomInt(1, 90) * 24 * 60 * 60 * 1000).toISOString(),
      recent_changes: randomInt(0, 5)
    },
    fundamental_safety: {
      overall_safety: randomInt(20, 95),
      financial_strength: randomInt(30, 90),
      profitability: randomInt(10, 85)
    },
    data_quality: {
      ortex_coverage: randomInt(80, 99),
      confidence_level: randomInt(75, 95),
      last_updated: new Date(now - randomInt(1, 30) * 60 * 1000).toISOString()
    },
    flow_analysis: {
      sentiment: parseFloat(random(-50, 80).toFixed(1)),
      unusual: {
        multiplier: parseFloat(random(0.5, 8).toFixed(1)),
        volume_ratio: parseFloat(random(0.8, 4).toFixed(2))
      },
      volume: {
        call_put_ratio: parseFloat(random(0.3, 3.5).toFixed(2)),
        total_premium: randomInt(1000000, 50000000)
      }
    },
    price: parseFloat(currentPrice.toFixed(2))
  };
};

const scanSingleStock = async (symbol) => {
  const API_KEY = process.env.ORTEX_API_KEY;
  const UW_API = process.env.UW_API_KEY;
  const FMP_API = process.env.FMP_API_KEY;
  const isDemoMode = !API_KEY || API_KEY.includes('demo') || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    // Demo mode - return realistic generated data
    console.log(`📊 Demo mode: Generating realistic data for ${symbol}`);
    
    const demoData = generateRealisticDemoData(symbol);
    const holyGrail = calculateEnhancedHolyGrail(demoData);
    const squeeze = classifySqueezeType(demoData, holyGrail);
    const alerts = generateAlerts(demoData, holyGrail, squeeze);

    return {
      symbol,
      price: demoData.price,
      holyGrail,
      squeeze,
      alerts,
      
      shortInterest: {
        estimated: demoData.short_interest.estimated,
        confidence: demoData.short_interest.confidence,
        change_1d: demoData.short_interest.change_1d,
        change_7d: demoData.short_interest.change_7d,
        change_30d: demoData.short_interest.change_30d
      },
      
      availability: {
        utilization: demoData.borrow_availability.utilization,
        available: demoData.borrow_availability.available,
        change_1d: demoData.borrow_availability.change_1d,
        onLoan: demoData.borrow_availability.on_loan
      },
      
      costToBorrow: {
        current: demoData.cost_to_borrow.current,
        min: demoData.cost_to_borrow.min,
        max: demoData.cost_to_borrow.max,
        trend: demoData.cost_to_borrow.trend,
        change_1d: demoData.cost_to_borrow.change_1d
      },
      
      daysToCover: {
        ortex: demoData.days_to_cover.ortex,
        exchange: demoData.days_to_cover.exchange,
        trend: demoData.days_to_cover.trend
      },
      
      floatAnalysis: {
        free_float: demoData.float_analysis.free_float,
        outstanding: demoData.float_analysis.outstanding,
        float_percentage: demoData.float_analysis.float_percentage
      },
      
      flowAnalysis: {
        sentiment: demoData.flow_analysis.sentiment,
        unusual: demoData.flow_analysis.unusual,
        volume: demoData.flow_analysis.volume
      },
      
      fundamentalSafety: {
        overall_safety: demoData.fundamental_safety.overall_safety,
        financial_strength: demoData.fundamental_safety.financial_strength,
        profitability: demoData.fundamental_safety.profitability
      },
      
      stockScores: {
        squeeze_score: demoData.stock_scores.squeeze_score,
        gamma_score: demoData.stock_scores.gamma_score,
        overall_grade: demoData.stock_scores.overall_grade
      },
      
      dataQuality: {
        ortex_coverage: demoData.data_quality.ortex_coverage,
        confidence_level: demoData.data_quality.confidence_level,
        last_updated: demoData.data_quality.last_updated
      },
      
      flow: demoData.flow_analysis.sentiment,
      timestamp: new Date().toISOString(),
      _mode: 'DEMO'
    };
  }

  // Real API mode (same as scan-bulk.js)
  try {
    // Enhanced API calls with all Ortex endpoints
    const promises = [
      // Core Ortex data
      fetch(`https://api.ortex.com/v1/short-interest/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      fetch(`https://api.ortex.com/v1/availability/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      fetch(`https://api.ortex.com/v1/cost-to-borrow/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      fetch(`https://api.ortex.com/v1/days-to-cover/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      
      // Extended Ortex data
      fetch(`https://api.ortex.com/v1/float-analysis/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      fetch(`https://api.ortex.com/v1/stock-scores/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      fetch(`https://api.ortex.com/v1/official-filings/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      fetch(`https://api.ortex.com/v1/fundamental-safety/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      fetch(`https://api.ortex.com/v1/data-quality/${symbol}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }),
      
      // Unusual Whales
      fetch(`https://api.unusualwhales.com/api/stock/${symbol}/flow`, {
        headers: { 'Authorization': `Bearer ${UW_API}` }
      }),
      
      // Price data
      fetch(`https://financialmodelingprep.com/api/v3/quote-short/${symbol}?apikey=${FMP_API}`)
    ];

    const responses = await Promise.all(promises);
    const [
      siResp, availResp, ctbResp, dtcResp, floatResp, 
      scoresResp, filingsResp, safetyResp, qualityResp,
      uwResp, priceResp
    ] = responses;

    // Parse responses with fallbacks
    const parseResponse = async (response) => {
      try {
        return response.ok ? await response.json() : null;
      } catch (error) {
        console.warn(`Parse error for ${symbol}:`, error);
        return null;
      }
    };

    const [
      shortInterest,
      availability, 
      costToBorrow,
      daysToCover,
      floatAnalysis,
      stockScores,
      officialFilings,
      fundamentalSafety,
      dataQuality,
      uwFlow,
      priceData
    ] = await Promise.all(responses.map(parseResponse));

    // Aggregate all data
    const aggregatedData = {
      short_interest: shortInterest,
      borrow_availability: availability,
      cost_to_borrow: costToBorrow,
      days_to_cover: daysToCover,
      float_analysis: floatAnalysis,
      stock_scores: stockScores,
      official_filings: officialFilings,
      fundamental_safety: fundamentalSafety,
      data_quality: dataQuality,
      flow_analysis: uwFlow
    };

    // Calculate enhanced Holy Grail score
    const holyGrail = calculateEnhancedHolyGrail(aggregatedData);
    
    // Classify squeeze type
    const squeeze = classifySqueezeType(aggregatedData, holyGrail);
    
    // Generate alerts
    const alerts = generateAlerts(aggregatedData, holyGrail, squeeze);

    // Return comprehensive result
    return {
      symbol,
      price: priceData?.[0]?.price || 0,
      holyGrail,
      squeeze,
      alerts,
      
      // Raw data sections
      shortInterest: shortInterest ? {
        estimated: shortInterest.estimated_si || 0,
        confidence: shortInterest.confidence || 0,
        change_1d: shortInterest.change_1d || 0,
        change_7d: shortInterest.change_7d || 0,
        change_30d: shortInterest.change_30d || 0
      } : null,
      
      availability: availability ? {
        utilization: availability.utilization || 0,
        available: availability.available || 0,
        change_1d: availability.change_1d || 0,
        onLoan: availability.on_loan || 0
      } : null,
      
      costToBorrow: costToBorrow ? {
        current: costToBorrow.current || 0,
        min: costToBorrow.min || 0,
        max: costToBorrow.max || 0,
        trend: costToBorrow.trend || 'STABLE',
        change_1d: costToBorrow.change_1d || 0
      } : null,
      
      daysToCover: daysToCover ? {
        ortex: daysToCover.ortex || 0,
        exchange: daysToCover.exchange || 0,
        trend: daysToCover.trend || 'STABLE'
      } : null,
      
      floatAnalysis: floatAnalysis ? {
        free_float: floatAnalysis.free_float || 0,
        outstanding: floatAnalysis.outstanding || 0,
        float_percentage: floatAnalysis.float_percentage || 0
      } : null,
      
      flowAnalysis: uwFlow ? {
        sentiment: uwFlow.sentiment || 0,
        unusual: uwFlow.unusual || {},
        volume: uwFlow.volume || {}
      } : null,
      
      fundamentalSafety: fundamentalSafety ? {
        overall_safety: fundamentalSafety.overall_safety || 0,
        financial_strength: fundamentalSafety.financial_strength || 0,
        profitability: fundamentalSafety.profitability || 0
      } : null,
      
      stockScores: stockScores ? {
        squeeze_score: stockScores.squeeze_score || 0,
        gamma_score: stockScores.gamma_score || 0,
        overall_grade: stockScores.overall_grade || 'N/A'
      } : null,
      
      dataQuality: dataQuality ? {
        ortex_coverage: dataQuality.ortex_coverage || 0,
        confidence_level: dataQuality.confidence_level || 0,
        last_updated: dataQuality.last_updated
      } : null,
      
      flow: uwFlow?.sentiment || 0,
      timestamp: new Date().toISOString(),
      _mode: 'LIVE'
    };

  } catch (error) {
    console.error(`Error scanning ${symbol}:`, error);
    
    // Return error result
    return {
      symbol,
      error: error.message,
      price: 0,
      holyGrail: 0,
      squeeze: { classification: 'ERROR', timing: 'N/A', overall_score: 0 },
      alerts: [{
        level: 'HIGH',
        type: 'API_ERROR',
        message: `API error: ${error.message}`,
        value: 0
      }],
      timestamp: new Date().toISOString(),
      _mode: 'ERROR'
    };
  }
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

  const isDemoMode = !process.env.ORTEX_API_KEY || 
                     process.env.ORTEX_API_KEY.includes('demo') || 
                     process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  try {
    console.log(`🚀 Starting smart bulk scan for ${symbols.length} symbols (${isDemoMode ? 'DEMO' : 'LIVE'} mode)...`);
    
    // Process symbols in smaller batches to respect API rate limits
    const batchSize = isDemoMode ? 10 : 5; // Demo can handle more concurrent requests
    const batches = [];
    
    for (let i = 0; i < symbols.length; i += batchSize) {
      batches.push(symbols.slice(i, i + batchSize));
    }
    
    let allResults = [];
    let processedCount = 0;
    
    for (const [batchIndex, batch] of batches.entries()) {
      console.log(`Processing batch ${batchIndex + 1}/${batches.length}: ${batch.join(', ')}`);
      
      const batchPromises = batch.map(async (symbol) => {
        try {
          const result = await scanSingleStock(symbol);
          processedCount++;
          
          console.log(`✓ Scanned ${symbol}: Holy Grail ${result.holyGrail}, Price $${result.price} (${result._mode || 'UNKNOWN'})`);
          
          return result;
        } catch (error) {
          console.error(`✗ Error scanning ${symbol}:`, error.message);
          processedCount++;
          
          return {
            symbol,
            error: error.message,
            price: 0,
            holyGrail: 0,
            squeeze: { classification: 'ERROR', timing: 'N/A', overall_score: 0 },
            alerts: [],
            timestamp: new Date().toISOString(),
            _mode: 'ERROR'
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      allResults = allResults.concat(batchResults);
      
      // Rate limiting delay between batches (less for demo mode)
      if (batchIndex < batches.length - 1) {
        const delay = isDemoMode ? 500 : 2000;
        console.log(`Waiting ${delay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Apply filters if provided
    const filteredResults = applyFilters(allResults, filters);
    
    // Sort by Holy Grail score (highest first)
    const sortedResults = filteredResults
      .filter(stock => !stock.error) // Remove error entries for sorting
      .sort((a, b) => b.holyGrail - a.holyGrail);

    // Generate summary statistics
    const summary = generateSummary(sortedResults);
    
    console.log(`✅ Smart bulk scan complete: ${processedCount} processed, ${sortedResults.length} valid results (${isDemoMode ? 'DEMO' : 'LIVE'} mode)`);
    
    const response = {
      success: true,
      summary,
      results: sortedResults,
      timestamp: new Date().toISOString(),
      processed_count: processedCount,
      filtered_count: filteredResults.length,
      api_status: isDemoMode ? 'DEMO' : 'LIVE',
      mode: isDemoMode ? 'DEMO_MODE' : 'LIVE_API'
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Smart bulk scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      api_status: 'ERROR',
      mode: isDemoMode ? 'DEMO_MODE' : 'LIVE_API'
    });
  }
}

function applyFilters(results, filters) {
  if (!filters) return results;
  
  return results.filter(stock => {
    // Skip error entries in filtering
    if (stock.error) return false;
    
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
    
    // Float filter (max float)
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
    
    // Fundamental safety filter
    if (filters.minSafety && 
        (!stock.fundamentalSafety || stock.fundamentalSafety.overall_safety < filters.minSafety)) {
      return false;
    }
    
    // Options flow filter
    if (filters.minFlowSentiment && stock.flow < filters.minFlowSentiment) {
      return false;
    }
    
    // Unusual activity filter
    if (filters.minUnusual && 
        (!stock.flowAnalysis || 
         !stock.flowAnalysis.unusual || 
         stock.flowAnalysis.unusual.multiplier < filters.minUnusual)) {
      return false;
    }
    
    // CTB trend filter
    if (filters.ctbTrends && filters.ctbTrends.length > 0) {
      if (!stock.costToBorrow || !filters.ctbTrends.includes(stock.costToBorrow.trend)) {
        return false;
      }
    }
    
    // Data quality filter
    if (filters.minDataQuality && 
        (!stock.dataQuality || stock.dataQuality.ortex_coverage < filters.minDataQuality)) {
      return false;
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
