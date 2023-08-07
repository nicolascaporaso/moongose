import TicketManager from '../DAO/mongo/ticketManagerMongoDB.js';
import CartManager from '../DAO/mongo/cartManagerMongoDB.js';
import ProductManager from '../DAO/mongo/prouctManagerMongoDB.js';

class TcktService {
    async createTicket(cId) {
        try {
            // Obtener el carrito por su ID (cId)
            const cart = await CartManager.getById(cId);
            const ticketProducts = []; // Arreglo para guardar los productos que se pueden comprar
            let cartupdate =[];
            let totalCost = 0 ;

            for (const cartItem of cart.idProducts) {
                const product = await ProductManager.getOne({ _id: cartItem.idProduct._id });
                if (product.stock >= cartItem.quantity) {
                    product.stock -= cartItem.quantity;
                    totalCost += (product.price * cartItem.quantity);
                    const id = cartItem.idProduct._id.toString();
                    ticketProducts.push({ product: product.title, quantity: cartItem.quantity });
                    await ProductManager.updateOne(id, product.description, product.title, product.code, product.price, product.stock, product.status, product.thumbnails);
                    cartupdate = await CartManager.removeProductFromCart(cId,id);
                } else {
                    console.log(`No hay suficiente stock para el producto ${product.title}`);
                }
            }

            if (ticketProducts.length > 0) {
                const code = cart._id.toString()
                
                const ticketData = {
                    code: code,
                    purchase_datetime: new Date(),
                    amount: totalCost,
                    purchaser: 'comprador', 
                    idProducts: ticketProducts ,
                };

                console.log(ticketData);

                const createdTicket = await TicketManager.createTicket(ticketData);
                return createdTicket; 
                
            } else {
                return null; 
            }

        } catch (error) {
            console.log(error);
            throw new Error("Ha ocurrido un error");
        }
    }
}

const TicketService = new TcktService();
export default TicketService;