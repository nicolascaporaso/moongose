// --------------- MULTER -----------------------
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const uploader = multer({ storage });

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


// ------------------mongo-------------------------
import { connect } from "mongoose";
export async function connectMongo() {
    try {
        await connect(
            /* PONER TU STRING ENTERO ACA */
            "mongodb+srv://nicolascaporaso:control4970@comerce.nbjkdia.mongodb.net/ecomerce?retryWrites=true&w=majority"

        );
        console.log("plug to mongo!");
    } catch (e) {
        console.log(e);
        throw "can not connect to the db";
    }
}

//----------------SOCKET------------------------------
import { Server } from 'socket.io';
import { MsgModel } from './DAO/models/msg.model.js';
import { ProductService } from "../src/services/product.service.js";
import { ProductModel } from "./DAO/models/products.model.js";


const ProductSrvc = new ProductService();

export function connectSocket(httpServer) {

    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socket) => {
        console.log("cliente conectado " + socket.id);

        socket.on('createProduct', async (pdata) => {
            try {
                const thumbnails = 'sin imagen';
                const {title, description, code, price, stock, status}= pdata
                console.log(title, description, code, price, stock, status);
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

//----------------bcrypt------------------------------
import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);
