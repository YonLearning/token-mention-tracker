module.exports = {
  // 🔑 API Keys (Use environment variables in production!)
  twitterBearerToken: process.env.TWITTER_BEARER_TOKEN || 'YOUR_TWITTER_BEARER_TOKEN_HERE',
  claudeApiKey: process.env.CLAUDE_API_KEY || 'YOUR_CLAUDE_API_KEY_HERE',
  
  // 📊 Tracking Configuration
  trackedTokens: ['BONK'], // Add more tokens here
  checkInterval: '0 */6 * * *', // Every 6 hours (cron format)
  
  // 🚨 Spike Detection
  spikeThreshold: 2.0, // 2x average = spike alert
  minHistoryDays: 3, // Minimum days of data for spike detection
  
  // 🤖 Claude Settings
  claudeModel: 'claude-3-5-sonnet-20241022',
  maxTweetsToAnalyze: 100,
  
  // 🌐 Server
  port: process.env.PORT || 3000,
  
  // 📁 Data Storage
  dataDir: './data'
};
