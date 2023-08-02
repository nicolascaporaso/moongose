import TicketModel from '../models/ticket.model.js';
import ProductModel from '../models/ticket.model.js'

class TcktManager {
    createTicket = async (ticket) => {
        const newTicket = await TicketModel.create(ticket);
            
    }
}

const TicketManager = new TcktManager();
export default TicketManager;
