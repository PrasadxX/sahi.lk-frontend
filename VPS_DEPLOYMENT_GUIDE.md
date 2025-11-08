# CI/CD Setup Guide - Deploy Storefront to VPS

This guide will help you set up automated deployment from GitHub to your VPS with **zero downtime**.

## 📋 Prerequisites

- ✅ Ubuntu/Debian VPS server
- ✅ Node.js 20.x installed on VPS
- ✅ PM2 installed globally on VPS
- ✅ GitHub repository access
- ✅ SSH access to VPS

---

## 🚀 Step-by-Step Setup

### 1️⃣ **Prepare Your VPS**

SSH into your VPS and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install PM2 startup script
pm2 startup
# Follow the command it shows to enable PM2 on boot

# Create deployment directory
sudo mkdir -p /var/www/storefront
sudo chown -R $USER:$USER /var/www/storefront
cd /var/www/storefront
```

### 2️⃣ **Generate SSH Key for GitHub Actions**

On your **local machine** (not VPS), generate a new SSH key pair:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_vps

# This creates two files:
# - github_actions_vps (private key) - Add to GitHub Secrets
# - github_actions_vps.pub (public key) - Add to VPS
```

### 3️⃣ **Add Public Key to VPS**

Copy the public key to your VPS:

```bash
# On your local machine, copy the public key
cat ~/.ssh/github_actions_vps.pub

# SSH into your VPS and add it to authorized_keys
ssh your-user@your-vps-ip
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save and exit (Ctrl+X, Y, Enter)
chmod 600 ~/.ssh/authorized_keys
```

Test the connection:
```bash
ssh -i ~/.ssh/github_actions_vps your-user@your-vps-ip
```

### 4️⃣ **Configure GitHub Secrets**

Go to your GitHub repository: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Add the following secrets:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `VPS_HOST` | Your VPS IP address or domain | `123.45.67.89` or `vps.sahi.lk` |
| `VPS_USER` | SSH username | `ubuntu` or `root` |
| `VPS_PORT` | SSH port (default: 22) | `22` |
| `VPS_SSH_PRIVATE_KEY` | Private SSH key | Contents of `github_actions_vps` file |
| `VPS_TARGET_PATH` | Deployment directory on VPS | `/var/www/storefront` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `BREVO_API_KEY` | Brevo email API key | `xkeysib-...` |
| `SENDER_EMAIL` | Email sender address | `noreply@sahi.lk` |
| `SENDER_NAME` | Email sender name | `Sahi.LK` |
| `NEXT_PUBLIC_BASE_URL` | Your storefront URL | `https://sahi.lk` |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key | `...` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_S3_BUCKET` | S3 bucket name | `sahilk-bank-slips` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | NextAuth URL | `https://sahi.lk` |

**To add the private key:**
```bash
# On your local machine
cat ~/.ssh/github_actions_vps
# Copy the entire output (including BEGIN and END lines)
# Paste into GitHub secret VPS_SSH_PRIVATE_KEY
```

### 5️⃣ **Configure Nginx (Reverse Proxy)**

Create Nginx configuration for your storefront:

```bash
sudo nano /etc/nginx/sites-available/storefront
```

Add this configuration:

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/storefront /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6️⃣ **Setup SSL with Let's Encrypt**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d sahi.lk -d www.sahi.lk

# Auto-renewal is set up automatically
sudo certbot renew --dry-run
```

### 7️⃣ **Test the Deployment**

1. **Make a change** to your storefront code
2. **Commit and push** to main branch:
   ```bash
   git add .
   git commit -m "test: CI/CD deployment"
   git push origin main
   ```
3. **Watch the deployment** in GitHub:
   - Go to your repository
   - Click `Actions` tab
   - Watch the workflow run

### 8️⃣ **Verify Deployment**

```bash
# SSH into your VPS
ssh your-user@your-vps-ip

# Check PM2 status
pm2 status

# View logs
pm2 logs storefront --lines 50

# Check if app is running
curl http://localhost:3000
```

Visit your domain: `https://sahi.lk`

---

## 🔄 How It Works

### Deployment Flow:

1. **Push to GitHub** → Triggers workflow
2. **GitHub Actions** → Builds the app
3. **Transfer** → Copies files to VPS via SCP
4. **Backup** → Creates backup of current version
5. **Extract** → Unpacks new version
6. **Install** → Runs `npm ci --production`
7. **Reload** → PM2 reload (zero downtime)
8. **Health Check** → Verifies deployment
9. **Rollback** → Automatic if health check fails

### Zero Downtime:
- PM2 `reload` keeps old process running until new one is ready
- Health check verifies new version works
- Automatic rollback if deployment fails

---

## 🛠️ Useful Commands

### On VPS:

```bash
# Check PM2 processes
pm2 status

# View logs
pm2 logs storefront

# Restart manually
pm2 restart storefront

# Stop app
pm2 stop storefront

# Remove from PM2
pm2 delete storefront

# Save PM2 state
pm2 save

# View resource usage
pm2 monit
```

### Manual Deployment:

If you need to deploy manually without GitHub Actions:

```bash
ssh your-user@your-vps-ip
cd /var/www/storefront
git pull origin main
npm ci --production
npm run build
pm2 reload storefront
```

---

## 🐛 Troubleshooting

### Issue: Deployment fails with "Permission denied"

**Solution:** Check SSH key permissions and authorized_keys on VPS
```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Issue: "Port 3000 already in use"

**Solution:** Stop existing PM2 process
```bash
pm2 delete storefront
pm2 start npm --name storefront -- start
```

### Issue: GitHub Actions can't connect to VPS

**Solution:** 
1. Verify VPS_HOST, VPS_USER, VPS_PORT in GitHub secrets
2. Test SSH key locally first
3. Check VPS firewall allows SSH (port 22)
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
```

### Issue: App starts but crashes immediately

**Solution:** Check logs and environment variables
```bash
pm2 logs storefront --err
cat /var/www/storefront/.env.local
```

### Issue: Nginx shows 502 Bad Gateway

**Solution:** Make sure app is running on port 3000
```bash
pm2 status
netstat -tlnp | grep 3000
```

---

## 📊 Monitoring

### Setup PM2 Monitoring (Optional)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### View Deployment History

Go to GitHub Actions tab to see:
- Deployment history
- Build logs
- Success/failure status
- Deployment duration

---

## 🔒 Security Best Practices

1. ✅ Use SSH keys (not passwords)
2. ✅ Use non-root user for deployment
3. ✅ Enable UFW firewall
4. ✅ Keep Node.js and PM2 updated
5. ✅ Use HTTPS (SSL certificate)
6. ✅ Rotate SSH keys periodically
7. ✅ Monitor access logs

---

## 📝 Next Steps

After successful setup:

1. ✅ Test a deployment by making a small change
2. ✅ Setup the same for admin panel
3. ✅ Configure monitoring alerts
4. ✅ Setup database backups
5. ✅ Document your VPS configuration

---

## 🎉 Success!

Your CI/CD pipeline is now set up! Every push to the `main` branch will automatically deploy to your VPS with zero downtime.

**Need help?** Check the GitHub Actions logs or PM2 logs for detailed error messages.
