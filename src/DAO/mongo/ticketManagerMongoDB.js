import TicketModel from '../mongo/models/ticket.model.js'
import ProductModel from '../mongo/models/products.model.js'

class TcktManager {
    createTicket = async (ticket) => {
        const newTicket = await TicketModel.create(ticket);
            return newTicket;
    }
}

const TicketManager = new TcktManager();
export default TicketManager;
