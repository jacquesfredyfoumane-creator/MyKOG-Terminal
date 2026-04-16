const express = require('express');
const router = express.Router();
const {
  createCalendarEvent,
  getAllCalendarEvents,
  getEventsByYear,
  getCalendarEventById,
  updateCalendarEvent,
  deleteCalendarEvent,
} = require('../controllers/calendarController');

/**
 * @openapi
 * /api/calendar:
 *   get:
 *     summary: Récupérer tous les événements du calendrier
 *     tags: [Calendrier]
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarEvent'
 */
router.get('/', getAllCalendarEvents);

/**
 * @openapi
 * /api/calendar/year/{year}:
 *   get:
 *     summary: Recuperer les evenements d'une annee
 *     tags: [Calendrier]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Annee desiree (ex: 2024)"
 *     responses:
 *       200:
 *         description: Evenements de l'annee
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarEvent'
 */
router.get('/year/:year', getEventsByYear);

/**
 * @openapi
 * /api/calendar/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags: [Calendrier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Événement trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarEvent'
 *       404:
 *         description: Événement non trouvé
 */
router.get('/:id', getCalendarEventById);

/**
 * @openapi
 * /api/calendar:
 *   post:
 *     summary: Créer un nouvel événement
 *     tags: [Calendrier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [culte, priere, evenement, autre]
 *     responses:
 *       201:
 *         description: Événement créé
 */
router.post('/', createCalendarEvent);

/**
 * @openapi
 * /api/calendar/{id}:
 *   put:
 *     summary: Mettre à jour un événement
 *     tags: [Calendrier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarEvent'
 *     responses:
 *       200:
 *         description: Événement mis à jour
 */
router.put('/:id', updateCalendarEvent);

/**
 * @openapi
 * /api/calendar/{id}:
 *   delete:
 *     summary: Supprimer un événement
 *     tags: [Calendrier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Événement supprimé
 */
router.delete('/:id', deleteCalendarEvent);

module.exports = router;
