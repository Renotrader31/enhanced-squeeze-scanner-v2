// Simple Demo Scanner - Returns realistic looking data immediately
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
    console.log(`🚀 Demo scanner processing ${symbols.length} symbols...`);
    
    // Generate realistic demo data for each symbol
    const results = symbols.map(symbol => {
      const now = Date.now();
      const seed = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + Math.floor(now / 60000);
      const random = (min, max) => min + (seed * 9301 + 49297) % 233280 / 233280 * (max - min);
      
      // Base prices for known stocks
      const basePrices = {
        'AAPL': 195.50, 'TSLA': 245.75, 'GME': 18.25, 'AMC': 4.45, 'BBBY': 0.30,
        'NVDA': 485.20, 'MSFT': 375.85, 'GOOGL': 165.40, 'AMZN': 145.90, 'META': 485.30,
        'SPCE': 2.15, 'PLTR': 24.80, 'NIO': 8.55, 'BABA': 95.70, 'NFLX': 485.60,
        'PELOTON': 6.20, 'RBLX': 52.30, 'COIN': 245.80, 'HOOD': 14.50, 'RIVN': 18.90,
        'LCID': 8.75, 'DWAC': 35.40, 'PHUN': 2.85, 'PROG': 1.45, 'ATER': 3.20
      };
      
      const basePrice = basePrices[symbol] || random(5, 100);
      const priceVariation = random(-0.03, 0.03);
      const price = parseFloat((basePrice * (1 + priceVariation)).toFixed(2));
      
      // Generate realistic metrics
      const shortInterest = parseFloat(random(5, 35).toFixed(2));
      const utilization = parseFloat(Math.min(99.8, random(60, 98)).toFixed(1));
      const costToBorrow = parseFloat(Math.min(300, random(5, shortInterest * 3)).toFixed(2));
      const daysToCover = parseFloat(Math.min(15, random(0.5, shortInterest / 3)).toFixed(2));
      
      // Calculate Holy Grail score based on metrics
      let holyGrail = 0;
      holyGrail += Math.min(shortInterest * 0.67, 20); // SI component
      holyGrail += Math.min(utilization * 0.15, 15); // Utilization component
      holyGrail += Math.min(costToBorrow * 0.3, 15); // CTB component
      holyGrail += Math.min(daysToCover * 2, 10); // DTC component
      holyGrail += random(0, 40); // Other factors
      holyGrail = Math.round(Math.min(holyGrail, 100));
      
      // Determine squeeze classification based on metrics
      let classification = 'MONITORING';
      let timing = 'EARLY';
      
      if (shortInterest > 20 && utilization > 90 && costToBorrow > 30) {
        classification = 'GAMMA_SHORT_COMBO';
        timing = holyGrail > 85 ? 'IMMINENT' : holyGrail > 75 ? 'BUILDING' : 'EARLY';
      } else if (shortInterest > 15 && utilization > 85 && daysToCover > 3) {
        classification = 'CLASSIC_SHORT_SQUEEZE';
        timing = holyGrail > 80 ? 'IMMINENT' : holyGrail > 70 ? 'BUILDING' : 'EARLY';
      } else if (costToBorrow > 50) {
        classification = 'BORROWING_CRISIS';
        timing = costToBorrow > 100 ? 'IMMINENT' : 'BUILDING';
      } else if (holyGrail > 60) {
        classification = 'POTENTIAL_SETUP';
        timing = holyGrail > 75 ? 'BUILDING' : 'MONITORING';
      }
      
      // Generate alerts based on metrics
      const alerts = [];
      if (costToBorrow > 50) {
        alerts.push({
          level: 'CRITICAL',
          type: 'CTB_EXPLOSION',
          message: `Cost to borrow exploding: ${costToBorrow}%`,
          value: costToBorrow
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
      if (utilization > 95) {
        alerts.push({
          level: 'HIGH',
          type: 'EXTREME_UTILIZATION',
          message: `Extreme utilization: ${utilization}%`,
          value: utilization
        });
      }
      
      return {
        symbol,
        price,
        holyGrail,
        squeeze: {
          classification,
          timing,
          overall_score: holyGrail
        },
        alerts,
        shortInterest: {
          estimated: shortInterest,
          confidence: Math.round(random(75, 98)),
          change_1d: parseFloat(random(-2, 3).toFixed(2)),
          change_7d: parseFloat(random(-5, 8).toFixed(2)),
          change_30d: parseFloat(random(-10, 15).toFixed(2))
        },
        availability: {
          utilization,
          available: Math.round(random(1000, 50000)),
          change_1d: parseFloat(random(-5, 5).toFixed(2)),
          onLoan: Math.round(random(100000, 5000000))
        },
        costToBorrow: {
          current: costToBorrow,
          min: parseFloat((costToBorrow * 0.3).toFixed(2)),
          max: parseFloat((costToBorrow * 1.8).toFixed(2)),
          trend: costToBorrow > 50 ? 'EXPLODING' : costToBorrow > 20 ? 'RISING' : 'STABLE',
          change_1d: parseFloat(random(-10, 15).toFixed(2))
        },
        daysToCover: {
          ortex: daysToCover,
          exchange: parseFloat((daysToCover * 0.8).toFixed(2)),
          trend: daysToCover > 5 ? 'RISING' : 'STABLE'
        },
        floatAnalysis: {
          free_float: Math.round(random(20000000, 500000000)),
          outstanding: Math.round(random(50000000, 800000000)),
          float_percentage: parseFloat(random(25, 95).toFixed(1))
        },
        flowAnalysis: {
          sentiment: parseFloat(random(-50, 80).toFixed(1)),
          unusual: {
            multiplier: parseFloat(random(0.5, 8).toFixed(1)),
            volume_ratio: parseFloat(random(0.8, 4).toFixed(2))
          },
          volume: {
            call_put_ratio: parseFloat(random(0.3, 3.5).toFixed(2)),
            total_premium: Math.round(random(1000000, 50000000))
          }
        },
        fundamentalSafety: {
          overall_safety: Math.round(random(20, 95)),
          financial_strength: Math.round(random(30, 90)),
          profitability: Math.round(random(10, 85))
        },
        stockScores: {
          squeeze_score: Math.round(random(0, 100)),
          gamma_score: Math.round(random(0, 100)),
          overall_grade: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'][Math.floor(random(0, 8))]
        },
        dataQuality: {
          ortex_coverage: Math.round(random(80, 99)),
          confidence_level: Math.round(random(75, 95)),
          last_updated: new Date(now - random(1, 30) * 60 * 1000).toISOString()
        },
        flow: parseFloat(random(-50, 80).toFixed(1)),
        timestamp: new Date().toISOString(),
        _mode: 'DEMO'
      };
    });

    // Sort by Holy Grail score (highest first)
    const sortedResults = results.sort((a, b) => b.holyGrail - a.holyGrail);

    // Generate summary statistics
    const total = sortedResults.length;
    const legendary = sortedResults.filter(r => r.holyGrail >= 90).length;
    const strong = sortedResults.filter(r => r.holyGrail >= 85 && r.holyGrail < 90).length;
    const moderate = sortedResults.filter(r => r.holyGrail >= 75 && r.holyGrail < 85).length;
    const weak = sortedResults.filter(r => r.holyGrail >= 60 && r.holyGrail < 75).length;
    const avoid = sortedResults.filter(r => r.holyGrail < 60).length;
    
    const averageHolyGrail = Math.round(
      sortedResults.reduce((sum, r) => sum + r.holyGrail, 0) / total
    );
    
    const alertCount = sortedResults.reduce((sum, r) => sum + r.alerts.length, 0);
    const ctbExplosions = sortedResults.filter(r => r.costToBorrow?.trend === 'EXPLODING').length;
    const imminentSqueezes = sortedResults.filter(r => r.squeeze?.timing === 'IMMINENT').length;
    
    const summary = {
      total,
      legendary,
      strong,
      moderate,
      weak,
      avoid,
      averageHolyGrail,
      alertCount,
      ctbExplosions,
      imminentSqueezes,
      highValueOpportunities: legendary + strong,
      dataQuality: 95
    };
    
    console.log(`✅ Demo scan complete: ${total} stocks, avg HG: ${averageHolyGrail}`);
    
    const response = {
      success: true,
      summary,
      results: sortedResults,
      timestamp: new Date().toISOString(),
      processed_count: total,
      filtered_count: total,
      api_status: 'DEMO',
      mode: 'DEMO_MODE'
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Demo scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      api_status: 'ERROR',
      mode: 'DEMO_MODE'
    });
  }
}