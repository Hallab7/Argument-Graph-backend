# Cloudinary Setup Guide

This guide will help you set up Cloudinary for avatar image uploads in the Argument Graph backend.

## 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. After registration, you'll be taken to your dashboard

## 2. Get Your Cloudinary Credentials

From your Cloudinary dashboard, you'll find:

- **Cloud Name**: Your unique cloud name (e.g., `dxyz123abc`)
- **API Key**: Your API key (e.g., `123456789012345`)
- **API Secret**: Your API secret (keep this secure!)

## 3. Update Your .env File

Replace the placeholder values in your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

## 4. Test the Configuration

Once you've updated your `.env` file and restarted your server, you can test avatar uploads using:

### Using curl:
```bash
curl -X POST http://localhost:5000/api/v1/auth/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@path/to/your/image.jpg"
```

### Using Postman:
1. Set method to POST
2. URL: `http://localhost:5000/api/v1/auth/avatar`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Body: form-data with key `avatar` and select your image file

## 5. Avatar Features

- **Supported formats**: JPEG, PNG, WebP
- **Maximum file size**: 5MB
- **Automatic optimization**: Images are automatically resized to 400x400px and optimized
- **Face detection**: Cropping focuses on faces when detected
- **Secure storage**: Images are stored securely on Cloudinary's CDN

## 6. API Endpoints

- `POST /api/v1/auth/avatar` - Upload avatar
- `DELETE /api/v1/auth/avatar` - Remove avatar
- Avatar URL is included in user profile responses

## 7. Folder Structure

Images are organized in Cloudinary as:
```
argument-graph/
  avatars/
    user_[userId]_[timestamp].jpg
```

## 8. Error Handling

The system handles various error scenarios:
- Invalid file types
- File size too large
- Cloudinary upload failures
- Missing configuration

## 9. Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 1,000 transformations per month

This should be sufficient for development and small-scale production use.