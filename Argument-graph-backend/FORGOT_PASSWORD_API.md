# Forgot Password API Endpoints

## Overview
The forgot password system provides a secure 3-step process for users to reset their passwords using email-based OTP verification.

## Endpoints

### 1. Request Password Reset OTP
**POST** `/api/v1/auth/forgot-password`

Sends an OTP to the user's email address for password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset OTP has been sent to your email address.",
  "data": {
    "sent": true,
    "expiresIn": 10
  }
}
```

**Features:**
- Rate limited to prevent spam
- Security-first approach (doesn't reveal if email exists)
- OTP expires in 10 minutes (configurable)
- Professional HTML email template

---

### 2. Verify Reset OTP
**POST** `/api/v1/auth/verify-reset-otp`

Verifies the OTP and returns a temporary reset token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully. You can now reset your password.",
  "data": {
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "user@example.com"
  }
}
```

**Features:**
- Maximum 5 attempts per OTP
- OTP is marked as used after verification
- Reset token expires in 15 minutes
- Automatic cleanup of expired OTPs

---

### 3. Reset Password
**POST** `/api/v1/auth/reset-password`

Resets the user's password using the reset token.

**Request Body:**
```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now log in with your new password.",
  "data": {
    "email": "user@example.com"
  }
}
```

**Features:**
- Strong password validation
- Password is securely hashed with bcrypt
- Confirmation email sent automatically
- All existing sessions are invalidated

---

## Security Features

### Rate Limiting
All endpoints are protected by rate limiting to prevent abuse:
- Maximum requests per IP per time window
- Exponential backoff for repeated failures

### OTP Security
- **Expiration**: OTPs expire after 10 minutes
- **Single Use**: Each OTP can only be used once
- **Attempt Limiting**: Maximum 5 verification attempts
- **Automatic Cleanup**: Expired OTPs are automatically removed

### Token Security
- **Short Expiration**: Reset tokens expire after 15 minutes
- **JWT Signed**: Tokens are cryptographically signed
- **Single Use**: Reset tokens become invalid after use

### Email Security
- **Professional Templates**: Branded, responsive HTML emails
- **Security Warnings**: Clear instructions and warnings
- **No Sensitive Data**: Emails don't contain sensitive information

---

## Error Handling

### Common Error Responses

**Invalid Email Format:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid email format"
  }
}
```

**Email Service Not Configured:**
```json
{
  "success": false,
  "error": {
    "message": "Email service is not configured. Password reset is not available."
  }
}
```

**Invalid or Expired OTP:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired OTP"
  }
}
```

**Too Many Attempts:**
```json
{
  "success": false,
  "error": {
    "message": "Too many failed attempts. Please request a new OTP"
  }
}
```

**Invalid Reset Token:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired reset token"
  }
}
```

---

## Integration Examples

### Frontend Integration (JavaScript)

```javascript
class ForgotPasswordService {
  constructor(baseURL = '/api/v1') {
    this.baseURL = baseURL;
  }

  async requestReset(email) {
    const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  }

  async verifyOTP(email, otp) {
    const response = await fetch(`${this.baseURL}/auth/verify-reset-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    return response.json();
  }

  async resetPassword(resetToken, newPassword) {
    const response = await fetch(`${this.baseURL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, newPassword })
    });
    return response.json();
  }
}

// Usage
const forgotPassword = new ForgotPasswordService();

// Step 1: Request OTP
const result1 = await forgotPassword.requestReset('user@example.com');

// Step 2: Verify OTP (after user enters OTP from email)
const result2 = await forgotPassword.verifyOTP('user@example.com', '123456');

// Step 3: Reset password
const result3 = await forgotPassword.resetPassword(result2.data.resetToken, 'NewPassword123');
```

### cURL Examples

```bash
# Step 1: Request OTP
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Step 2: Verify OTP
curl -X POST http://localhost:5000/api/v1/auth/verify-reset-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'

# Step 3: Reset Password
curl -X POST http://localhost:5000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "newPassword": "NewPassword123"}'
```

---

## Admin Endpoints

### System Health Check
**GET** `/api/v1/admin/health`

Returns system health including email service status.

**Headers:**
```
Authorization: Bearer <admin-token>
```

### Cleanup Expired OTPs
**POST** `/api/v1/admin/cleanup-otps`

Manually clean up expired OTPs (also happens automatically).

**Headers:**
```
Authorization: Bearer <admin-token>
```

---

## Configuration

See `EMAIL_SETUP.md` for detailed email service configuration instructions.

### Required Environment Variables
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Argument Graph
OTP_EXPIRES_IN=10
OTP_LENGTH=6
```

---

## Database Schema

### OTP Model
```javascript
{
  email: String,        // User's email address
  otp: String,          // 6-digit OTP code
  type: String,         // 'password_reset' or 'email_verification'
  attempts: Number,     // Number of verification attempts (max 5)
  isUsed: Boolean,      // Whether OTP has been used
  expiresAt: Date,      // Expiration timestamp
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

The OTP collection includes:
- TTL index for automatic cleanup
- Compound indexes for efficient queries
- Built-in validation and security methods