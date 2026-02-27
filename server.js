const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

const trackerService = require('./services/tracker');
const dataService = require('./services/data');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔍 Track a specific token
app.get('/api/track/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const result = await trackerService.trackToken(token);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📊 Get token history
app.get('/api/history/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const history = await trackerService.getTokenHistory(token);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🏠 Get all tracked tokens status
app.get('/api/status', async (req, res) => {
  try {
    const statuses = await Promise.all(
      config.trackedTokens.map(async (token) => {
        const history = dataService.loadHistory(token);
        const latest = history[history.length - 1];
        return {
          token,
          lastCheck: latest?.timestamp || null,
          mentions: latest?.mentions || 0,
          sentiment: latest?.sentiment?.sentiment || 'N/A',
          spike: latest?.spike?.isSpike || false
        };
      })
    );
    
    res.json({
      trackedTokens: config.trackedTokens,
      statuses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ⏰ Cron endpoint (for scheduled tracking)
app.get('/api/cron/track', async (req, res) => {
  try {
    console.log('⏰ Running scheduled tracking...');
    const results = await trackerService.trackAllTokens();
    res.json({
      message: 'Scheduled tracking complete',
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    trackedTokens: config.trackedTokens
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Token Tracker running on http://localhost:${PORT}`);
  console.log(`📊 Tracking: ${config.trackedTokens.join(', ')}`);
  console.log(`⏰ Auto-check: ${config.checkInterval}`);
});

// Setup cron job for auto-tracking
cron.schedule(config.checkInterval, async () => {
  console.log(`\n[${new Date().toISOString()}] Running scheduled check...`);
  await trackerService.trackAllTokens();
});

module.exports = app;
