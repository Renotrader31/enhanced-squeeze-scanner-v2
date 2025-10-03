export default async function handler(req, res) {
  const { symbol } = req.query;
  
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
    const data = await scanSingleStock(symbol);
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

async function scanSingleStock(symbol) {
  try {
    // Fetch all data in parallel - ENHANCED with all Ortex endpoints
    const [
      optionsFlow,
      marketData,
      greeksData,
      darkPoolData,
      
      // ENHANCED: All Ortex Short Interest endpoints
      ortexShortEstimates,
      ortexShortAvailability,
      ortexDaysToCover,
      ortexOfficialPositions,
      ortexOfficialChanges,
      ortexOfficialStats,
      ortexCTBNew,
      ortexCTBAll,
      
      // ENHANCED: Ortex fundamental data
      ortexFreeFloat,
      ortexSharesOutstanding,
      ortexStockScores,
      ortexFinancialRatios,
      ortexValuationMetrics,
      
      // Backup price data
      fmpData
    ] = await Promise.all([
      fetchUWOptionsFlow(symbol),
      fetchUWMarketData(symbol),
      fetchUWGreeks(symbol),
      fetchUWDarkPool(symbol),
      
      // ENHANCED: All Ortex API calls
      fetchOrtexShortEstimates(symbol),
      fetchOrtexShortAvailability(symbol),
      fetchOrtexDaysToCover(symbol),
      fetchOrtexOfficialPositions(symbol),
      fetchOrtexOfficialChanges(symbol),
      fetchOrtexOfficialStats(symbol),
      fetchOrtexCTBNew(symbol),
      fetchOrtexCTBAll(symbol),
      fetchOrtexFreeFloat(symbol),
      fetchOrtexSharesOutstanding(symbol),
      fetchOrtexStockScores(symbol),
      fetchOrtexFinancialRatios(symbol),
      fetchOrtexValuationMetrics(symbol),
      fetchFMPQuote(symbol)
    ]);

    // Process the data
    const price = marketData?.price || fmpData?.[0]?.price || 0;
    const change = marketData?.change_percent || fmpData?.[0]?.changesPercentage || 0;
    
    // Calculate enhanced metrics with new Ortex data
    const totalCallVolume = optionsFlow?.call_volume || 0;
    const totalPutVolume = optionsFlow?.put_volume || 0;
    const totalVolume = totalCallVolume + totalPutVolume;
    const flowSentiment = totalVolume > 0 ? Math.round((totalCallVolume / totalVolume) * 100) : 50;
    
    // ENHANCED: Multi-source short interest validation
    const shortInterestData = {
      estimated: ortexShortEstimates?.si_percent || 0,
      official: ortexOfficialPositions?.si_percent || 0,
      discrepancy: Math.abs((ortexShortEstimates?.si_percent || 0) - (ortexOfficialPositions?.si_percent || 0)),
      confidence: calculateSIConfidence(ortexShortEstimates, ortexOfficialPositions)
    };
    
    // ENHANCED: Real-time Cost to Borrow analysis
    const ctbData = {
      current: ortexCTBNew?.current_ctb || 0,
      min: ortexCTBNew?.min_ctb || 0,
      max: ortexCTBNew?.max_ctb || 0,
      average: ortexCTBNew?.avg_ctb || 0,
      historical: ortexCTBAll?.historical_avg || 0,
      trend: calculateCTBTrend(ortexCTBNew, ortexCTBAll),
      acceleration: ortexCTBNew?.current_ctb && ortexCTBAll?.historical_avg ? 
        (ortexCTBNew.current_ctb / ortexCTBAll.historical_avg) : 1
    };
    
    // ENHANCED: Float-adjusted calculations
    const freeFloat = ortexFreeFloat?.free_float || 0;
    const sharesOutstanding = ortexSharesOutstanding?.shares_outstanding || 0;
    const floatRatio = freeFloat > 0 && sharesOutstanding > 0 ? freeFloat / sharesOutstanding : 1;
    
    // ENHANCED: Availability and liquidity analysis
    const availabilityData = {
      shares: ortexShortAvailability?.available_shares || 0,
      utilization: ortexShortAvailability?.utilization || 0,
      liquidity_score: calculateLiquidityScore(ortexShortAvailability),
      squeeze_pressure: calculateSqueezePressure(ortexShortAvailability, ortexCTBNew)
    };
    
    // ENHANCED: Days to Cover with multiple sources
    const dtcData = {
      ortex: ortexDaysToCover?.days_to_cover || 0,
      calculated: calculateDTC(shortInterestData.estimated, totalVolume),
      confidence: ortexDaysToCover?.confidence || 'medium'
    };
    
    // ENHANCED: Fundamental safety screening
    const fundamentalSafety = {
      financial_health: ortexFinancialRatios?.health_score || 50,
      valuation_risk: ortexValuationMetrics?.overvaluation_risk || 50,
      bankruptcy_risk: calculateBankruptcyRisk(ortexFinancialRatios),
      dilution_risk: calculateDilutionRisk(ortexOfficialChanges),
      overall_safety: 50 // Will be calculated below
    };
    fundamentalSafety.overall_safety = calculateOverallSafety(fundamentalSafety);
    
    // ENHANCED: Holy Grail Score with new data points
    const enhancedHolyGrailInputs = {
      // Original inputs
      shortInterest: shortInterestData.estimated,
      utilization: availabilityData.utilization,
      daysToClose: dtcData.ortex,
      gammaExposure: greeksData?.total_gamma || 0,
      unusualActivity: optionsFlow?.unusual_volume_ratio || 1,
      flowSentiment,
      sweepCount: optionsFlow?.sweep_count || 0,
      darkPoolRatio: darkPoolData?.dark_pool_ratio || 0,
      
      // ENHANCED: New Ortex inputs
      ctbAcceleration: ctbData.acceleration,
      availabilityPressure: availabilityData.squeeze_pressure,
      siConfidence: shortInterestData.confidence,
      fundamentalSafety: fundamentalSafety.overall_safety,
      stockScore: ortexStockScores?.overall_score || 50,
      floatQuality: calculateFloatQuality(floatRatio, freeFloat),
      officialValidation: shortInterestData.discrepancy < 5 ? 1 : 0.5
    };
    
    const enhancedHolyGrail = calculateEnhancedHolyGrailScore(enhancedHolyGrailInputs);
    
    // ENHANCED: Squeeze classification system
    const squeezeClassification = classifySqueezeType({
      shortInterest: shortInterestData.estimated,
      utilization: availabilityData.utilization,
      ctb: ctbData.current,
      availability: availabilityData.shares,
      dtc: dtcData.ortex,
      gamma: greeksData?.total_gamma || 0,
      flow: flowSentiment
    });
    
    return {
      symbol,
      price,
      change,
      
      // ENHANCED: Holy Grail scoring
      holyGrail: enhancedHolyGrail,
      holyGrailStatus: enhancedHolyGrail >= 90 ? 'LEGENDARY' : 
                     enhancedHolyGrail >= 85 ? 'STRONG' : 
                     enhancedHolyGrail >= 75 ? 'MODERATE' : 
                     enhancedHolyGrail >= 60 ? 'WEAK' : 'AVOID',
      holyGrailBreakdown: enhancedHolyGrailInputs,
      
      // ENHANCED: Multi-dimensional squeeze analysis
      squeeze: {
        overall_score: Math.round((shortInterestData.estimated + availabilityData.utilization) / 2),
        classification: squeezeClassification,
        pressure_score: availabilityData.squeeze_pressure,
        timing: calculateSqueezeTiming(dtcData, ctbData, availabilityData)
      },
      
      // ENHANCED: Short interest with validation
      shortInterest: shortInterestData,
      
      // ENHANCED: Cost to borrow analysis
      costToBorrow: ctbData,
      
      // ENHANCED: Days to cover analysis
      daysToCover: dtcData,
      
      // ENHANCED: Availability and utilization
      availability: availabilityData,
      
      // ENHANCED: Float analysis
      floatAnalysis: {
        free_float: freeFloat,
        shares_outstanding: sharesOutstanding,
        float_ratio: floatRatio,
        float_quality: calculateFloatQuality(floatRatio, freeFloat),
        si_percent_of_float: freeFloat > 0 ? (shortInterestData.estimated * sharesOutstanding / freeFloat) : 0
      },
      
      // ENHANCED: Fundamental safety
      fundamentalSafety,
      
      // ENHANCED: Stock scoring
      stockScores: {
        ortex_score: ortexStockScores?.overall_score || 50,
        technical_score: ortexStockScores?.technical_score || 50,
        fundamental_score: ortexStockScores?.fundamental_score || 50,
        sentiment_score: ortexStockScores?.sentiment_score || 50
      },
      
      // Original metrics (preserved)
      dtc: dtcData.ortex,
      gamma: greeksData?.total_gamma || 0,
      gex: greeksData?.gex || 0,
      flow: flowSentiment,
      pinRisk: calculatePinRisk(price, greeksData),
      
      // ENHANCED: Options metrics (expanded)
      optionsMetrics: {
        totalVolume,
        totalOI: optionsFlow?.total_oi || 0,
        volumeOIRatio: optionsFlow?.vol_oi_ratio || 0,
        callVolume: totalCallVolume,
        putVolume: totalPutVolume,
        callPremium: optionsFlow?.call_premium || 0,
        putPremium: optionsFlow?.put_premium || 0,
        netPremium: (optionsFlow?.call_premium || 0) - (optionsFlow?.put_premium || 0),
        putCallRatio: totalCallVolume > 0 ? totalPutVolume / totalCallVolume : 0,
        ivRank: optionsFlow?.iv_rank || 0,
        ivPercentile: optionsFlow?.iv_percentile || 0,
        atmIV: optionsFlow?.atm_iv || 0,
        skew: optionsFlow?.skew || 0,
        term: optionsFlow?.term_structure || 'N/A'
      },
      
      flowAnalysis: {
        unusual: {
          multiplier: optionsFlow?.unusual_volume_ratio || 1,
          zscore: optionsFlow?.volume_zscore || 0,
          percentile: optionsFlow?.volume_percentile || 0
        },
        sweeps: {
          count: optionsFlow?.sweep_count || 0,
          totalPremium: optionsFlow?.sweep_premium || 0,
          bullish: optionsFlow?.bullish_sweep_count || 0,
          bearish: optionsFlow?.bearish_sweep_count || 0
        },
        blocks: {
          count: optionsFlow?.block_count || 0,
          totalPremium: optionsFlow?.block_premium || 0
        },
        sentiment: {
          overall: flowSentiment > 60 ? 'BULLISH' : flowSentiment < 40 ? 'BEARISH' : 'NEUTRAL',
          score: flowSentiment
        }
      },
      
      darkPool: {
        ratio: darkPoolData?.dark_pool_ratio || 0,
        volume: darkPoolData?.dark_pool_volume || 0,
        trades: darkPoolData?.dark_pool_trades || 0
      },
      
      keyLevels: {
        maxPain: greeksData?.max_pain || 0,
        gammaWall: greeksData?.gamma_wall || 0,
        putWall: greeksData?.put_wall || 0,
        callWall: greeksData?.call_wall || 0
      },
      
      recentFlows: processRecentFlows(optionsFlow?.recent_trades || []),
      
      // ENHANCED: Alert triggers
      alerts: generateAlerts({
        holyGrail: enhancedHolyGrail,
        ctb: ctbData,
        availability: availabilityData,
        shortInterest: shortInterestData,
        squeeze: squeezeClassification
      }),
      
      // ENHANCED: Metadata
      dataQuality: {
        ortex_coverage: calculateOrtexCoverage([
          ortexShortEstimates, ortexShortAvailability, ortexCTBNew, 
          ortexFreeFloat, ortexSharesOutstanding
        ]),
        last_updated: new Date().toISOString(),
        data_sources: ['Unusual Whales', 'Ortex', 'FMP']
      }
    };
  } catch (error) {
    console.error('Error in scanSingleStock:', error);
    throw error;
  }
}

// ENHANCED: All new Ortex API functions
async function fetchOrtexShortEstimates(symbol) {
  return fetchOrtexEndpoint(`short-interest-estimates/${symbol}`, 'Short Interest Estimates');
}

async function fetchOrtexShortAvailability(symbol) {
  return fetchOrtexEndpoint(`short-availability/${symbol}`, 'Short Availability');
}

async function fetchOrtexDaysToCover(symbol) {
  return fetchOrtexEndpoint(`short-interest-days-to-cover/${symbol}`, 'Days to Cover');
}

async function fetchOrtexOfficialPositions(symbol) {
  return fetchOrtexEndpoint(`official-short-interest-filings-positions/${symbol}`, 'Official Positions');
}

async function fetchOrtexOfficialChanges(symbol) {
  return fetchOrtexEndpoint(`official-short-interest-filings-changes/${symbol}`, 'Official Changes');
}

async function fetchOrtexOfficialStats(symbol) {
  return fetchOrtexEndpoint(`official-short-interest-filings-position-stats/${symbol}`, 'Official Stats');
}

async function fetchOrtexCTBNew(symbol) {
  return fetchOrtexEndpoint(`cost-to-borrow-new/${symbol}`, 'Cost to Borrow New');
}

async function fetchOrtexCTBAll(symbol) {
  return fetchOrtexEndpoint(`cost-to-borrow-all/${symbol}`, 'Cost to Borrow All');
}

async function fetchOrtexFreeFloat(symbol) {
  return fetchOrtexEndpoint(`free-float/${symbol}`, 'Free Float');
}

async function fetchOrtexSharesOutstanding(symbol) {
  return fetchOrtexEndpoint(`shares-outstanding/${symbol}`, 'Shares Outstanding');
}

async function fetchOrtexStockScores(symbol) {
  return fetchOrtexEndpoint(`stock-scores/${symbol}`, 'Stock Scores');
}

async function fetchOrtexFinancialRatios(symbol) {
  return fetchOrtexEndpoint(`financial-ratios/${symbol}`, 'Financial Ratios');
}

async function fetchOrtexValuationMetrics(symbol) {
  return fetchOrtexEndpoint(`valuation-metrics/${symbol}`, 'Valuation Metrics');
}

// ENHANCED: Generic Ortex API fetcher
async function fetchOrtexEndpoint(endpoint, name) {
  try {
    const response = await fetch(
      `https://api.ortex.com/api/v2/data/${endpoint}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.ORTEX_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.error(`ORTEX ${name} error:`, response.status);
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error(`ORTEX ${name} fetch error:`, error);
    return null;
  }
}

// Existing API functions (preserved)
async function fetchUWOptionsFlow(symbol) {
  const response = await fetch(
    `https://api.unusualwhales.com/api/stock/${symbol}/options-activity`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.UW_API_KEY}`
      }
    }
  );
  
  if (!response.ok) {
    console.error('UW Options Flow error:', response.status, response.statusText);
    return null;
  }
  
  return response.json();
}

