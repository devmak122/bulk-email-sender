# CSV-Based Bulk Email Sender

A modern, single-page web application for sending bulk emails to multiple recipients using CSV files and Brevo SMTP.

## ✨ Features

- 📧 Send bulk emails to multiple recipients via CSV upload
- 🎨 Modern, premium UI with glassmorphism and smooth animations
- ✅ Client-side and server-side validation
- 📊 Real-time sending progress and status display
- 🔒 Secure SMTP integration with Brevo
- 📦 Batch processing (50 emails per batch)
- 🚫 Daily limit enforcement (300 emails/day)
- 💾 No data persistence - privacy-focused

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Brevo account with SMTP credentials

### Installation

1. **Clone or navigate to the project directory**

```bash
cd bulk-email-sender
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

### Configuration

1. **Configure Brevo SMTP credentials**

Edit `backend/.env` file with your Brevo SMTP credentials:

```env
# Server Configuration
PORT=5000

# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@example.com
SMTP_PASS=your-brevo-smtp-password

# Email Configuration
FROM_EMAIL=your-sender-email@example.com
FROM_NAME=Bulk Email Sender

# Rate Limiting
DAILY_LIMIT=300
BATCH_SIZE=50
```

**How to get Brevo SMTP credentials:**
1. Sign up at [Brevo](https://www.brevo.com/)
2. Go to Settings → SMTP & API
3. Create a new SMTP key
4. Copy the credentials to your `.env` file

### Running the Application

1. **Start the backend server**

```bash
cd backend
npm start
```

The server will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**

```bash
cd frontend
npm run dev
```

The app will run on `http://localhost:5173`

3. **Open your browser and navigate to** `http://localhost:5173`

## 📝 Usage

1. **Prepare your CSV file**
   - Create a CSV file with a single column header: `email`
   - Add email addresses (one per row)
   - See `sample.csv` for reference

2. **Upload and send**
   - Click "Upload CSV File" and select your CSV
   - Enter the email subject
   - Enter the email body (HTML supported)
   - Click "Send Bulk Emails"

3. **Monitor progress**
   - View real-time sending status
   - See total sent, failed, and success counts

## 📄 CSV Format

Your CSV file should have this format:

```csv
email
user1@example.com
user2@example.com
user3@example.com
```

## 🔧 Technical Stack

**Frontend:**
- React 18
- Vite
- Axios
- Modern CSS with animations

**Backend:**
- Node.js
- Express
- Nodemailer
- Multer (file uploads)
- csv-parser
- dotenv

## 🛡️ Security Features

- SMTP credentials stored in `.env` (not committed to git)
- File size limit (5MB) for CSV uploads
- Email validation and deduplication
- No permanent data storage
- CORS enabled for frontend-backend communication

## ⚙️ Configuration Options

Edit `backend/.env` to customize:

- `PORT` - Backend server port (default: 5000)
- `DAILY_LIMIT` - Maximum emails per day (default: 300)
- `BATCH_SIZE` - Emails per batch (default: 50)

## 📊 Limitations

- Maximum 300 emails per day (Brevo free tier)
- CSV file size limit: 5MB
- Only `.csv` files accepted
- Duplicate emails are automatically removed

## 🐛 Troubleshooting

**Emails not sending?**
- Verify your Brevo SMTP credentials in `.env`
- Check that your Brevo account is active
- Ensure you haven't exceeded the daily limit

**CSV upload fails?**
- Ensure file has `.csv` extension
- Check that the header is exactly `email`
- Verify email addresses are valid

**Frontend can't connect to backend?**
- Ensure backend is running on port 5000
- Check Vite proxy configuration in `vite.config.js`

## 📜 License

ISC

## 🤝 Support

For issues or questions, please check the troubleshooting section above.
