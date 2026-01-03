import { AIService } from './ai.service.js';
import { ApiResponse, sendResponse } from '../../utils/ApiResponse.js';
import { testOpenAIConnection } from '../../config/openai.js';

export const testAIService = async (req, res, next) => {
  try {
    const result = await testOpenAIConnection();
    
    const response = ApiResponse.success(
      result,
      'AI service test completed'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const checkFallacies = async (req, res, next) => {
  try {
    const result = await AIService.checkFallacies(req.body.text);
    
    const response = ApiResponse.success(
      result,
      'Fallacy analysis completed'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const factCheck = async (req, res, next) => {
  try {
    const result = await AIService.factCheck(req.body.text);
    
    const response = ApiResponse.success(
      result,
      'Fact-check analysis completed'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const summarize = async (req, res, next) => {
  try {
    const { content, maxLength, style } = req.body;
    const result = await AIService.summarize(content, { maxLength, style });
    
    const response = ApiResponse.success(
      result,
      'Content summarized successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const suggestCounter = async (req, res, next) => {
  try {
    const { argument, context, maxSuggestions } = req.body;
    const result = await AIService.suggestCounter(argument, { context, maxSuggestions });
    
    const response = ApiResponse.success(
      result,
      'Counter-arguments generated successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};