async function fetchUWMarketData(symbol) {
  const response = await fetch(
    `https://api.unusualwhales.com/api/stock/${symbol}/quote`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.UW_API_KEY}`
      }
    }
  );
  
  if (!response.ok) {
    console.error('UW Market Data error:', response.status);
    return null;
  }
  
  return response.json();
}

async function fetchUWGreeks(symbol) {
  const response = await fetch(
    `https://api.unusualwhales.com/api/stock/${symbol}/greeks`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.UW_API_KEY}`
      }
    }
  );
  
  if (!response.ok) {
    console.error('UW Greeks error:', response.status);
    return null;
  }
  
  return response.json();
}

async function fetchUWDarkPool(symbol) {
  const response = await fetch(
    `https://api.unusualwhales.com/api/stock/${symbol}/dark-pool`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.UW_API_KEY}`
      }
    }
  );
  
  if (!response.ok) {
    console.error('UW Dark Pool error:', response.status);
    return null;
  }
  
  return response.json();
}

async function fetchFMPQuote(symbol) {
  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.FMP_API_KEY}`
    );
    return response.json();
  } catch (error) {
    console.error('FMP error:', error);
    return null;
  }
}

// ENHANCED: New calculation functions
function calculateEnhancedHolyGrailScore(inputs) {
  const weights = {
    // Original weights (adjusted)
    shortInterest: 0.18,
    utilization: 0.15,
    daysToClose: 0.12,
    gammaExposure: 0.10,
    flowSentiment: 0.08,
    unusualActivity: 0.08,
    sweepCount: 0.04,
    
    // NEW: Enhanced weights
    ctbAcceleration: 0.10,
    availabilityPressure: 0.08,
    siConfidence: 0.03,
    fundamentalSafety: 0.02,
    stockScore: 0.01,
    floatQuality: 0.01
  };
  
  let score = 0;
  
  // Original scoring (enhanced)
  score += Math.min((inputs.shortInterest / 30) * 100, 100) * weights.shortInterest;
  score += inputs.utilization * weights.utilization;
  score += Math.max(0, (15 - inputs.daysToClose) * 6.67) * weights.daysToClose;
  score += Math.min((inputs.gammaExposure / 10) * 100, 100) * weights.gammaExposure;
  score += inputs.flowSentiment * weights.flowSentiment;
  score += Math.min(inputs.unusualActivity * 20, 100) * weights.unusualActivity;
  score += Math.min(inputs.sweepCount * 5, 100) * weights.sweepCount;
  
  // NEW: Enhanced scoring
  score += Math.min(inputs.ctbAcceleration * 25, 100) * weights.ctbAcceleration;
  score += inputs.availabilityPressure * weights.availabilityPressure;
  score += inputs.siConfidence * weights.siConfidence;
  score += inputs.fundamentalSafety * weights.fundamentalSafety;
  score += inputs.stockScore * weights.stockScore;
  score += inputs.floatQuality * weights.floatQuality;
  
  return Math.round(Math.min(Math.max(score, 0), 99));
}

