# Email Service Setup for Password Reset

This guide explains how to configure the email service for the forgot password functionality.

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. In Google Account Security settings
2. Go to "App passwords"
3. Select "Mail" and your device
4. Copy the generated 16-character password

### Step 3: Update Environment Variables
Update your `.env` file with the following:

```env
# Email Configuration (for OTP and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Argument Graph

# OTP Configuration
OTP_EXPIRES_IN=10
OTP_LENGTH=6
```

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### Custom SMTP
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

## Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server hostname | Required |
| `EMAIL_PORT` | SMTP server port | Required |
| `EMAIL_SECURE` | Use SSL/TLS (true for port 465) | false |
| `EMAIL_USER` | SMTP username | Required |
| `EMAIL_PASS` | SMTP password/app password | Required |
| `EMAIL_FROM` | From email address | Required |
| `EMAIL_FROM_NAME` | From name | "Argument Graph" |
| `OTP_EXPIRES_IN` | OTP expiration in minutes | 10 |
| `OTP_LENGTH` | OTP code length | 6 |

## Network Troubleshooting for SMTP Issues

### Quick Fix: Enable Email Simulation Mode

If you're having persistent network issues, you can enable email simulation mode for development:

```env
# In your .env file
SIMULATE_EMAIL=true
```

This will simulate email sending without actually connecting to SMTP servers, allowing you to test the forgot password flow.

### SMTP Connection Issues

#### Error: `connect ETIMEDOUT`
This indicates network connectivity problems. Try these solutions in order:

1. **Try Gmail with SSL (Port 465)**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   ```

2. **Check Network/Firewall**
   - Corporate networks often block SMTP ports
   - Try from a different network (mobile hotspot)
   - Contact your IT department about SMTP access

3. **Try Alternative Ports**
   ```env
   # Try port 25 (if not blocked)
   EMAIL_PORT=25
   EMAIL_SECURE=false
   
   # Or try port 2525 (some providers)
   EMAIL_PORT=2525
   EMAIL_SECURE=false
   ```

4. **Use Different Email Provider**
   ```env
   # Outlook/Hotmail
   EMAIL_HOST=smtp-mail.outlook.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   
   # Yahoo
   EMAIL_HOST=smtp.mail.yahoo.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   ```

#### Error: `Authentication failed`
1. **For Gmail**: Use App Password, not regular password
2. **Enable 2FA** on your Gmail account first
3. **Generate App Password** in Google Account settings
4. **Check credentials** are correct in .env file

#### Error: `Connection refused`
1. **Check SMTP host** and port settings
2. **Verify email provider** supports SMTP
3. **Try different ports** (587, 465, 25, 2525)

### Testing Email Configuration

#### Method 1: Use Simulation Mode
```env
SIMULATE_EMAIL=true
```
Then test the forgot password endpoint - it will log email details to console.

#### Method 2: Test with Different Providers
Try these email services in order of reliability:

1. **Gmail with SSL**
2. **Outlook/Hotmail**
3. **Yahoo Mail**
4. **SendGrid** (requires API key)
5. **Mailgun** (requires API key)

## Forgot Password Flow

### 1. Request Password Reset
```bash
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 2. Verify OTP
```bash
POST /api/v1/auth/verify-reset-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

### 3. Reset Password
```bash
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewPassword123"
}
```

## Security Features

- **Rate Limiting**: All endpoints are rate-limited to prevent abuse
- **OTP Expiration**: OTPs expire after 10 minutes (configurable)
- **Attempt Limiting**: Maximum 5 attempts per OTP
- **Token Expiration**: Reset tokens expire after 15 minutes
- **Email Validation**: Proper email format validation
- **Password Strength**: Strong password requirements
- **Automatic Cleanup**: Expired OTPs are automatically cleaned up

## Troubleshooting

### Common Issues

1. **"Email service not configured"**
   - Check that all required environment variables are set
   - Verify EMAIL_HOST, EMAIL_USER, EMAIL_PASS are not empty

2. **"nodemailer.createTransporter is not a function"**
   - This was a typo in the code (should be `createTransport`)
   - Fixed in the latest version

3. **"Authentication failed"**
   - For Gmail: Use App Password, not regular password
   - Verify 2FA is enabled for Gmail
   - Check username/password are correct

4. **"Connection timeout" or "ETIMEDOUT"**
   - Check EMAIL_HOST and EMAIL_PORT
   - Verify firewall/network settings allow SMTP connections
   - Try different ports (587, 465, 25)
   - Some corporate networks block SMTP - try from a different network
   - For Gmail, ensure "Less secure app access" is not needed (use App Passwords instead)

5. **"Invalid OTP"**
   - Check OTP hasn't expired (10 minutes default)
   - Verify correct email address
   - Check for typos in OTP code

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages in the console.

## Production Considerations

1. **Use Environment Variables**: Never commit email credentials to code
2. **Monitor Usage**: Track OTP generation and usage
3. **Rate Limiting**: Implement additional rate limiting if needed
4. **Email Templates**: Customize email templates for your brand
5. **Backup Provider**: Consider having a backup email service
6. **Monitoring**: Set up alerts for email delivery failures

## Email Templates

The system includes responsive HTML email templates:

- **OTP Verification**: Professional template with security warnings
- **Password Reset Success**: Confirmation email after successful reset

Templates are automatically generated and include:
- Responsive design for mobile devices
- Security warnings and best practices
- Branded styling (customizable)
- Clear call-to-action buttons