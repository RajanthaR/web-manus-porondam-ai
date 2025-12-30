# Deployment Guide

## Overview

This guide covers deploying Porondam.ai to production environments, including AWS, Vercel, and self-hosted options.

## Prerequisites

- Node.js 18+ runtime
- MySQL 8.0+ database
- AWS S3 bucket for file storage
- SSL certificate (HTTPS required)
- Domain name configured

## Environment Variables

Create a `.env.production` file with all required variables:

```env
# Database
DATABASE_URL=mysql://username:password@host:3306/database_name

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-production-bucket

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Application
NODE_ENV=production
PORT=3000
ORIGIN=https://your-domain.com

# Optional: Redis for session storage
REDIS_URL=redis://username:password@host:6379
```

## Deployment Options

### 1. AWS EC2 (Recommended)

#### Server Setup
```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

#### Application Deployment
```bash
# Clone repository
git clone https://github.com/RajanthaR/web-manus-porondam-ai.git
cd web-manus-porondam-ai

# Install dependencies
pnpm install

# Build application
pnpm build

# Setup PM2 ecosystem
pm2 ecosystem.config.js
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'porondam-ai',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/porondam-ai
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
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
```

### 2. Vercel (Frontend) + Railway (Backend)

#### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `cd client && npm install`

#### Backend Deployment (Railway)
1. Create a new Railway project
2. Connect your GitHub repository
3. Configure environment variables
4. Set build command: `pnpm build`
5. Set start command: `pnpm start`

### 3. Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: porondam_ai
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

Deploy with:
```bash
docker-compose up -d
```

## Database Setup

### MySQL Configuration
```sql
-- Create database
CREATE DATABASE porondam_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'porondam_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON porondam_ai.* TO 'porondam_user'@'%';
FLUSH PRIVILEGES;
```

### Run Migrations
```bash
pnpm db:push
```

## AWS S3 Setup

1. Create S3 bucket
2. Configure CORS:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. Set up bucket policy for public read access (if needed)

## SSL Certificate

### Using Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart app
pm2 restart porondam-ai
```

### Health Checks
Add health check endpoint:
```typescript
// server/_core/index.ts
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
```

## Performance Optimization

### Nginx Optimization
```nginx
# Add to server block
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization
- Add indexes to frequently queried columns
- Use connection pooling
- Enable query cache
- Regular backups

## Security

1. **Firewall Configuration**
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Security Headers**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

3. **Rate Limiting**
Consider using Cloudflare or implementing rate limiting in your application

## Backup Strategy

### Database Backup
```bash
# Create backup script
#!/bin/bash
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Set up cron job
0 2 * * * /path/to/backup-script.sh
```

### File Backup
- Regularly backup uploaded files to another S3 bucket
- Use versioning for important files

## Troubleshooting

### Common Issues

1. **Memory Leaks**
   - Monitor with PM2
   - Set memory limits in ecosystem config

2. **Database Connection Issues**
   - Check connection string
   - Verify firewall rules
   - Monitor connection pool

3. **File Upload Failures**
   - Check S3 credentials
   - Verify file size limits
   - Check CORS configuration

### Logs
```bash
# Application logs
pm2 logs porondam-ai

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx
```

## Rollback Procedure

1. Keep previous version in separate directory
2. Use database migrations for safe schema changes
3. Test rollback in staging environment
4. Have rollback script ready

```bash
# Rollback to previous version
pm2 stop porondam-ai
cp -r ../previous-version/dist ./
pm2 start porondam-ai
```