function calculateSIConfidence(estimates, official) {
  if (!estimates && !official) return 0;
  if (!estimates || !official) return 50;
  
  const discrepancy = Math.abs(estimates.si_percent - official.si_percent);
  if (discrepancy < 2) return 95;
  if (discrepancy < 5) return 80;
  if (discrepancy < 10) return 60;
  return 30;
}

function calculateCTBTrend(current, historical) {
  if (!current || !historical) return 'UNKNOWN';
  
  const ratio = current.current_ctb / historical.historical_avg;
  if (ratio > 2) return 'EXPLODING';
  if (ratio > 1.5) return 'RISING_FAST';
  if (ratio > 1.2) return 'RISING';
  if (ratio < 0.8) return 'FALLING';
  return 'STABLE';
}

function calculateLiquidityScore(availability) {
  if (!availability) return 50;
  
  const utilization = availability.utilization || 0;
  const shares = availability.available_shares || 0;
  
  if (utilization > 90 && shares < 1000000) return 95;
  if (utilization > 80 && shares < 5000000) return 85;
  if (utilization > 70) return 70;
  if (utilization > 50) return 55;
  return 30;
}

function calculateSqueezePressure(availability, ctb) {
  if (!availability || !ctb) return 50;
  
  const utilization = availability.utilization || 0;
  const currentCTB = ctb.current_ctb || 0;
  
  let pressure = 0;
  pressure += utilization * 0.4;
  pressure += Math.min(currentCTB * 2, 100) * 0.3;
  pressure += (100 - (availability.available_shares || 0) / 10000000 * 100) * 0.3;
  
  return Math.round(Math.min(Math.max(pressure, 0), 100));
}

