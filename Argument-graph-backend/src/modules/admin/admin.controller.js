import { AdminService } from './admin.service.js';
import { ApiResponse, sendResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

// User Management Controllers
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const result = await AdminService.getAllUsers(page, limit, search, sortBy, sortOrder);
    
    const response = ApiResponse.success(
      result,
      'Users retrieved successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const result = await AdminService.getUserById(userId);
    
    const response = ApiResponse.success(
      result,
      'User details retrieved successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!role) {
      return next(ApiError.badRequest('Role is required'));
    }
    
    const user = await AdminService.updateUserRole(userId, role);
    
    const response = ApiResponse.success(
      { user },
      'User role updated successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const result = await AdminService.toggleUserStatus(userId);
    
    const response = ApiResponse.success(
      result,
      result.message
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const result = await AdminService.deleteUser(userId);
    
    const response = ApiResponse.success(
      result,
      'User deleted successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Content Management Controllers
export const getAllDebates = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '', search = '' } = req.query;
    
    const result = await AdminService.getAllDebates(page, limit, status, search);
    
    const response = ApiResponse.success(
      result,
      'Debates retrieved successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const updateDebateStatus = async (req, res, next) => {
  try {
    const { debateId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return next(ApiError.badRequest('Status is required'));
    }
    
    const debate = await AdminService.updateDebateStatus(debateId, status, req.userId);
    
    const response = ApiResponse.success(
      { debate },
      'Debate status updated successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const deleteDebate = async (req, res, next) => {
  try {
    const { debateId } = req.params;
    
    const result = await AdminService.deleteDebate(debateId);
    
    const response = ApiResponse.success(
      result,
      'Debate deleted successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// System Statistics Controller
export const getSystemStats = async (req, res, next) => {
  try {
    const stats = await AdminService.getSystemStats();
    
    const response = ApiResponse.success(
      stats,
      'System statistics retrieved successfully'
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Bulk Operations Controller
export const bulkUpdateUsers = async (req, res, next) => {
  try {
    const { userIds, updateData } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return next(ApiError.badRequest('userIds array is required'));
    }
    
    if (!updateData || typeof updateData !== 'object') {
      return next(ApiError.badRequest('updateData object is required'));
    }
    
    const result = await AdminService.bulkUpdateUsers(userIds, updateData);
    
    const response = ApiResponse.success(
      result,
      result.message
    );
    
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};