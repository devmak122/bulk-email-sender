# Deployment Guide for Render.com

## Quick Start

Follow these steps to deploy your bulk email sender to Render.com (FREE):

### 1. Push to GitHub

```bash
cd bulk-email-sender
git init
git add .
git commit -m "Initial commit"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/bulk-email-sender.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select `bulk-email-sender`
5. Render will read `render.yaml` and create both services

### 3. Add Environment Variables

In the backend service, add these environment variables:

```
SMTP_USER = devm4461@gmail.com
SMTP_PASS = your-16-digit-gmail-app-password
FROM_EMAIL = devm4461@gmail.com
```

### 4. Done!

Your app will be live at:
- Frontend: `https://bulk-email-sender-frontend.onrender.com`
- Backend: `https://bulk-email-sender-backend.onrender.com`

## Important Notes

⚠️ **Free Tier**: Backend sleeps after 15 min of inactivity (30-60s cold start)
💡 **Limits**: Gmail allows 500 emails/day
🔒 **Security**: Never commit your Gmail App Password to GitHub

For detailed instructions, see the full deployment guide in the README.
