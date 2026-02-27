const axios = require('axios');
const config = require('../config');

class TwitterService {
  constructor() {
    this.bearerToken = config.twitterBearerToken;
    this.baseUrl = 'https://api.twitter.com/2';
  }

  /**
   * Fetch recent tweets mentioning a token
   * @param {string} token - Token symbol (e.g., 'BONK')
   * @param {number} maxResults - Max tweets to fetch (10-100)
   * @returns {Promise<Array>} Array of tweet objects
   */
  async fetchMentions(token, maxResults = 100) {
    try {
      // Build query - look for token symbol as word or with $
      const query = `$${token} OR #${token} ${token}`;
      
      const url = `${this.baseUrl}/tweets/search/recent`;
      const params = {
        query: query,
        max_results: Math.min(maxResults, 100),
        'tweet.fields': 'created_at,public_metrics,author_id',
        'user.fields': 'public_metrics'
      };

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`
        },
        params: params
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Twitter API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch mentions for ${token}: ${error.message}`);
    }
  }

  /**
   * Get rate limit status
   * @returns {Promise<Object>} Rate limit info
   */
  async getRateLimitStatus() {
    try {
      const url = `${this.baseUrl}/tweets/search/recent`;
      const response = await axios.head(url, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`
        }
      });

      return {
        limit: response.headers['x-rate-limit-limit'],
        remaining: response.headers['x-rate-limit-remaining'],
        reset: response.headers['x-rate-limit-reset']
      };
    } catch (error) {
      console.error('Rate limit check failed:', error.message);
      return null;
    }
  }
}

module.exports = new TwitterService();
