import { Router } from 'express';
import {
  checkFallacies,
  factCheck,
  summarize,
  suggestCounter
} from './ai.controller.js';

const router = Router();

/**
 * @swagger
 * /ai/check-fallacies:
 *   post:
 *     summary: Check text for logical fallacies
 *     tags: [AI Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to analyze for fallacies
 *     responses:
 *       200:
 *         description: Fallacy analysis results
 */
router.post('/check-fallacies', checkFallacies);

/**
 * @swagger
 * /ai/fact-check:
 *   post:
 *     summary: Fact-check claims in text
 *     tags: [AI Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text containing claims to fact-check
 *     responses:
 *       200:
 *         description: Fact-check results
 */
router.post('/fact-check', factCheck);

/**
 * @swagger
 * /ai/summarize:
 *   post:
 *     summary: Summarize debate or argument content
 *     tags: [AI Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content to summarize
 *               maxLength:
 *                 type: integer
 *                 default: 200
 *                 description: Maximum summary length in words
 *               style:
 *                 type: string
 *                 enum: [brief, detailed, bullet_points]
 *                 default: brief
 *                 description: Summary style
 *     responses:
 *       200:
 *         description: Summary generated successfully
 */
router.post('/summarize', summarize);

/**
 * @swagger
 * /ai/suggest-counter:
 *   post:
 *     summary: Suggest counter-arguments
 *     tags: [AI Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [argument]
 *             properties:
 *               argument:
 *                 type: string
 *                 description: Argument to generate counter-arguments for
 *               context:
 *                 type: string
 *                 description: Additional context about the debate topic
 *               maxSuggestions:
 *                 type: integer
 *                 default: 3
 *                 description: Maximum number of counter-arguments to suggest
 *     responses:
 *       200:
 *         description: Counter-arguments generated successfully
 */
router.post('/suggest-counter', suggestCounter);

export default router;