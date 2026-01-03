# AI Service Integration Setup

## Overview
The Argument Graph backend now includes real AI service integration with **Google Gemini** as the primary provider and **OpenAI** as a fallback option. The system provides:
- Logical fallacy detection
- Fact-checking
- Content summarization
- Counter-argument generation
- Argument strength analysis

## AI Provider Priority
1. **Primary**: Google Gemini (generous free tier - 15 requests/minute, 1500/day)
2. **Fallback**: OpenAI GPT-3.5-turbo (if Gemini fails and OpenAI is configured)

## Setup Instructions

### Option 1: Google Gemini (Recommended - Free Tier Available)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Add to `.env` file:
   ```
   GEMINI_API_KEY=your-actual-gemini-api-key-here
   ```

### Option 2: OpenAI (Fallback/Alternative)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Add to `.env` file:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### Option 3: Both (Recommended for Production)
Configure both for maximum reliability:
```
GEMINI_API_KEY=your-actual-gemini-api-key-here
OPENAI_API_KEY=sk-your-actual-api-key-here
```

## Test the Integration
1. Start the server: `npm run dev`
2. Test the AI service: `GET http://localhost:5000/api/v1/ai/test`
3. Expected response when Gemini is configured:
   ```json
   {
     "success": true,
     "data": {
       "primaryProvider": "gemini",
       "availableProviders": ["gemini"],
       "results": {
         "gemini": {
           "configured": true,
           "message": "Gemini connection successful"
         }
       },
       "configured": true
     }
   }
   ```

## Available AI Endpoints

### 1. Test Connection
- **URL**: `GET /api/v1/ai/test`
- **Description**: Test if OpenAI service is properly configured

### 2. Fallacy Detection
- **URL**: `POST /api/v1/ai/check-fallacies`
- **Body**: `{ "text": "Your argument text here" }`
- **Description**: Analyze text for logical fallacies

### 3. Fact Checking
- **URL**: `POST /api/v1/ai/fact-check`
- **Body**: `{ "text": "Text with factual claims" }`
- **Description**: Verify factual claims in the text

### 4. Summarization
- **URL**: `POST /api/v1/ai/summarize`
- **Body**: 
  ```json
  {
    "content": "Long content to summarize",
    "maxLength": 200,
    "style": "brief"
  }
  ```
- **Description**: Generate summaries of debate content

### 5. Counter-Arguments
- **URL**: `POST /api/v1/ai/suggest-counter`
- **Body**: 
  ```json
  {
    "argument": "Original argument",
    "context": "Additional context",
    "maxSuggestions": 3
  }
  ```
- **Description**: Generate counter-arguments

## Error Handling

### Common Errors:
1. **No AI Provider Configured**: Returns 503 Service Unavailable
2. **Invalid API Key**: Returns 500 Internal Server Error
3. **Rate Limit Exceeded**: Automatically falls back to secondary provider if available
4. **Text Too Short**: Returns 400 Bad Request
5. **JSON Parse Error**: Automatically retries with JSON extraction

### Fallback Behavior:
- **Primary**: Gemini is tried first if configured
- **Fallback**: OpenAI is used if Gemini fails and OpenAI is configured
- **Graceful Degradation**: Detailed error messages when both providers fail
- **No Mock Data**: Real AI responses only, no placeholder data in production

## Cost Considerations

### Google Gemini (Free Tier):
- **Free Quota**: 15 requests per minute, 1500 requests per day
- **Rate Limits**: Very generous for development and small-scale production
- **Cost**: $0 for free tier usage
- **Paid Tiers**: Available for higher usage needs

### OpenAI GPT-3.5-turbo (Fallback):
- **Token Usage**: ~500-1500 tokens per request
- **Costs**: $0.0015 per 1K input tokens, $0.002 per 1K output tokens
- **Average cost per request**: $0.002-$0.005

### Recommended Strategy:
1. **Development**: Use Gemini free tier
2. **Production**: Configure both for reliability
3. **High Volume**: Consider Gemini paid tiers (more cost-effective than OpenAI)

## Security Notes

1. **API Key Security**: Never commit your actual API key to version control
2. **Rate Limiting**: The backend includes rate limiting to prevent abuse
3. **Input Validation**: All inputs are validated before sending to OpenAI
4. **Error Handling**: Sensitive information is not exposed in error messages

## Monitoring

### Logs:
- All AI service calls are logged with timestamps
- Token usage is tracked in response metadata
- Errors are logged with full stack traces

### Metrics to Monitor:
- API response times
- Token usage per endpoint
- Error rates
- Rate limit hits

## Development vs Production

### Development:
- **Primary**: Gemini free tier (perfect for development)
- **Fallback**: OpenAI if needed
- **Detailed error messages** for debugging
- **No request caching**

### Production Recommendations:
- **Configure both providers** for maximum reliability
- **Monitor rate limits** and usage patterns
- **Implement request caching** for repeated queries
- **Set up monitoring and alerting**
- **Consider Gemini paid tiers** for higher volume needs

## Getting Started Quickly

### Fastest Setup (Free):
1. Get Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add `GEMINI_API_KEY=your-key-here` to `.env`
3. Restart server
4. Test with `GET /api/v1/ai/test`
5. Start using AI endpoints immediately!

### For Maximum Reliability:
1. Get both Gemini and OpenAI API keys
2. Configure both in `.env`
3. System will use Gemini primarily, OpenAI as fallback
4. Enjoy 99.9% uptime for AI features