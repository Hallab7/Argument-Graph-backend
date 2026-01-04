# SMTP Connection Troubleshooting Guide

## Quick Solutions for Network Issues

### 1. Enable Email Simulation (Immediate Fix)
If you need to test the forgot password functionality immediately:

```env
# In .env file
SIMULATE_EMAIL=true
```

This will simulate email sending and log the email content to the console, allowing you to test the complete flow without SMTP.

### 2. Try Different Gmail Settings

#### Option A: Gmail with SSL (Port 465)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Option B: Gmail with TLS (Port 587)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Alternative Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

#### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@yahoo.com
```

## Common Error Solutions

### Error: `connect ETIMEDOUT`
**Cause:** Network/firewall blocking SMTP connections

**Solutions:**
1. **Try different port:** Change from 587 to 465 (or vice versa)
2. **Check firewall:** Corporate networks often block SMTP
3. **Try different network:** Use mobile hotspot to test
4. **Enable simulation mode:** Set `SIMULATE_EMAIL=true`

### Error: `Authentication failed`
**Cause:** Incorrect credentials or security settings

**Solutions:**
1. **Use App Password:** For Gmail, generate App Password in Google Account settings
2. **Enable 2FA:** Required for Gmail App Passwords
3. **Check credentials:** Verify email and password in .env file
4. **Try different provider:** Switch to Outlook or Yahoo

### Error: `Connection refused`
**Cause:** Incorrect SMTP settings

**Solutions:**
1. **Verify SMTP host:** Check provider's SMTP server address
2. **Try different ports:** 587, 465, 25, or 2525
3. **Check SSL/TLS settings:** Match secure setting with port

## Network-Specific Issues

### Corporate Networks
- Often block SMTP ports (25, 587, 465)
- May require proxy configuration
- Contact IT department for SMTP access
- Use simulation mode for development

### ISP Restrictions
- Some ISPs block outbound SMTP
- Try different ports or providers
- Use VPN to bypass restrictions
- Consider cloud-based email services

### Firewall/Antivirus
- May block SMTP connections
- Add exception for Node.js/your app
- Temporarily disable to test
- Check Windows Defender settings

## Testing Methods

### Method 1: Simulation Mode
```env
SIMULATE_EMAIL=true
```
- No network connection required
- Logs email content to console
- Perfect for development/testing
- Shows OTP codes in server logs

### Method 2: Different Email Provider
Try providers in this order:
1. Gmail with SSL (port 465)
2. Outlook (port 587)
3. Yahoo (port 587)
4. Local SMTP server (if available)

### Method 3: Cloud Email Services
Consider using:
- SendGrid
- Mailgun
- Amazon SES
- Postmark

## Production Recommendations

### For Development
```env
SIMULATE_EMAIL=true
NODE_ENV=development
```

### For Production
1. **Use reliable email service** (SendGrid, Mailgun)
2. **Set up monitoring** for email delivery
3. **Have backup provider** configured
4. **Monitor error rates** and timeouts
5. **Set appropriate timeouts** in email config

## Configuration Examples

### Robust Gmail Setup
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Your App Name

# Connection settings (already configured in code)
# connectionTimeout: 10000ms
# greetingTimeout: 5000ms
# socketTimeout: 10000ms
# maxRetries: 2
```

### SendGrid Setup (Recommended for Production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

## Debugging Steps

1. **Check server logs** for detailed error messages
2. **Test with simulation mode** first
3. **Verify credentials** are correct
4. **Try different ports/providers**
5. **Test from different network**
6. **Check firewall/antivirus settings**
7. **Contact email provider support**

## Emergency Fallback

If all else fails, you can temporarily disable email verification:

```javascript
// In auth.service.js - TEMPORARY ONLY
static async forgotPassword(email) {
  // Skip email sending in emergency
  if (process.env.EMERGENCY_MODE === 'true') {
    console.log(`Emergency mode: Password reset requested for ${email}`);
    return { message: 'Emergency mode: Contact administrator', sent: false };
  }
  // ... rest of the function
}
```

**Note:** Only use emergency mode for critical situations and implement proper email service as soon as possible.