function calculateDTC(shortInterest, volume) {
  if (!volume || volume === 0) return 999;
  return Math.round((shortInterest * 1000000) / volume);
}

function calculateBankruptcyRisk(financials) {
  if (!financials) return 20;
  
  // Simplified bankruptcy risk calculation
  const debtRatio = financials.debt_to_equity || 1;
  const currentRatio = financials.current_ratio || 1;
  const cashRatio = financials.cash_ratio || 0.1;
  
  let risk = 0;
  if (debtRatio > 3) risk += 40;
  if (currentRatio < 1) risk += 30;
  if (cashRatio < 0.05) risk += 30;
  
  return Math.min(risk, 100);
}

function calculateDilutionRisk(changes) {
  if (!changes || !changes.recent_changes) return 20;
  
  // Check for recent share increases
  const recentIncrease = changes.recent_changes.some(change => 
    change.type === 'shares_increase' && change.percentage > 10
  );
  
  return recentIncrease ? 80 : 20;
}

function calculateOverallSafety(safety) {
  const weights = {
    financial_health: 0.4,
    valuation_risk: 0.2,
    bankruptcy_risk: -0.3, // Negative because higher risk = lower safety
    dilution_risk: -0.1
  };
  
  return Math.round(
    safety.financial_health * weights.financial_health +
    (100 - safety.valuation_risk) * weights.valuation_risk +
    (100 - safety.bankruptcy_risk) * Math.abs(weights.bankruptcy_risk) +
    (100 - safety.dilution_risk) * Math.abs(weights.dilution_risk)
  );
}

