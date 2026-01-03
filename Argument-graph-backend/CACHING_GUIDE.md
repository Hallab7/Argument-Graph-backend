# AI Response Caching System

## Overview
The AI response caching system automatically caches AI-generated responses to avoid unnecessary token usage and improve response times. Identical requests return cached results instantly.

## ✅ Benefits
- **💰 Cost Savings**: Avoid duplicate AI API calls
- **⚡ Speed**: Cached responses return in ~2ms vs 2-4 seconds
- **📊 Efficiency**: Reduces load on AI providers
- **🔄 Smart**: Automatic cache management with TTL

## 🎯 How It Works

### Automatic Caching
All AI endpoints automatically cache responses based on:
- **Input text** (normalized and case-insensitive)
- **Endpoint type** (fallacies, fact-check, etc.)
- **Parameters** (maxLength, style, maxSuggestions, etc.)

### Cache Keys
Generated using SHA-256 hash of:
```javascript
{
  endpoint: "fallacies",
  input: "you are wrong because you are stupid",
  options: { maxSuggestions: 3 }
}
```

### Cache Levels
Different endpoints have different cache durations:

| Endpoint | Cache Duration | Reason |
|----------|---------------|---------|
| **Fallacy Detection** | 24 hours | Logical fallacies are stable |
| **Argument Strength** | 24 hours | Analysis criteria don't change |
| **Summarization** | 24 hours | Summary style is consistent |
| **Fact Checking** | 6 hours | Facts may evolve |
| **Counter Arguments** | 6 hours | Context may influence results |

## 🔧 Cache Management

### Check Cache Statistics
```bash
GET /api/v1/ai/cache/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalItems": 15,
    "maxSize": 1000,
    "expired": 2,
    "oldestItem": 1767460997933,
    "newestItem": 1767461234567
  }
}
```

### Clear Cache
```bash
POST /api/v1/ai/cache/clear
```

## 📊 Performance Impact

### Before Caching:
- **First Request**: ~3000ms + AI tokens
- **Duplicate Request**: ~3000ms + AI tokens
- **Total Cost**: 2x tokens

### After Caching:
- **First Request**: ~3000ms + AI tokens
- **Duplicate Request**: ~2ms + 0 tokens
- **Total Cost**: 1x tokens

## 🎯 Cache Hit Examples

### Example 1: Identical Text
```bash
# First request - Cache MISS
POST /api/v1/ai/check-fallacies
{"text": "You are wrong because you are stupid"}
# Response time: 3235ms

# Second request - Cache HIT
POST /api/v1/ai/check-fallacies  
{"text": "You are wrong because you are stupid"}
# Response time: 2ms
```

### Example 2: Case Insensitive
```bash
# These are treated as identical:
{"text": "Climate change is fake"}
{"text": "CLIMATE CHANGE IS FAKE"}
{"text": "climate change is fake"}
```

### Example 3: Parameter Sensitivity
```bash
# These are cached separately:
{"argument": "AI is dangerous", "maxSuggestions": 2}
{"argument": "AI is dangerous", "maxSuggestions": 3}
```

## 🔍 Cache Indicators

### Server Logs
```
💾 Cache MISS for fallacies: ai_cache:fallacies:c...
✅ Cached response for fallacies (TTL: 1440 minutes)

🎯 Cache HIT for fallacies: ai_cache:fallacies:c...
```

### Response Metadata
Cached responses include:
```json
{
  "meta": {
    "cached": true,
    "cacheKey": "ai_cache:fallacies:c...",
    "timestamp": "2026-01-03T17:24:02.207Z"
  }
}
```

## ⚙️ Configuration

### Cache Limits
- **Max Items**: 1000 cached responses
- **Auto Cleanup**: Removes oldest 20% when full
- **Memory Usage**: ~1-5MB depending on response sizes

### TTL Settings
```javascript
// Custom TTL based on confidence
dynamic: (req, data) => {
  if (data.data?.analysis?.averageConfidence > 0.8) {
    return 24 * 60 * 60 * 1000; // 24 hours for high confidence
  }
  return 6 * 60 * 60 * 1000; // 6 hours for low confidence
}
```

## 🚀 Production Recommendations

### For High Traffic:
1. **Use Redis**: Replace in-memory cache with Redis
2. **Increase Limits**: Raise maxCacheSize to 10,000+
3. **Monitor**: Set up cache hit rate monitoring
4. **Backup**: Persist cache across server restarts

### For Development:
- Current in-memory cache is perfect
- Monitor cache stats regularly
- Clear cache when testing new prompts

## 📈 Expected Savings

### Token Usage Reduction:
- **Fallacy Detection**: 70-90% reduction
- **Fact Checking**: 50-70% reduction  
- **Summarization**: 80-95% reduction
- **Counter Arguments**: 60-80% reduction

### Response Time Improvement:
- **Cache Hit**: 99.9% faster (2ms vs 3000ms)
- **User Experience**: Instant responses for repeated queries
- **Server Load**: Dramatically reduced AI API calls

## 🔧 Troubleshooting

### Cache Not Working?
1. Check server logs for cache messages
2. Verify identical input (case-insensitive)
3. Check if cache is full (auto-cleanup)
4. Verify TTL hasn't expired

### Clear Cache If:
- Testing new AI prompts
- Updating AI models
- Cache corruption suspected
- Memory usage too high

Your AI caching system is now active and saving tokens! 🎉