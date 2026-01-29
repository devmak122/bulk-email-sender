# Manual Render Setup (Alternative to Blueprint)

If Render is asking for payment when using Blueprint, try this manual setup instead:

## Step 1: Deploy Backend Manually

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `bulk-email-sender`
5. Configure:
   - **Name**: `bulk-email-sender-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Select **"Free"** (should be $0/month)

6. Add Environment Variables:
   ```
   PORT = 5000
   SMTP_HOST = smtp-relay.brevo.com
   SMTP_PORT = 587
   SMTP_USER = [your Brevo SMTP username]
   SMTP_PASS = [your Brevo SMTP password]
   FROM_EMAIL = [your verified sender email]
   FROM_NAME = Bulk Email Sender
   DAILY_LIMIT = 300
   BATCH_SIZE = 50
   ```

7. Click **"Create Web Service"**

---

## Step 2: Deploy Frontend Manually

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Select `bulk-email-sender`
4. Configure:
   - **Name**: `bulk-email-sender-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://bulk-email-sender-backend.onrender.com` (use your actual backend URL from Step 1)

6. Click **"Create Static Site"**

---

## Important Notes

- ✅ Both services should be **FREE** ($0/month)
- ⚠️ Render may require a credit card on file for verification (you won't be charged)
- 🔄 If you see charges, you may have accidentally selected a paid tier—double-check the instance type

---

## Verify Free Tier

After deployment, check your Render dashboard:
- Both services should show **"Free"** or **"$0/month"**
- If you see any charges, delete the services and recreate them with the free tier selected
