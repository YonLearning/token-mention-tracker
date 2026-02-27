const fs = require('fs');
const path = require('path');
const config = require('../config');

class DataService {
  constructor() {
    this.dataDir = config.dataDir;
    this.ensureDataDir();
  }

  /**
   * Ensure data directory exists
   */
  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * Get file path for a token's data
   * @param {string} token - Token symbol
   * @returns {string} File path
   */
  getFilePath(token) {
    return path.join(this.dataDir, `${token.toUpperCase()}.json`);
  }

  /**
   * Load historical data for a token
   * @param {string} token - Token symbol
   * @returns {Array} Historical data array
   */
  loadHistory(token) {
    try {
      const filePath = this.getFilePath(token);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading history for ${token}:`, error.message);
      return [];
    }
  }

  /**
   * Save tracking data for a token
   * @param {string} token - Token symbol
   * @param {Object} data - Tracking data to save
   */
  saveData(token, data) {
    try {
      const history = this.loadHistory(token);
      
      // Add timestamp
      const entry = {
        timestamp: new Date().toISOString(),
        ...data
      };
      
      history.push(entry);
      
      // Keep only last 90 days (prevent file bloat)
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const filtered = history.filter(h => new Date(h.timestamp) > cutoff);
      
      const filePath = this.getFilePath(token);
      fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
      
      return entry;
    } catch (error) {
      console.error(`Error saving data for ${token}:`, error.message);
      throw error;
    }
  }

  /**
   * Detect if current mention count is a spike
   * @param {string} token - Token symbol
   * @param {number} currentCount - Current mention count
   * @returns {Object} Spike detection result
   */
  detectSpike(token, currentCount) {
    const history = this.loadHistory(token);
    
    // Need at least 3 data points
    if (history.length < config.minHistoryDays) {
      return {
        isSpike: false,
        reason: 'Insufficient history',
        current: currentCount,
        average: null,
        increase: null
      };
    }

    // Calculate average of last 7 entries
    const recent = history.slice(-7);
    const avg = recent.reduce((sum, h) => sum + (h.mentions || 0), 0) / recent.length;
    
    // Check threshold
    const isSpike = currentCount >= (avg * config.spikeThreshold);
    const increase = avg > 0 ? ((currentCount - avg) / avg) * 100 : 0;
    
    return {
      isSpike,
      current: currentCount,
      average: Math.round(avg),
      increase: Math.round(increase),
      threshold: Math.round(avg * config.spikeThreshold),
      reason: isSpike ? `Mentions ${Math.round(increase)}% above average` : 'Normal range'
    };
  }

  /**
   * Get stats summary for a token
   * @param {string} token - Token symbol
   * @returns {Object} Stats summary
   */
  getStats(token) {
    const history = this.loadHistory(token);
    
    if (history.length === 0) {
      return { message: 'No data yet' };
    }

    const mentions = history.map(h => h.mentions || 0);
    const scores = history.map(h => h.sentiment?.score || 0);
    
    return {
      totalChecks: history.length,
      firstCheck: history[0].timestamp,
      lastCheck: history[history.length - 1].timestamp,
      avgMentions: Math.round(mentions.reduce((a, b) => a + b, 0) / mentions.length),
      maxMentions: Math.max(...mentions),
      minMentions: Math.min(...mentions),
      avgSentiment: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      recentTrend: this.calculateTrend(mentions.slice(-7))
    };
  }

  /**
   * Calculate trend direction
   * @param {Array} values - Array of numbers
   * @returns {string} Trend description
   */
  calculateTrend(values) {
    if (values.length < 2) return 'insufficient data';
    
    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;
    
    if (change > 20) return 'strongly up';
    if (change > 5) return 'up';
    if (change < -20) return 'strongly down';
    if (change < -5) return 'down';
    return 'stable';
  }
}

module.exports = new DataService();
