# AI Service Integration Setup

## Overview
The Argument Graph backend now includes real AI service integration using OpenAI's GPT models for:
- Logical fallacy detection
- Fact-checking
- Content summarization
- Counter-argument generation
- Argument strength analysis

## Setup Instructions

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the API key (starts with `sk-`)

### 2. Configure Environment Variables
1. Open the `.env` file in the backend root directory
2. Replace `your-openai-api-key-here` with your actual OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Test the Integration
1. Start the server: `npm run dev`
2. Test the AI service: `GET http://localhost:5000/api/v1/ai/test`
3. Expected response when configured correctly:
   ```json
   {
     "success": true,
     "data": {
       "configured": true,
       "message": "OpenAI connection successful",
       "model": "gpt-3.5-turbo"
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
1. **API Key Not Configured**: Returns 503 Service Unavailable
2. **Invalid API Key**: Returns 500 Internal Server Error
3. **Rate Limit Exceeded**: Returns 500 with quota error message
4. **Text Too Short**: Returns 400 Bad Request

### Fallback Behavior:
- When OpenAI is not configured, endpoints return appropriate error messages
- No placeholder/mock responses are returned in production
- All errors include detailed messages for debugging

## Cost Considerations

### Token Usage:
- Fallacy detection: ~500-1000 tokens per request
- Fact checking: ~800-1200 tokens per request
- Summarization: ~400-800 tokens per request
- Counter-arguments: ~1000-1500 tokens per request

### Estimated Costs (GPT-3.5-turbo):
- Input: $0.0015 per 1K tokens
- Output: $0.002 per 1K tokens
- Average cost per request: $0.002-$0.005

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
- Uses `gpt-3.5-turbo` for cost efficiency
- Detailed error messages for debugging
- No request caching

### Production Recommendations:
- Consider upgrading to `gpt-4` for better accuracy
- Implement request caching for repeated queries
- Set up monitoring and alerting
- Configure backup AI providers if needed