const twitterService = require('./twitter');
const claudeService = require('./claude');
const dataService = require('./data');
const config = require('../config');

class TrackerService {
  /**
   * Track a single token
   * @param {string} token - Token symbol
   * @returns {Promise<Object>} Tracking result
   */
  async trackToken(token) {
    try {
      console.log(`🔍 Tracking $${token}...`);
      
      // 1. Fetch mentions from Twitter
      const tweets = await twitterService.fetchMentions(token, config.maxTweetsToAnalyze);
      console.log(`📊 Found ${tweets.length} mentions`);
      
      // 2. Analyze sentiment with Claude
      let sentiment = { sentiment: 'NEUTRAL', score: 0, summary: 'No tweets found' };
      if (tweets.length > 0) {
        sentiment = await claudeService.analyzeSentiment(tweets, token);
        console.log(`🤖 Sentiment: ${sentiment.sentiment} (${sentiment.score})`);
      }
      
      // 3. Detect spike
      const spike = dataService.detectSpike(token, tweets.length);
      if (spike.isSpike) {
        console.log(`🚨 SPIKE DETECTED! ${spike.increase}% above average`);
      }
      
      // 4. Save data
      const data = {
        token: token.toUpperCase(),
        mentions: tweets.length,
        sentiment: sentiment,
        spike: spike,
        sampleTweets: tweets.slice(0, 5).map(t => ({
          text: t.text,
          created_at: t.created_at
        }))
      };
      
      dataService.saveData(token, data);
      
      return {
        success: true,
        ...data
      };
    } catch (error) {
      console.error(`❌ Error tracking $${token}:`, error.message);
      return {
        success: false,
        token: token.toUpperCase(),
        error: error.message
      };
    }
  }

  /**
   * Track all configured tokens
   * @returns {Promise<Array>} Results for all tokens
   */
  async trackAllTokens() {
    const results = [];
    
    for (const token of config.trackedTokens) {
      const result = await this.trackToken(token);
      results.push(result);
      
      // Small delay to respect rate limits
      await this.delay(1000);
    }
    
    return results;
  }

  /**
   * Get tracking history for a token
   * @param {string} token - Token symbol
   * @returns {Object} History and stats
   */
  async getTokenHistory(token) {
    const history = dataService.loadHistory(token);
    const stats = dataService.getStats(token);
    
    return {
      token: token.toUpperCase(),
      history: history.slice(-30), // Last 30 entries
      stats
    };
  }

  /**
   * Simple delay helper
   * @param {number} ms - Milliseconds
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new TrackerService();