function calculateFloatQuality(floatRatio, freeFloat) {
  if (floatRatio < 0.3) return 90; // Low float is good for squeezes
  if (floatRatio < 0.5) return 75;
  if (floatRatio < 0.7) return 60;
  return 40;
}

function classifySqueezeType(data) {
  const { shortInterest, utilization, ctb, availability, dtc, gamma, flow } = data;
  
  // Gamma squeeze conditions
  if (gamma > 5 && flow > 70 && shortInterest > 15) {
    return 'GAMMA_SHORT_COMBO';
  }
  
  // Pure short squeeze
  if (shortInterest > 20 && utilization > 85 && dtc > 7) {
    return 'CLASSIC_SHORT_SQUEEZE';
  }
  
  // CTB squeeze
  if (ctb > 50 && utilization > 80) {
    return 'BORROWING_CRISIS';
  }
  
  // Gamma squeeze
  if (gamma > 8 && flow > 75) {
    return 'GAMMA_SQUEEZE';
  }
  
  // Low float squeeze
  if (availability < 5000000 && utilization > 70) {
    return 'LOW_FLOAT_SQUEEZE';
  }
  
  return 'POTENTIAL_SETUP';
}

function calculateSqueezeTiming(dtc, ctb, availability) {
  if (ctb.trend === 'EXPLODING' || availability.utilization > 95) {
    return 'IMMINENT';
  }
  
  if (dtc.ortex < 3 && ctb.acceleration > 1.5) {
    return 'NEAR_TERM';
  }
  
  if (dtc.ortex < 7 && availability.utilization > 80) {
    return 'SHORT_TERM';
  }
  
  return 'MEDIUM_TERM';
}

