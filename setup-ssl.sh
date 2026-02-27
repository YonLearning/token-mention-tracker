#!/bin/bash

echo "🔒 Token Tracker - SSL + Subdomain Setup"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DOMAIN="token-mention-tracker.yonlearning.com"
EMAIL="admin@yonlearning.com"  # Change this to your email

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}❌ Please run as root (use sudo)${NC}"
   exit 1
fi

# Install Certbot if not exists
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Certbot...${NC}"
    apt-get update
    apt-get install -y certbot
fi

echo -e "${GREEN}✅ Certbot installed${NC}"
echo ""

# Create directories
mkdir -p certbot/conf certbot/www

# Stop any existing containers
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

echo -e "${YELLOW}🔧 Starting Nginx (HTTP only first)...${NC}"
docker-compose -f docker-compose.prod.yml up -d nginx

sleep 5

echo -e "${YELLOW}🔒 Obtaining SSL certificate for ${DOMAIN}...${NC}"
echo "   Make sure DNS is pointing to this server!"
echo ""

# Get SSL certificate
certbot certonly --standalone \
    --preferred-challenges http \
    --agree-tos \
    --non-interactive \
    --email ${EMAIL} \
    -d ${DOMAIN}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to obtain SSL certificate${NC}"
    echo "   Make sure:"
    echo "   1. DNS A record points to this server IP"
    echo "   2. Port 80 is open in firewall"
    echo "   3. Domain is correct: ${DOMAIN}"
    exit 1
fi

echo -e "${GREEN}✅ SSL certificate obtained!${NC}"
echo ""

# Copy certificates to docker volume location
mkdir -p certbot/conf/live/${DOMAIN}
cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem certbot/conf/live/${DOMAIN}/
cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem certbot/conf/live/${DOMAIN}/

echo -e "${YELLOW}🔧 Updating Nginx config for HTTPS...${NC}"

# Create HTTPS-enabled nginx config
cat > nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name token-mention-tracker.yonlearning.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name token-mention-tracker.yonlearning.com;

        ssl_certificate /etc/letsencrypt/live/token-mention-tracker.yonlearning.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/token-mention-tracker.yonlearning.com/privkey.pem;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;

        location / {
            proxy_pass http://token-tracker:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF

echo -e "${YELLOW}🚀 Starting all services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🌐 Your app is live at:"
echo "   https://${DOMAIN}"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop:         docker-compose -f docker-compose.prod.yml down"
echo "   Restart:      docker-compose -f docker-compose.prod.yml restart"
echo "   Renew SSL:    certbot renew"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "   SSL certificates auto-renew via certbot container"
echo "   Check logs to ensure renewal is working:"
echo "   docker-compose -f docker-compose.prod.yml logs certbot"
echo ""
