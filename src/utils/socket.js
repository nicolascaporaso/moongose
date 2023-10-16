import { Server } from 'socket.io';
import { MsgModel } from '../DAO/mongo/models/msg.model.js';
import logger from "../config/logger.js";

export default function connectSocket(httpServer) {

    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socket) => {
        logger.info("cliente conectado " + socket.id);

        socket.on('createProduct', async (pdata) => {
            try {
                const thumbnails = 'sin imagen';
                const {title, description, code, price, stock, status}= pdata
                const productCreated = await ProductSrvc.createOne(title, description, code, price, stock, status, thumbnails )        
                socket.emit("createProductOk", pdata);
            } catch (error) {
                console.log(error.message);
                socket.emit("createProductFail", error.message);
            }
        });

        socket.on('deleteProduct', async (id) => {
            try {
                const product = await myManager.deleteProduct(id);
                socket.emit("createProductOk", pdata);

            } catch (error) {
                console.log(error.message);
                socket.emit("createProductFail", error.message);
            }
        });

        socket.on('msg_front_to_back', async (msg) => {
            const msgCreated = await MsgModel.create(msg);
            const msgs = await MsgModel.find({});
            socketServer.emit('msg_back_to_front', msgs);
        });

    });
}