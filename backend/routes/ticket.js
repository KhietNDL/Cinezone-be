const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BookingId:
 *                 type: string
 *               SeatId:
 *                 type: string
 *               TotalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ticket created
 *       500:
 *         description: Internal server error
 */
router.post('/', ticketController.createTicket);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: A list of tickets
 *       500:
 *         description: Internal server error
 */
router.get('/', ticketController.getAllTickets);
/**
 * @swagger
 * /api/tickets/{ticketId}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A ticket object
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.get('/:ticketId', ticketController.getTicketById);

/**
 * @swagger
 * /api/tickets/booking/{bookingId}:
 *   get:
 *     summary: Get tickets by Booking ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tickets for the given booking ID
 *       404:
 *         description: No tickets found for this booking ID
 *       500:
 *         description: Internal server error
 */
router.get('/booking/:bookingId', ticketController.getTicketsByBookingId);

// Cập nhật ticket
/**
 * @swagger
 * /api/tickets/{ticketId}:
 *   put:
 *     summary: Update a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BookingId:
 *                 type: string
 *               SeatId:
 *                 type: string
 *               TotalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.put('/:ticketId', ticketController.updateTicket);
// Xóa ticket
/**
 * @swagger
 * /api/tickets/{ticketId}:
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:ticketId', ticketController.deleteTicket);


module.exports = router;
