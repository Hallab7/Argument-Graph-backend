import User from '../users/user.model.js';
import bcrypt from 'bcrypt';
import { signToken, verifyToken } from '../../utils/jwt.js';
import { ApiError } from '../../utils/ApiError.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId, isCloudinaryConfigured } from '../../config/cloudinary.js';

export class AuthService {
  static async register(userData) {
    const { email, username, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw ApiError.conflict('Email already registered');
      }
      if (existingUser.username === username) {
        throw ApiError.conflict('Username already taken');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      username,
      password: hashedPassword
    });

    // Generate token
    const token = signToken(user._id);

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      token
    };
  }

  static async login(credentials) {
    const { email, password } = credentials;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = signToken(user._id);

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      token
    };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  static async updateProfile(userId, updateData, avatarFile = null) {
    const { username } = updateData;

    // Check if new username already exists
    if (username) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        username: username
      });

      if (existingUser) {
        throw ApiError.conflict('Username already taken');
      }
    }

    // Handle avatar upload if provided
    let avatarUpdate = {};
    if (avatarFile) {
      try {
        // Check if Cloudinary is configured
        if (!isCloudinaryConfigured()) {
          throw ApiError.badRequest('Avatar upload is not available. Image service is not configured.');
        }

        // Get current user to check for existing avatar
        const currentUser = await User.findById(userId).select('+avatar_public_id');
        
        // Delete existing avatar if it exists
        if (currentUser.avatar_public_id) {
          try {
            await deleteFromCloudinary(currentUser.avatar_public_id);
          } catch (error) {
            console.warn('Failed to delete existing avatar:', error.message);
          }
        }

        // Upload new avatar to Cloudinary
        const uploadResult = await uploadToCloudinary(avatarFile.buffer, {
          public_id: `user_${userId}_${Date.now()}`,
          folder: 'argument-graph/avatars'
        });

        avatarUpdate = {
          avatar_url: uploadResult.secure_url,
          avatar_public_id: uploadResult.public_id
        };
      } catch (error) {
        console.error('Avatar upload error:', error);
        
        if (error instanceof ApiError) {
          throw error;
        }
        
        throw ApiError.internal('Failed to upload avatar');
      }
    }

    // Combine username and avatar updates
    const finalUpdateData = {
      ...updateData,
      ...avatarUpdate
    };

    // Remove email from update data if it exists (security measure)
    delete finalUpdateData.email;

    const user = await User.findByIdAndUpdate(
      userId,
      finalUpdateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  static async uploadAvatar(userId, fileBuffer) {
    try {
      // Check if Cloudinary is configured
      if (!isCloudinaryConfigured()) {
        throw ApiError.badRequest('Avatar upload is not available. Image service is not configured.');
      }

      // Get current user to check for existing avatar
      const user = await User.findById(userId).select('+avatar_public_id');
      
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      // Delete existing avatar if it exists
      if (user.avatar_public_id) {
        try {
          await deleteFromCloudinary(user.avatar_public_id);
        } catch (error) {
          console.warn('Failed to delete existing avatar:', error.message);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new avatar to Cloudinary
      const uploadResult = await uploadToCloudinary(fileBuffer, {
        public_id: `user_${userId}_${Date.now()}`, // Unique public ID
        folder: 'argument-graph/avatars'
      });

      // Update user with new avatar URL and public ID
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          avatar_url: uploadResult.secure_url,
          avatar_public_id: uploadResult.public_id
        },
        { new: true, runValidators: true }
      );

      return {
        avatar_url: updatedUser.avatar_url,
        message: 'Avatar uploaded successfully'
      };

    } catch (error) {
      console.error('Avatar upload error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw ApiError.internal('Failed to upload avatar');
    }
  }

  static async removeAvatar(userId) {
    try {
      // Get current user to check for existing avatar
      const user = await User.findById(userId).select('+avatar_public_id');
      
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      if (!user.avatar_url) {
        throw ApiError.badRequest('No avatar to remove');
      }

      // Delete avatar from Cloudinary if public_id exists and Cloudinary is configured
      if (user.avatar_public_id) {
        try {
          await deleteFromCloudinary(user.avatar_public_id);
        } catch (error) {
          console.warn('Failed to delete avatar from Cloudinary:', error.message);
          // Continue with database update even if Cloudinary deletion fails
        }
      }

      // Remove avatar URL and public ID from user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $unset: {
            avatar_url: 1,
            avatar_public_id: 1
          }
        },
        { new: true }
      );

      return {
        message: 'Avatar removed successfully'
      };

    } catch (error) {
      console.error('Avatar removal error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw ApiError.internal('Failed to remove avatar');
    }
  }

  static async changePassword(userId, passwords) {
    const { currentPassword, newPassword } = passwords;

    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      throw ApiError.unauthorized('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }
}