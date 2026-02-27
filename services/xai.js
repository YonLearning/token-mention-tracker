const axios = require('axios');
const config = require('../config');

class XAIService {
  constructor() {
    this.apiKey = config.xaiApiKey;
    this.model = config.xaiModel;
    this.baseUrl = 'https://api.x.ai/v1';
  }

  /**
   * Analyze sentiment of tweets using xAI (Grok)
   * @param {Array} tweets - Array of tweet objects
   * @param {string} token - Token symbol
   * @returns {Promise<Object>} Sentiment analysis result
   */
  async analyzeSentiment(tweets, token) {
    try {
      // Extract tweet texts
      const tweetTexts = tweets.map(t => t.text).join('\n---\n');
      
      const prompt = `You are a cryptocurrency sentiment analyst. Analyze these tweets about $${token}.

TWEETS:
${tweetTexts}

Provide analysis in this exact format:

SENTIMENT: [BULLISH/BEARISH/NEUTRAL]
SCORE: [number from -10 to +10, where -10 is extremely bearish, +10 is extremely bullish, 0 is neutral]
CONFIDENCE: [percentage 0-100 based on clarity of signals]
SUMMARY: [One sentence summarizing the overall sentiment and key themes]
KEY_POINTS:
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]

Be objective and base your analysis only on the tweets provided.`;

      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a cryptocurrency sentiment analyst. Be objective and data-driven.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const content = response.data.choices[0].message.content;
      return this.parseSentimentResponse(content);
    } catch (error) {
      console.error('xAI API Error:', error.response?.data || error.message);
      
      // Return fallback if API fails
      return {
        sentiment: 'NEUTRAL',
        score: 0,
        confidence: 0,
        summary: 'Analysis failed - API error',
        keyPoints: ['API error occurred']
      };
    }
  }

  /**
   * Parse xAI's response into structured data
   * @param {string} text - Raw xAI response
   * @returns {Object} Parsed sentiment data
   */
  parseSentimentResponse(text) {
    const result = {
      sentiment: 'NEUTRAL',
      score: 0,
      confidence: 50,
      summary: '',
      keyPoints: []
    };

    // Extract SENTIMENT
    const sentimentMatch = text.match(/SENTIMENT:\s*(BULLISH|BEARISH|NEUTRAL)/i);
    if (sentimentMatch) result.sentiment = sentimentMatch[1].toUpperCase();

    // Extract SCORE
    const scoreMatch = text.match(/SCORE:\s*(-?\d+(?:\.\d+)?)/);
    if (scoreMatch) result.score = parseFloat(scoreMatch[1]);

    // Extract CONFIDENCE
    const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)/);
    if (confidenceMatch) result.confidence = parseInt(confidenceMatch[1]);

    // Extract SUMMARY
    const summaryMatch = text.match(/SUMMARY:\s*(.+?)(?:\n|$)/);
    if (summaryMatch) result.summary = summaryMatch[1].trim();

    // Extract KEY_POINTS
    const keyPointsMatch = text.match(/KEY_POINTS:([\s\S]+?)(?=\n\n|$)/);
    if (keyPointsMatch) {
      result.keyPoints = keyPointsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
    }

    return result;
  }
}

module.exports = new XAIService();
