# 🌐 Subdomain Deployment Guide

Deploy Token Tracker on `token-mention-tracker.yonlearning.com` with SSL.

---

## 📋 Prerequisites

1. **Domain:** You own `yonlearning.com`
2. **Server:** VPS with Docker installed
3. **DNS Access:** Can add A records
4. **Ports Open:** 80 and 443

---

## 🚀 Quick Deploy (4 Steps)

### Step 1: Configure DNS

Go to your domain registrar (Namecheap, Cloudflare, GoDaddy, etc.):

Add **A Record**:
- **Type:** A
- **Name:** `token-mention-tracker` (or subdomain)
- **Value:** Your server IP address
- **TTL:** Automatic or 3600

**Example:**
```
token-mention-tracker.yonlearning.com → 123.456.789.0
```

**Wait:** 5-10 minutes for DNS to propagate.

**Test:**
```bash
ping token-mention-tracker.yonlearning.com
# Should show your server IP
```

---

### Step 2: Add API Keys

```bash
cd /home/ubuntu/.openclaw/workspace/listproject/token-tracker

# Create .env file
cp .env.example .env
nano .env
```

Add your real keys:
```bash
TWITTER_BEARER_TOKEN=your_real_twitter_token
XAI_API_KEY=your_real_xai_key
```

---

### Step 3: Run SSL Setup Script

```bash
# Must run as root
sudo ./setup-ssl.sh
```

This script will:
1. Install Certbot (if not installed)
2. Obtain free SSL certificate from Let's Encrypt
3. Configure Nginx with HTTPS
4. Start all Docker containers
5. Set up auto-renewal for SSL

**Follow prompts and wait 2-3 minutes.**

---

### Step 4: Verify Deployment

Open in browser:
```
https://token-mention-tracker.yonlearning.com
```

**You should see:**
- ✅ Green padlock (SSL working)
- ✅ Token Tracker dashboard
- ✅ Able to track tokens

---

## 🔧 Manual Setup (If Script Fails)

### 1. Get SSL Certificate

```bash
# Install certbot
sudo apt-get update
sudo apt-get install -y certbot

# Get certificate (standalone mode)
sudo certbot certonly --standalone -d token-mention-tracker.yonlearning.com

# Follow prompts, enter email
```

### 2. Copy Certificates

```bash
mkdir -p certbot/conf/live/token-mention-tracker.yonlearning.com

sudo cp /etc/letsencrypt/live/token-mention-tracker.yonlearning.com/fullchain.pem \
        certbot/conf/live/token-mention-tracker.yonlearning.com/

sudo cp /etc/letsencrypt/live/token-mention-tracker.yonlearning.com/privkey.pem \
        certbot/conf/live/token-mention-tracker.yonlearning.com/
```

### 3. Deploy

```bash
# Start with production config
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Architecture

```
User → https://token-mention-tracker.yonlearning.com
                ↓
        Nginx (443 SSL)
                ↓
        Docker Container (port 3000)
                ↓
        Token Tracker App
                ↓
    Twitter API ←→ xAI API
```

---

## 🔒 SSL Auto-Renewal

SSL certificates expire every 90 days. The setup includes auto-renewal:

- **Certbot container** checks every 12 hours
- **Nginx container** reloads config after renewal

**Manual renewal (if needed):**
```bash
sudo certbot renew
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 🐛 Troubleshooting

### DNS Not Propagated

**Error:** "Cannot resolve domain"

**Fix:**
```bash
# Check DNS
nslookup token-mention-tracker.yonlearning.com

# If not showing your IP, wait longer or check DNS config
```

### SSL Certificate Failed

**Error:** "Failed to obtain certificate"

**Check:**
1. DNS A record points to server IP
2. Port 80 is open in firewall
3. No other service using port 80

```bash
# Check firewall
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443

# Check port 80
sudo lsof -i :80
```

### App Not Accessible

**Check containers:**
```bash
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart
```

### Permission Denied

**Fix:**
```bash
# Fix permissions
sudo chown -R $USER:$USER .
sudo chmod +x setup-ssl.sh
```

---

## 📋 Useful Commands

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f token-tracker
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f certbot

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop everything
docker-compose -f docker-compose.prod.yml down

# Update app (after code changes)
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🆘 Need Help?

**Certbot Docs:** https://certbot.eff.org/
**Docker Docs:** https://docs.docker.com/
**Nginx Docs:** https://nginx.org/en/docs/

---

**Your App Will Be Live At:**
```
https://token-mention-tracker.yonlearning.com
```

🚀 Ready to deploy!
