import { useState } from 'react';
import axios from 'axios';
import './App.css';

// Use environment variable for API URL, fallback to relative URL for development
const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [csvFile, setCsvFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!csvFile) {
      newErrors.csvFile = 'Please upload a CSV file';
    }

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!body.trim()) {
      newErrors.body = 'Email body is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.name.endsWith('.csv')) {
        setErrors({ ...errors, csvFile: 'Only CSV files are allowed' });
        setCsvFile(null);
        return;
      }

      setCsvFile(file);
      setErrors({ ...errors, csvFile: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('csvFile', csvFile);
    formData.append('subject', subject);
    formData.append('body', body);

    try {
      const response = await axios.post(`${API_URL}/send-bulk-email`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus({
        type: 'success',
        message: response.data.message,
        results: response.data.results,
      });

      // Reset form on success
      setCsvFile(null);
      setSubject('');
      setBody('');
      document.getElementById('csvInput').value = '';

    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send emails',
        details: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="background-gradient"></div>

      <div className="container">
        <div className="header">
          <div className="icon-wrapper">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1>Bulk Email Sender</h1>
          <p className="subtitle">Send personalized emails to multiple recipients via CSV</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {/* CSV Upload */}
          <div className="form-group">
            <label htmlFor="csvInput" className="label">
              <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Upload CSV File
            </label>
            <input
              id="csvInput"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file-input"
            />
            {csvFile && (
              <div className="file-info">
                <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{csvFile.name}</span>
              </div>
            )}
            {errors.csvFile && <span className="error">{errors.csvFile}</span>}
          </div>

          {/* Subject */}
          <div className="form-group">
            <label htmlFor="subject" className="label">
              <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Email Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="input"
            />
            {errors.subject && <span className="error">{errors.subject}</span>}
          </div>

          {/* Body */}
          <div className="form-group">
            <label htmlFor="body" className="label">
              <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Email Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter email body (HTML supported)..."
              rows="8"
              className="textarea"
            />
            {errors.body && <span className="error">{errors.body}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <div className="spinner"></div>
                Sending Emails...
              </>
            ) : (
              <>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Bulk Emails
              </>
            )}
          </button>
        </form>

        {/* Status Display */}
        {status && (
          <div className={`status ${status.type}`}>
            <div className="status-header">
              {status.type === 'success' ? (
                <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <h3>{status.message}</h3>
            </div>

            {status.results && (
              <div className="results">
                <div className="result-item">
                  <span className="result-label">Total Emails:</span>
                  <span className="result-value">{status.results.total}</span>
                </div>
                <div className="result-item success">
                  <span className="result-label">Successfully Sent:</span>
                  <span className="result-value">{status.results.sent}</span>
                </div>
                <div className="result-item error">
                  <span className="result-label">Failed:</span>
                  <span className="result-value">{status.results.failed}</span>
                </div>
              </div>
            )}

            {status.details && (
              <p className="status-details">{status.details}</p>
            )}
          </div>
        )}

        <div className="footer">
          <p>💡 CSV format: Single column with header "email"</p>
          <p>⚡ Powered by Brevo SMTP • Max 300 emails/day</p>
        </div>
      </div>
    </div>
  );
}

export default App;
