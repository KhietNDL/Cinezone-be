const Ticket = require('../models/ticket.model');

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.getAllTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTicketById = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const ticket = await Ticket.getTicketById(ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTicketsByBookingId = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const tickets = await Ticket.getTicketsByBookingId(bookingId);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const ticketId = await Ticket.createTicket(req.body);
    res.status(201).json({ ticketId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const success = await Ticket.updateTicket(ticketId, req.body);
    if (!success) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ message: 'Ticket updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const success = await Ticket.deleteTicket(ticketId);
    if (!success) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  getTicketsByBookingId,
  createTicket,
  updateTicket,
  deleteTicket
};

