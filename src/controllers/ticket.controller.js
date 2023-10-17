import TicketService from '../services/ticket.service.js';

class TicketController{
    async purchase (req, res) {
        const cId = req.params.cid;
        try {
            const ticket = await TicketService.createTicket(cId);
            return res.status(201).json(ticket);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'error general' })
        }
    };
}

export const ticketController = new TicketController();