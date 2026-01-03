import { ApiError } from '../../utils/ApiError.js';
import { getOpenAIClient, isOpenAIConfigured } from '../../config/openai.js';
import { 
  FALLACY_DETECTION_PROMPT, 
  FACT_CHECK_PROMPT, 
  SUMMARIZATION_PROMPT, 
  COUNTER_ARGUMENT_PROMPT, 
  ARGUMENT_STRENGTH_PROMPT,
  formatPrompt 
} from '../../utils/aiPrompts.js';

export class AIService {
  static async checkFallacies(text) {
    if (!text || text.trim().length < 10) {
      throw ApiError.badRequest('Text must be at least 10 characters long');
    }

    if (!isOpenAIConfigured()) {
      throw ApiError.serviceUnavailable('AI service is not configured. Please set OPENAI_API_KEY.');
    }

    try {
      const client = getOpenAIClient();
      const prompt = formatPrompt(FALLACY_DETECTION_PROMPT, { text });

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in logical reasoning and critical thinking. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      const aiResponse = JSON.parse(response.choices[0].message.content);
      const fallacies = aiResponse.fallacies || [];

      return {
        text,
        fallacies: fallacies.map(fallacy => ({
          type: fallacy.type,
          confidence: fallacy.confidence,
          explanation: fallacy.explanation,
          textExcerpt: fallacy.text_excerpt,
          location: { start: 0, end: text.length } // Could be enhanced with actual position detection
        })),
        analysis: {
          totalFallacies: fallacies.length,
          averageConfidence: fallacies.length > 0 
            ? fallacies.reduce((sum, f) => sum + f.confidence, 0) / fallacies.length 
            : 0,
          analyzedAt: new Date(),
          model: response.model,
          tokensUsed: response.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('OpenAI fallacy detection error:', error);
      if (error.message.includes('JSON')) {
        throw ApiError.internalError('Failed to parse AI response. Please try again.');
      }
      throw ApiError.internalError(`AI service error: ${error.message}`);
    }
  }

  static async factCheck(text) {
    if (!text || text.trim().length < 10) {
      throw ApiError.badRequest('Text must be at least 10 characters long');
    }

    if (!isOpenAIConfigured()) {
      throw ApiError.serviceUnavailable('AI service is not configured. Please set OPENAI_API_KEY.');
    }

    try {
      const client = getOpenAIClient();
      const prompt = formatPrompt(FACT_CHECK_PROMPT, { text });

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a fact-checking expert. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.2
      });

      const aiResponse = JSON.parse(response.choices[0].message.content);
      const claims = aiResponse.claims || [];

      return {
        text,
        claims: claims.map(claim => ({
          claim: claim.claim,
          verdict: claim.verdict,
          confidence: claim.confidence,
          reasoning: claim.reasoning,
          sources: claim.suggested_sources?.map(source => ({
            title: source,
            url: null, // Would need additional API calls to find actual URLs
            reliability: 0.7 // Default reliability score
          })) || []
        })),
        summary: {
          totalClaims: claims.length,
          verifiableClaims: claims.filter(c => c.verdict !== 'unverifiable').length,
          trueClaims: claims.filter(c => c.verdict === 'true').length,
          falseClaims: claims.filter(c => c.verdict === 'false').length,
          analyzedAt: new Date(),
          model: response.model,
          tokensUsed: response.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('OpenAI fact-check error:', error);
      if (error.message.includes('JSON')) {
        throw ApiError.internalError('Failed to parse AI response. Please try again.');
      }
      throw ApiError.internalError(`AI service error: ${error.message}`);
    }
  }

  static async summarize(content, options = {}) {
    const { maxLength = 200, style = 'brief' } = options;

    if (!content || content.trim().length < 50) {
      throw ApiError.badRequest('Content must be at least 50 characters long');
    }

    if (!isOpenAIConfigured()) {
      throw ApiError.serviceUnavailable('AI service is not configured. Please set OPENAI_API_KEY.');
    }

    try {
      const client = getOpenAIClient();
      const prompt = formatPrompt(SUMMARIZATION_PROMPT, { 
        content, 
        maxLength, 
        style 
      });

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at summarizing content. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.min(1000, maxLength * 2),
        temperature: 0.3
      });

      const aiResponse = JSON.parse(response.choices[0].message.content);
      const summary = aiResponse.summary || '';
      const keyPoints = aiResponse.key_points || [];

      return {
        originalContent: content,
        summary,
        keyPoints,
        wordCount: summary.split(' ').length,
        compressionRatio: summary.split(' ').length / content.split(' ').length,
        style,
        analyzedAt: new Date(),
        model: response.model,
        tokensUsed: response.usage?.total_tokens || 0
      };
    } catch (error) {
      console.error('OpenAI summarization error:', error);
      if (error.message.includes('JSON')) {
        throw ApiError.internalError('Failed to parse AI response. Please try again.');
      }
      throw ApiError.internalError(`AI service error: ${error.message}`);
    }
  }