function generateAlerts(data) {
  const alerts = [];
  
  if (data.holyGrail >= 90) {
    alerts.push({
      type: 'LEGENDARY_SETUP',
      message: '🔥 LEGENDARY Holy Grail setup detected!',
      priority: 'CRITICAL'
    });
  }
  
  if (data.ctb.trend === 'EXPLODING') {
    alerts.push({
      type: 'CTB_SPIKE',
      message: `🚀 Cost to borrow exploding: ${data.ctb.current}%`,
      priority: 'HIGH'
    });
  }
  
  if (data.availability.utilization > 95) {
    alerts.push({
      type: 'HIGH_UTILIZATION',
      message: `⚡ Extremely high utilization: ${data.availability.utilization}%`,
      priority: 'HIGH'
    });
  }
  
  if (data.shortInterest.discrepancy > 10) {
    alerts.push({
      type: 'DATA_DISCREPANCY',
      message: `⚠️ Large discrepancy between estimated and official SI`,
      priority: 'MEDIUM'
    });
  }
  
  if (data.squeeze.classification === 'GAMMA_SHORT_COMBO') {
    alerts.push({
      type: 'COMBO_SQUEEZE',
      message: '💥 Gamma + Short squeeze combo detected!',
      priority: 'CRITICAL'
    });
  }
  
  return alerts;
}

function calculateOrtexCoverage(ortexData) {
  const validSources = ortexData.filter(data => data !== null).length;
  return Math.round((validSources / ortexData.length) * 100);
}

// Preserved original helper functions
function calculateHolyGrailScore(inputs) {
  // This is kept for backward compatibility
  return calculateEnhancedHolyGrailScore(inputs);
}

function calculatePinRisk(price, greeksData) {
  if (!greeksData || !greeksData.max_pain) return 50;
  
  const maxPain = greeksData.max_pain;
  const distance = Math.abs(price - maxPain) / price;
  
  if (distance < 0.02) return 90; // Within 2% = HIGH
  if (distance < 0.05) return 70; // Within 5% = MED
  return 30; // Otherwise LOW
}

function processRecentFlows(trades) {
  return trades.slice(0, 10).map(trade => ({
    type: trade.type,
    strike: trade.strike,
    expiry: trade.expiry,
    premium: trade.premium,
    volume: trade.volume,
    time: new Date(trade.timestamp).toLocaleTimeString(),
    sweep: trade.is_sweep || false,
    unusual: trade.is_unusual || false
  }));
}
