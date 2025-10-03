import { scanSingleStock } from './scan-single.js';

// In-memory storage for active connections and watchlists
const activeConnections = new Map();
const watchlists = new Map();
let streamingInterval = null;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, symbols, interval = 30000 } = req.query;
  
  // Set up Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const connectionId = Date.now().toString();
  
  // Store connection
  activeConnections.set(connectionId, res);
  
  // Parse symbols
  const symbolList = symbols ? symbols.split(',').map(s => s.trim().toUpperCase()) : [];
  
  if (symbolList.length > 0) {
    watchlists.set(connectionId, symbolList);
  }
  
  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({
    type: 'connected',
    connectionId,
    watchlist: symbolList,
    timestamp: new Date().toISOString()
  })}\n\n`);
  
  // Start streaming if not already active
  if (!streamingInterval && activeConnections.size > 0) {
    startStreaming(parseInt(interval));
  }
  
  // Handle client disconnect
  req.on('close', () => {
    activeConnections.delete(connectionId);
    watchlists.delete(connectionId);
    
    // Stop streaming if no active connections
    if (activeConnections.size === 0 && streamingInterval) {
      clearInterval(streamingInterval);
      streamingInterval = null;
    }
  });
  
  // Keep connection alive
  const keepAlive = setInterval(() => {
    if (activeConnections.has(connectionId)) {
      res.write(`data: ${JSON.stringify({
        type: 'heartbeat',
        timestamp: new Date().toISOString()
      })}\n\n`);
    } else {
      clearInterval(keepAlive);
    }
  }, 30000);
}

async function startStreaming(interval) {
  console.log(`Starting real-time streaming with ${interval}ms interval`);
  
  streamingInterval = setInterval(async () => {
    try {
      await processWatchlists();
    } catch (error) {
      console.error('Streaming error:', error);
    }
  }, interval);
  
  // Also run immediately
  await processWatchlists();
}

async function processWatchlists() {
  const allSymbols = new Set();
  
  // Collect all unique symbols from all watchlists
  for (const symbols of watchlists.values()) {
    symbols.forEach(symbol => allSymbols.add(symbol));
  }
  
  if (allSymbols.size === 0) return;
  
  console.log(`Processing ${allSymbols.size} symbols for real-time updates`);
  
  // Scan all symbols in parallel (with rate limiting)
  const batchSize = 5;
  const symbolBatches = [];
  const symbolArray = Array.from(allSymbols);
  
  for (let i = 0; i < symbolArray.length; i += batchSize) {
    symbolBatches.push(symbolArray.slice(i, i + batchSize));
  }
  
  for (const batch of symbolBatches) {
    const batchPromises = batch.map(async (symbol) => {
      try {
        const data = await scanSingleStock(symbol);
        
        // Check for significant changes or alerts
        const significance = calculateSignificance(data);
        
        // Broadcast to relevant connections
        broadcastUpdate(symbol, data, significance);
        
        return { symbol, data, significance };
      } catch (error) {
        console.error(`Streaming scan error for ${symbol}:`, error);
        return { symbol, error: error.message };
      }
    });
    
    await Promise.all(batchPromises);
    
    // Small delay between batches
    if (symbolBatches.indexOf(batch) < symbolBatches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

function broadcastUpdate(symbol, data, significance) {
  const update = {
    type: 'update',
    symbol,
    data,
    significance,
    timestamp: new Date().toISOString()
  };
  
  // Send to all connections that have this symbol in their watchlist
  for (const [connectionId, symbols] of watchlists.entries()) {
    if (symbols.includes(symbol)) {
      const connection = activeConnections.get(connectionId);
      if (connection) {
        try {
          connection.write(`data: ${JSON.stringify(update)}\n\n`);
        } catch (error) {
          console.error('Error sending update:', error);
          // Clean up dead connection
          activeConnections.delete(connectionId);
          watchlists.delete(connectionId);
        }
      }
    }
  }
  
  // Also broadcast high significance updates to all connections
  if (significance.level === 'CRITICAL' || significance.level === 'HIGH') {
    const broadcastUpdate = {
      type: 'broadcast',
      symbol,
      data: {
        holyGrail: data.holyGrail,
        holyGrailStatus: data.holyGrailStatus,
        price: data.price,
        change: data.change,
        alerts: data.alerts
      },
      significance,
      timestamp: new Date().toISOString()
    };
    
    for (const connection of activeConnections.values()) {
      try {
        connection.write(`data: ${JSON.stringify(broadcastUpdate)}\n\n`);
      } catch (error) {
        console.error('Error broadcasting update:', error);
      }
    }
  }
}

function calculateSignificance(data) {
  let score = 0;
  const reasons = [];
  
  // Holy Grail score changes
  if (data.holyGrail >= 90) {
    score += 50;
    reasons.push('LEGENDARY_HOLY_GRAIL');
  } else if (data.holyGrail >= 85) {
    score += 30;
    reasons.push('STRONG_HOLY_GRAIL');
  }
  
  // Cost to borrow alerts
  if (data.costToBorrow?.trend === 'EXPLODING') {
    score += 40;
    reasons.push('CTB_EXPLOSION');
  } else if (data.costToBorrow?.current > 50) {
    score += 25;
    reasons.push('HIGH_CTB');
  }
  
  // Utilization alerts
  if (data.availability?.utilization > 95) {
    score += 35;
    reasons.push('EXTREME_UTILIZATION');
  } else if (data.availability?.utilization > 85) {
    score += 20;
    reasons.push('HIGH_UTILIZATION');
  }
  
  // Squeeze timing
  if (data.squeeze?.timing === 'IMMINENT') {
    score += 45;
    reasons.push('IMMINENT_SQUEEZE');
  } else if (data.squeeze?.timing === 'NEAR_TERM') {
    score += 25;
    reasons.push('NEAR_TERM_SQUEEZE');
  }
  
  // Squeeze classification
  if (data.squeeze?.classification === 'GAMMA_SHORT_COMBO') {
    score += 40;
    reasons.push('COMBO_SQUEEZE');
  } else if (data.squeeze?.classification === 'CLASSIC_SHORT_SQUEEZE') {
    score += 30;
    reasons.push('CLASSIC_SQUEEZE');
  }
  
  // Options flow
  if (data.flowAnalysis?.unusual?.multiplier > 5) {
    score += 25;
    reasons.push('EXTREME_UNUSUAL_ACTIVITY');
  } else if (data.flowAnalysis?.unusual?.multiplier > 3) {
    score += 15;
    reasons.push('HIGH_UNUSUAL_ACTIVITY');
  }
  
  // Sweep activity
  if (data.flowAnalysis?.sweeps?.count > 20) {
    score += 20;
    reasons.push('HEAVY_SWEEP_ACTIVITY');
  }
  
  // Price movement
  if (Math.abs(data.change) > 10) {
    score += 15;
    reasons.push('SIGNIFICANT_PRICE_MOVE');
  }
  
  // Active alerts
  if (data.alerts && data.alerts.length > 0) {
    const criticalAlerts = data.alerts.filter(a => a.priority === 'CRITICAL').length;
    const highAlerts = data.alerts.filter(a => a.priority === 'HIGH').length;
    
    score += criticalAlerts * 20;
    score += highAlerts * 10;
    
    if (criticalAlerts > 0) reasons.push('CRITICAL_ALERTS');
    if (highAlerts > 0) reasons.push('HIGH_PRIORITY_ALERTS');
  }
  
  // Determine significance level
  let level = 'LOW';
  if (score >= 80) level = 'CRITICAL';
  else if (score >= 50) level = 'HIGH';
  else if (score >= 25) level = 'MEDIUM';
  
  return {
    score,
    level,
    reasons,
    shouldAlert: level === 'CRITICAL' || level === 'HIGH'
  };
}

// Market hours detection
function isMarketHours() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const est = new Date(utc + (-5 * 3600000)); // EST timezone
  
  const hour = est.getHours();
  const dayOfWeek = est.getDay();
  
  // Monday = 1, Friday = 5
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isMarketTime = hour >= 9 && hour < 16; // 9 AM to 4 PM EST
  
  return isWeekday && isMarketTime;
}

// API endpoint for managing watchlists
export async function handleWatchlistAction(req, res) {
  const { action, symbols } = req.body;
  
  switch (action) {
    case 'add':
      // Add symbols to watchlist
      break;
      
    case 'remove':
      // Remove symbols from watchlist
      break;
      
    case 'get':
      // Get current watchlist
      break;
      
    default:
      res.status(400).json({ error: 'Invalid action' });
  }
}

// Cleanup function for graceful shutdown
export function cleanup() {
  if (streamingInterval) {
    clearInterval(streamingInterval);
    streamingInterval = null;
  }
  
  // Close all active connections
  for (const connection of activeConnections.values()) {
    try {
      connection.end();
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
  
  activeConnections.clear();
  watchlists.clear();
}