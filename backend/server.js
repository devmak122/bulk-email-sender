import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import csvParser from 'csv-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure Nodemailer with Brevo SMTP
// Sanitize environment variables (remove spaces if any)
const smtpHost = (process.env.SMTP_HOST || 'smtp-relay.brevo.com').trim();
const smtpPort = parseInt((process.env.SMTP_PORT || '587').trim());
const smtpUser = (process.env.SMTP_USER || '').trim();
const smtpPass = (process.env.SMTP_PASS || '').trim();

console.log(`📡 SMTP Config: Host=${smtpHost}, Port=${smtpPort}, User=${smtpUser}`);

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // Only true for 465
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
  tls: {
    // Do not fail on invalid certs (common issue in cloud environments)
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  debug: true,
  logger: true
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
  }
});

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Parse CSV and extract emails
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const emails = [];
    const seenEmails = new Set();

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Try to find email in the row (case-insensitive)
        const email = row.email || row.Email || row.EMAIL || Object.values(row)[0];

        if (email && typeof email === 'string') {
          const trimmedEmail = email.trim().toLowerCase();

          // Validate and deduplicate
          if (isValidEmail(trimmedEmail) && !seenEmails.has(trimmedEmail)) {
            emails.push(trimmedEmail);
            seenEmails.add(trimmedEmail);
          }
        }
      })
      .on('end', () => {
        resolve(emails);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Send emails in batches
async function sendEmailsInBatches(emails, subject, body) {
  const batchSize = parseInt(process.env.BATCH_SIZE) || 50;
  const dailyLimit = parseInt(process.env.DAILY_LIMIT) || 300;

  const results = {
    total: emails.length,
    sent: 0,
    failed: 0,
    errors: []
  };

  // Respect daily limit
  const emailsToSend = emails.slice(0, dailyLimit);

  if (emails.length > dailyLimit) {
    console.log(`⚠️  Warning: ${emails.length} emails provided, but only ${dailyLimit} will be sent (daily limit)`);
  }

  // Process in batches
  for (let i = 0; i < emailsToSend.length; i += batchSize) {
    const batch = emailsToSend.slice(i, i + batchSize);
    console.log(`📧 Sending batch ${Math.floor(i / batchSize) + 1} (${batch.length} emails)...`);

    const batchPromises = batch.map(async (email) => {
      try {
        await transporter.sendMail({
          from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
          to: email,
          subject: subject,
          html: body,
        });
        results.sent++;
        console.log(`✅ Sent to: ${email}`);
      } catch (error) {
        results.failed++;
        results.errors.push({ email, error: error.message });
        console.error(`❌ Failed to send to ${email}: ${error.message}`);
      }
    });

    await Promise.all(batchPromises);

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < emailsToSend.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// Main endpoint for bulk email sending
app.post('/send-bulk-email', upload.single('csvFile'), async (req, res) => {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    const { subject, body } = req.body;

    if (!subject || !subject.trim()) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Subject is required' });
    }

    if (!body || !body.trim()) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Email body is required' });
    }

    console.log('📄 Processing CSV file:', req.file.originalname);

    // Parse CSV
    const emails = await parseCSV(req.file.path);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    if (emails.length === 0) {
      return res.status(400).json({ error: 'No valid email addresses found in CSV' });
    }

    console.log(`📊 Found ${emails.length} valid email(s)`);

    // Send emails
    const results = await sendEmailsInBatches(emails, subject, body);

    console.log('✨ Email sending completed!');
    console.log(`📈 Results: ${results.sent} sent, ${results.failed} failed out of ${results.total} total`);

    res.json({
      success: true,
      message: 'Bulk email sending completed',
      results: {
        total: results.total,
        sent: results.sent,
        failed: results.failed,
        errors: results.errors.slice(0, 10) // Return only first 10 errors
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);

    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process bulk email',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bulk Email Sender API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 SMTP configured for: ${process.env.SMTP_HOST}`);
  console.log(`📊 Daily limit: ${process.env.DAILY_LIMIT} emails`);
  console.log(`📦 Batch size: ${process.env.BATCH_SIZE} emails per batch`);
});
