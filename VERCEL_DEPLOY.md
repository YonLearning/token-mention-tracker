# 🚀 Vercel Deployment Guide

Deploy your Token Mention Tracker to Vercel in 5 minutes.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account (YonLearning)
- ✅ Vercel account (free at vercel.com)
- ✅ Twitter API Bearer Token
- ✅ Claude API Key

---

## 🚀 Quick Deploy (5 Steps)

### Step 1: Push to GitHub

```bash
cd /home/ubuntu/.openclaw/workspace/token-tracker

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Token Mention Tracker v1.0"

# Add remote (replace with your actual repo URL)
git remote add origin https://github.com/YonLearning/token-mention-tracker.git

# Push to GitHub
git push -u origin main
```

**Verify:** Check https://github.com/YonLearning/token-mention-tracker to see your code.

---

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Find and select `YonLearning/token-mention-tracker`
5. Click **"Import"**

---

### Step 3: Configure Environment Variables

In the Vercel dashboard (before clicking Deploy):

Click **"Environment Variables"** and add:

| Name | Value | Where to Get |
|------|-------|--------------|
| `TWITTER_BEARER_TOKEN` | Your Twitter Bearer Token | developer.twitter.com |
| `CLAUDE_API_KEY` | Your Claude API Key | console.anthropic.com |

Click **"Add"** for each variable.

**⚠️ Important:** Don't skip this step! The app won't work without these.

---

### Step 4: Deploy

Click **"Deploy"** button.

Wait 1-2 minutes for build to complete.

**Success indicators:**
- ✅ Build completes without errors
- ✅ Green checkmark appears
- ✅ You get a URL like: `https://token-mention-tracker.vercel.app`

---

### Step 5: Test Your Deployment

Open your Vercel URL in browser:

```
https://token-mention-tracker-[random].vercel.app
```

**Test these features:**
1. Enter "BONK" → Click "Track Now"
2. Wait 10-30 seconds for API calls
3. Should show: mentions count, sentiment, spike detection

---

## 🔧 Post-Deploy Setup

### Add Custom Domain (Optional)

1. In Vercel dashboard → Your project → **"Settings"** → **"Domains"**
2. Add your domain or use Vercel's free subdomain

### Verify Cron Job is Running

Vercel will automatically run `/api/cron/track` every 6 hours.

**Check it's working:**
1. Wait 6 hours after first deploy
2. Check your data files are being created
3. Or manually trigger: Visit `https://your-url.vercel.app/api/cron/track`

---

## 🐛 Troubleshooting

### Build Fails

**Error:** "Cannot find module"
```bash
# Make sure node_modules is in .gitignore
echo "node_modules/" >> .gitignore
git add .gitignore
git commit -m "Fix gitignore"
git push
```

### API Errors

**Error:** "401 Unauthorized"
- ✅ Check environment variables are set correctly
- ✅ Redeploy after fixing env vars

**Error:** "Rate limit exceeded"
- Twitter free tier: 100 requests/day
- You're within limits if tracking 1-4 tokens every 6 hours

### App Works Locally But Not on Vercel

1. Check `vercel.json` exists in repo
2. Ensure `TWITTER_BEARER_TOKEN` and `CLAUDE_API_KEY` are in Vercel env vars (not just config.js)
3. Redeploy

---

## 📊 Monitoring

### View Logs

In Vercel dashboard:
1. Select your project
2. Click **"View Function Logs"**
3. See real-time API calls and errors

### Check Data Storage

Vercel has **ephemeral filesystem** — data resets on redeploy.

**For production:** Upgrade to Vercel Pro or add external database (MongoDB, Supabase, etc.)

**For MVP:** Data persists between cron runs, just not forever.

---

## 🔄 Update Your App

When you make changes:

```bash
# Edit files locally
git add .
git commit -m "Your changes"
git push
```

**Vercel auto-deploys** on every push to main branch!

---

## 📱 Share Your Deployed App

Once live, share this on X/Twitter:

```
Built a Token Mention Tracker in 6 hours 🚀

Features:
• Track any crypto token's social mentions
• AI sentiment analysis (Claude-powered)  
• Automatic spike alerts

Try it: https://token-mention-tracker.vercel.app

Tech: Node.js, Twitter API, Claude AI, Vercel

#buildinpublic #Web3 #AI
```

---

## 💡 Next Features to Add

After MVP is live:

1. **Telegram Alerts** — Get notified of spikes instantly
2. **Discord Integration** — Post alerts to your server
3. **Price Correlation** — Compare mentions vs price action
4. **More Data Sources** — Add Reddit, Discord, news
5. **Charts** — Visualize mention trends over time

---

## 🆘 Need Help?

**Vercel Docs:** https://vercel.com/docs
**Common Issues:** Check Vercel's status page at https://status.vercel.com

**Your Project Files:**
- Local: `/home/ubuntu/.openclaw/workspace/token-tracker`
- GitHub: https://github.com/YonLearning/token-mention-tracker

---

**Status: Ready to Deploy! 🚀**