  static async suggestCounter(argument, options = {}) {
    const { context, maxSuggestions = 3 } = options;

    if (!argument || argument.trim().length < 20) {
      throw ApiError.badRequest('Argument must be at least 20 characters long');
    }

    if (!isOpenAIConfigured()) {
      throw ApiError.serviceUnavailable('AI service is not configured. Please set OPENAI_API_KEY.');
    }

    try {
      const client = getOpenAIClient();
      const prompt = formatPrompt(COUNTER_ARGUMENT_PROMPT, { 
        argument, 
        context: context || 'No additional context provided',
        maxSuggestions 
      });

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a skilled debater and critical thinker. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.4
      });

      const aiResponse = JSON.parse(response.choices[0].message.content);
      const counterArguments = aiResponse.counter_arguments || [];

      return {
        originalArgument: argument,
        context: context || null,
        counterArguments: counterArguments.map(ca => ({
          argument: ca.argument,
          strength: ca.strength,
          type: ca.type,
          supportingEvidence: ca.supporting_evidence || []
        })),
        metadata: {
          totalSuggestions: counterArguments.length,
          averageStrength: counterArguments.length > 0 
            ? counterArguments.reduce((sum, ca) => sum + ca.strength, 0) / counterArguments.length 
            : 0,
          analyzedAt: new Date(),
          model: response.model,
          tokensUsed: response.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('OpenAI counter-argument error:', error);
      if (error.message.includes('JSON')) {
        throw ApiError.internalError('Failed to parse AI response. Please try again.');
      }
      throw ApiError.internalError(`AI service error: ${error.message}`);
    }
  }

  static async analyzeArgumentStrength(argument) {
    if (!argument || argument.trim().length < 20) {
      throw ApiError.badRequest('Argument must be at least 20 characters long');
    }

    if (!isOpenAIConfigured()) {
      throw ApiError.serviceUnavailable('AI service is not configured. Please set OPENAI_API_KEY.');
    }

    try {
      const client = getOpenAIClient();
      const prompt = formatPrompt(ARGUMENT_STRENGTH_PROMPT, { argument });

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in argumentation and critical thinking. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.3
      });

      const aiResponse = JSON.parse(response.choices[0].message.content);

      const mockAnalysis = {
        overallStrength: aiResponse.overall_strength || 0.5,
        criteria: {
          logic: aiResponse.criteria_scores?.logic || 0.5,
          evidence: aiResponse.criteria_scores?.evidence || 0.5,
          relevance: aiResponse.criteria_scores?.relevance || 0.5,
          clarity: aiResponse.criteria_scores?.clarity || 0.5
        },
        strengths: aiResponse.strengths || [],
        weaknesses: aiResponse.weaknesses || [],
        suggestions: aiResponse.suggestions || []
      };

      return {
        argument,
        analysis: mockAnalysis,
        analyzedAt: new Date(),
        model: response.model,
        tokensUsed: response.usage?.total_tokens || 0
      };
    } catch (error) {
      console.error('OpenAI argument strength error:', error);
      if (error.message.includes('JSON')) {
        throw ApiError.internalError('Failed to parse AI response. Please try again.');
      }
      throw ApiError.internalError(`AI service error: ${error.message}`);
    }
  }
}