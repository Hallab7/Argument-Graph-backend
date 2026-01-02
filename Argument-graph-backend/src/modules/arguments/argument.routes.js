import { Router } from 'express';
import auth from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Argument:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Argument ID
 *         content:
 *           type: string
 *           description: Argument content
 *         type:
 *           type: string
 *           enum: [support, oppose, clarification]
 *           description: Argument type
 *         author:
 *           type: string
 *           description: User ID of argument author
 *         debate:
 *           type: string
 *           description: Debate ID this argument belongs to
 *         parentArgument:
 *           type: string
 *           description: Parent argument ID (for nested arguments)
 *         rating:
 *           type: object
 *           properties:
 *             average:
 *               type: number
 *             count:
 *               type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Rating:
 *       type: object
 *       properties:
 *         score:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating score (1-5)
 *         comment:
 *           type: string
 *           description: Optional rating comment
 */

/**
 * @swagger
 * /arguments/{id}/ratings:
 *   post:
 *     summary: Rate an argument
 *     tags: [Arguments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Argument ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       201:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rating submitted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Argument not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/ratings', auth, (req, res) => res.json({}));

/**
 * @swagger
 * /arguments/{id}/connections:
 *   post:
 *     summary: Create connection between arguments
 *     tags: [Arguments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Source argument ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetArgumentId, connectionType]
 *             properties:
 *               targetArgumentId:
 *                 type: string
 *                 description: Target argument ID
 *               connectionType:
 *                 type: string
 *                 enum: [supports, opposes, clarifies, builds_on]
 *                 description: Type of connection
 *               strength:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Connection strength (1-5)
 *     responses:
 *       201:
 *         description: Connection created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Connection created
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/connections', auth, (req, res) => res.json({}));

/**
 * @swagger
 * /arguments/{id}/analysis:
 *   get:
 *     summary: Get AI analysis of an argument
 *     tags: [Arguments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Argument ID
 *     responses:
 *       200:
 *         description: Argument analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fallacies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       confidence:
 *                         type: number
 *                       description:
 *                         type: string
 *                 strength:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: number
 *                     reasoning:
 *                       type: string
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Argument not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/analysis', auth, (req, res) => res.json({}));

export default router;