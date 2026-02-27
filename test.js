# Quick Test Script

const trackerService = require('./services/tracker');

async function test() {
  console.log('🧪 Testing Token Tracker...\n');
  
  try {
    // Test tracking a single token
    console.log('1. Testing single token tracking...');
    const result = await trackerService.trackToken('BONK');
    
    if (result.success) {
      console.log('✅ Success!');
      console.log(`   Token: $${result.token}`);
      console.log(`   Mentions: ${result.mentions}`);
      console.log(`   Sentiment: ${result.sentiment.sentiment} (${result.sentiment.score})`);
      console.log(`   Spike: ${result.spike.isSpike ? 'YES 🔥' : 'No'}`);
    } else {
      console.log('❌ Failed:', result.error);
    }
    
    // Test history
    console.log('\n2. Testing history retrieval...');
    const history = await trackerService.getTokenHistory('BONK');
    console.log(`   Total records: ${history.history.length}`);
    console.log(`   Stats:`, history.stats);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test();
