# Quick Setup Checklist

## ✅ VPS Setup

```bash
# 1. Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
pm2 startup

# 2. Create deployment directory
sudo mkdir -p /var/www/storefront
sudo chown -R $USER:$USER /var/www/storefront
```

## ✅ SSH Key Setup

```bash
# On local machine:
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_vps
cat ~/.ssh/github_vps.pub  # Copy this

# On VPS:
nano ~/.ssh/authorized_keys  # Paste key here
chmod 600 ~/.ssh/authorized_keys
```

## ✅ GitHub Secrets Required

```
VPS_HOST                 → Your VPS IP
VPS_USER                 → ubuntu
VPS_PORT                 → 22
VPS_SSH_PRIVATE_KEY      → Content of ~/.ssh/github_vps
VPS_TARGET_PATH          → /var/www/storefront
MONGODB_URI              → Your MongoDB URI
BREVO_API_KEY            → Your Brevo key
SENDER_EMAIL             → noreply@sahi.lk
SENDER_NAME              → Sahi.LK
NEXT_PUBLIC_BASE_URL     → https://sahi.lk
AWS_ACCESS_KEY_ID        → Your AWS key
AWS_SECRET_ACCESS_KEY    → Your AWS secret
AWS_REGION               → us-east-1
AWS_S3_BUCKET            → Your bucket name
NEXTAUTH_SECRET          → Run: openssl rand -base64 32
NEXTAUTH_URL             → https://sahi.lk
```

## ✅ Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/storefront
```

```nginx
server {
    listen 80;
    server_name sahi.lk www.sahi.lk;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/storefront /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## ✅ SSL Setup

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d sahi.lk -d www.sahi.lk
```

## ✅ Test Deployment

```bash
git add .
git commit -m "test: deploy to VPS"
git push origin main
```

Then check: https://github.com/YOUR_USERNAME/YOUR_REPO/actions

## ✅ Verify

```bash
ssh your-user@your-vps-ip
pm2 status
pm2 logs storefront
curl http://localhost:3000
```

Visit: https://sahi.lk

---

## 🚨 Common Issues

**502 Bad Gateway**
```bash
pm2 restart storefront
pm2 logs storefront
```

**Permission Denied**
```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

**Port 3000 in use**
```bash
pm2 delete storefront
pm2 start npm --name storefront -- start
```

---

## 📊 Useful PM2 Commands

```bash
pm2 status                    # Check status
pm2 logs storefront           # View logs
pm2 restart storefront        # Restart app
pm2 reload storefront         # Zero-downtime reload
pm2 monit                     # Monitor resources
pm2 save                      # Save PM2 state
```

---

**Done! 🎉** Your CI/CD is ready. Push to main = auto deploy!
