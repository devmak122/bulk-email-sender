# Deployment Guide for Render.com

Deploy your bulk email sender to Render.com for **FREE** in just a few minutes!

---

## 📋 Prerequisites

Before you start, make sure you have:

1. ✅ A **GitHub account** (create one at [github.com](https://github.com))
2. ✅ A **Render account** (sign up at [render.com](https://render.com) - it's free!)
3. ✅ Your **Brevo SMTP credentials** (from your `.env` file)

---

## 🚀 Step 1: Upload Your Code to GitHub

Since Git is not installed on your system, you'll upload the code via GitHub's web interface:

### 1.1 Create a New Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Name it: `bulk-email-sender`
5. Keep it **Public** (required for Render free tier)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### 1.2 Upload Your Files

1. On the repository page, click **"uploading an existing file"**
2. **IMPORTANT**: Open your project folder and **DELETE** the `.env` file first (contains sensitive data!)
3. Select **ALL** remaining files and folders from your project
4. Drag and drop them into the GitHub upload area
5. Add commit message: `Initial commit`
6. Click **"Commit changes"**

> [!CAUTION]
> **Never upload your `.env` file to GitHub!** It contains sensitive SMTP credentials. The `.gitignore` file should prevent this, but double-check before uploading.

---

## 🎯 Step 2: Deploy on Render

### 2.1 Connect GitHub to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** button (top-right)
3. Select **"Blueprint"**
4. Click **"Connect account"** to link your GitHub
5. Authorize Render to access your GitHub repositories

### 2.2 Deploy from Blueprint

1. Find and select your **`bulk-email-sender`** repository
2. Click **"Connect"**
3. Render will automatically detect the `render.yaml` file
4. Review the services (you should see 2 services):
   - `bulk-email-sender-backend` (Web Service)
   - `bulk-email-sender-frontend` (Static Site)
5. Click **"Apply"** to start deployment

⏳ **Wait 3-5 minutes** for both services to deploy...

---

## 🔐 Step 3: Configure Environment Variables

After deployment starts, you need to add your Brevo SMTP credentials:

### 3.1 Navigate to Backend Service

1. In your Render dashboard, click on **`bulk-email-sender-backend`**
2. Go to the **"Environment"** tab (left sidebar)

### 3.2 Add Required Variables

Add these three environment variables (click **"Add Environment Variable"** for each):

| Key | Value | Example |
|-----|-------|---------|
| `SMTP_USER` | Your Brevo SMTP username | `a11f30001@smtp-brevo.com` |
| `SMTP_PASS` | Your Brevo SMTP password | `xsmtpsib-cc9885c0...` |
| `FROM_EMAIL` | Your verified sender email | `hexsociety.co@gmail.com` |

> [!TIP]
> Find these values in your local `.env` file (the one you didn't upload to GitHub!)

### 3.3 Save and Redeploy

1. Click **"Save Changes"** at the bottom
2. Render will automatically redeploy the backend service
3. Wait for the deployment to complete (check the **"Events"** tab)

---

## ✅ Step 4: Test Your Deployment

### 4.1 Get Your URLs

Once both services show **"Live"** status:

1. **Frontend URL**: Click on `bulk-email-sender-frontend` → Copy the URL
   - Example: `https://bulk-email-sender-frontend.onrender.com`

2. **Backend URL**: Click on `bulk-email-sender-backend` → Copy the URL
   - Example: `https://bulk-email-sender-backend.onrender.com`

### 4.2 Test the Application

1. Open your **Frontend URL** in a browser
2. Upload the `sample.csv` file (or create your own)
3. Fill in the email subject and body
4. Click **"Send Emails"**
5. Check your inbox to verify emails were received!

---

## 🎉 You're Done!

Your bulk email sender is now live and accessible from anywhere!

**Your Live URLs:**
- 🌐 **Frontend**: `https://bulk-email-sender-frontend.onrender.com`
- 🔧 **Backend**: `https://bulk-email-sender-backend.onrender.com`

---

## 📌 Important Notes

### Free Tier Limitations

⚠️ **Cold Starts**: The backend sleeps after 15 minutes of inactivity. First request after sleep takes 30-60 seconds.

💡 **Email Limits**: Brevo free tier allows **300 emails/day**. Plan accordingly!

🔒 **Security**: Your SMTP credentials are safely stored in Render's environment variables, not in your code.

### Troubleshooting

**Problem**: Frontend can't connect to backend
- **Solution**: Check that `VITE_API_URL` environment variable is set correctly in the frontend service

**Problem**: Emails not sending
- **Solution**: Verify your Brevo SMTP credentials in the backend environment variables

**Problem**: "Service Unavailable" error
- **Solution**: Wait 30-60 seconds for the backend to wake up from sleep (free tier limitation)

**Problem**: Build failed
- **Solution**: Check the build logs in Render dashboard for specific errors

---

## 🔄 Updating Your Deployment

To update your app after making changes:

1. Upload new files to GitHub (same process as Step 1.2)
2. Render will **automatically redeploy** when it detects changes
3. Monitor the deployment in the Render dashboard

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Brevo SMTP Guide](https://help.brevo.com/hc/en-us/articles/209467485)
- [GitHub Upload Guide](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)

---

**Need Help?** Check the logs in your Render dashboard under the "Logs" tab for each service.
