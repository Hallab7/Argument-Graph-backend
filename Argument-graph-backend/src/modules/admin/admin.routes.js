import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAllDebates,
  updateDebateStatus,
  deleteDebate,
  getSystemStats,
  bulkUpdateUsers
} from './admin.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import adminMiddleware from '../../middlewares/admin.middleware.js';

const router = Router();

// Apply auth and admin middleware to ALL admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminUserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, moderator, admin]
 *         isActive:
 *           type: boolean
 *         reputation:
 *           type: number
 *         verified:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     AdminDebateResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         creator:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *         status:
 *           type: string
 *           enum: [active, closed, archived]
 *         argumentCount:
 *           type: number
 *         viewCount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *     
 *     SystemStats:
 *       type: object
 *       properties:
 *         overview:
 *           type: object
 *           properties:
 *             totalUsers:
 *               type: number
 *             activeUsers:
 *               type: number
 *             totalDebates:
 *               type: number
 *             activeDebates:
 *               type: number
 *             totalArguments:
 *               type: number
 *             totalRatings:
 *               type: number
 *             totalConnections:
 *               type: number
 *         distributions:
 *           type: object
 *           properties:
 *             userRoles:
 *               type: object
 *             debateStatuses:
 *               type: object
 *         recent:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminUserResponse'
 *             debates:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminDebateResponse'
 */

// System Statistics (admin only)
/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get system statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SystemStats'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', getSystemStats);

// User Management Routes (admin only)
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users with pagination and search
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by username or email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AdminUserResponse'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: number
 *                         totalPages:
 *                           type: number
 *                         totalUsers:
 *                           type: number
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *       403:
 *         description: Admin access required
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /admin/users/{userId}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/AdminUserResponse'
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         debates:
 *                           type: number
 *                         arguments:
 *                           type: number
 *                         ratings:
 *                           type: number
 *       404:
 *         description: User not found
 */
router.get('/users/:userId', getUserById);

/**
 * @swagger
 * /admin/users/{userId}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, moderator, admin]
 *                 description: New role for the user
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/AdminUserResponse'
 *       400:
 *         description: Invalid role
 *       404:
 *         description: User not found
 */
router.put('/users/:userId/role', updateUserRole);

/**
 * @swagger
 * /admin/users/{userId}/toggle-status:
 *   put:
 *     summary: Toggle user active status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/AdminUserResponse'
 *                     message:
 *                       type: string
 *       404:
 *         description: User not found
 */
router.put('/users/:userId/toggle-status', toggleUserStatus);

/**
 * @swagger
 * /admin/users/{userId}:
 *   delete:
 *     summary: Delete user account (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                     deletedData:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: boolean
 *                         debates:
 *                           type: number
 *                         arguments:
 *                           type: number
 *                         ratings:
 *                           type: number
 *                         connections:
 *                           type: number
 *       403:
 *         description: Cannot delete admin users
 *       404:
 *         description: User not found
 */
router.delete('/users/:userId', deleteUser);

// Content Management Routes (admin only)
/**
 * @swagger
 * /admin/debates:
 *   get:
 *     summary: Get all debates with pagination and filtering
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of debates per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, closed, archived]
 *         description: Filter by debate status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *     responses:
 *       200:
 *         description: Debates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     debates:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AdminDebateResponse'
 *                     pagination:
 *                       type: object
 *       403:
 *         description: Admin access required
 */
router.get('/debates', getAllDebates);

/**
 * @swagger
 * /admin/debates/{debateId}/status:
 *   put:
 *     summary: Update debate status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: debateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Debate ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, closed, archived]
 *                 description: New status for the debate
 *     responses:
 *       200:
 *         description: Debate status updated successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Debate not found
 */
router.put('/debates/:debateId/status', updateDebateStatus);

/**
 * @swagger
 * /admin/debates/{debateId}:
 *   delete:
 *     summary: Delete debate and all related content
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: debateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Debate ID
 *     responses:
 *       200:
 *         description: Debate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     deletedData:
 *                       type: object
 *                       properties:
 *                         debate:
 *                           type: boolean
 *                         arguments:
 *                           type: number
 *                         connections:
 *                           type: number
 *                         ratings:
 *                           type: number
 *       404:
 *         description: Debate not found
 */
router.delete('/debates/:debateId', deleteDebate);

// Bulk Operations (admin only)
/**
 * @swagger
 * /admin/users/bulk-update:
 *   put:
 *     summary: Bulk update multiple users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userIds, updateData]
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs to update
 *               updateData:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     enum: [user, moderator, admin]
 *                   isActive:
 *                     type: boolean
 *                 description: Fields to update
 *     responses:
 *       200:
 *         description: Users updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     modifiedCount:
 *                       type: number
 *       400:
 *         description: Invalid request data
 */
router.put('/users/bulk-update', bulkUpdateUsers);

export default router;