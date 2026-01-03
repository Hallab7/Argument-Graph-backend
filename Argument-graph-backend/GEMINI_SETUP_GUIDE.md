# Quick Gemini API Setup Guide

## Why Gemini?
- **FREE TIER**: 15 requests per minute, 1500 requests per day
- **No Credit Card Required**: Unlike OpenAI, you can start immediately
- **High Quality**: Google's latest AI model with excellent performance
- **Cost Effective**: Much cheaper than OpenAI for paid usage

## Step-by-Step Setup (5 minutes)

### 1. Get Your Free API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account (any Gmail account works)
3. Click **"Create API Key"**
4. Copy the generated API key (starts with `AIza...`)

### 2. Add to Your Project
1. Open `Argument-graph-backend/.env`
2. Find the line: `GEMINI_API_KEY=your-gemini-api-key-here`
3. Replace with your actual key: `GEMINI_API_KEY=AIzaSyC...your-actual-key`
4. Save the file

### 3. Test It Works
1. Restart your server: `npm run dev`
2. Test the connection: 
   ```bash
   curl http://localhost:5000/api/v1/ai/test
   ```
3. You should see: `"primaryProvider": "gemini"` and `"configured": true`

### 4. Try an AI Feature
Test fallacy detection:
```bash
curl -X POST http://localhost:5000/api/v1/ai/check-fallacies \
  -H "Content-Type: application/json" \
  -d '{"text":"You are wrong because you are stupid"}'
```

## Free Tier Limits
- **15 requests per minute** - Perfect for development
- **1500 requests per day** - Great for small to medium apps
- **No expiration** - Free tier doesn't expire
- **No credit card** - Start using immediately

## What You Get
✅ **Logical Fallacy Detection** - Identify weak arguments  
✅ **Fact Checking** - Verify claims automatically  
✅ **Content Summarization** - Generate concise summaries  
✅ **Counter-Arguments** - Get opposing viewpoints  
✅ **Argument Analysis** - Evaluate argument strength  

## Troubleshooting

### "Gemini API key not configured"
- Check your `.env` file has the correct key
- Make sure there are no extra spaces
- Restart the server after changing `.env`

### "Rate limit exceeded"
- You've hit the 15 requests/minute limit
- Wait a minute and try again
- Consider upgrading to paid tier if needed

### "Invalid API key"
- Double-check you copied the full key from Google AI Studio
- Make sure the key starts with `AIza`
- Try generating a new key

## Next Steps
Once working, your AI features are ready! The system will:
1. Use Gemini for all AI requests (free tier)
2. Automatically fall back to OpenAI if you configure it
3. Handle errors gracefully
4. Provide detailed analytics

## Need Help?
- Check the main `AI_SETUP.md` for detailed documentation
- Test your setup with `GET /api/v1/ai/test`
- All endpoints are documented at `http://localhost:5000/api-docs`

**You're now ready to use AI-powered argument analysis! 🚀**