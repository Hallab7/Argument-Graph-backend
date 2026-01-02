import { Router } from 'express';
import auth from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Debate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Debate ID
 *         title:
 *           type: string
 *           description: Debate title
 *         description:
 *           type: string
 *           description: Debate description
 *         creator:
 *           type: string
 *           description: User ID of debate creator
 *         status:
 *           type: string
 *           enum: [active, closed, archived]
 *           description: Debate status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /debates:
 *   get:
 *     summary: Get all debates
 *     tags: [Debates]
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
 *           default: 10
 *         description: Number of debates per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, closed, archived]
 *         description: Filter by debate status
 *     responses:
 *       200:
 *         description: List of debates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Debate'
 */
router.get('/', (req, res) => res.json([]));

/**
 * @swagger
 * /debates:
 *   post:
 *     summary: Create a new debate
 *     tags: [Debates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Debate title
 *               description:
 *                 type: string
 *                 description: Debate description
 *     responses:
 *       201:
 *         description: Debate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Debate'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', auth, (req, res) => res.json({}));

/**
 * @swagger
 * /debates/{id}:
 *   get:
 *     summary: Get debate by ID
 *     tags: [Debates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Debate ID
 *     responses:
 *       200:
 *         description: Debate details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Debate'
 *       404:
 *         description: Debate not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res) => res.json({}));

/**
 * @swagger
 * /debates/{id}/graph:
 *   get:
 *     summary: Get debate argument graph
 *     tags: [Debates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Debate ID
 *     responses:
 *       200:
 *         description: Argument graph data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nodes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 edges:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Debate not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/graph', (req, res) => res.json({}));

export default router;