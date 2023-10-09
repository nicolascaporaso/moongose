import bcrypt from 'bcrypt';
import { config } from "./config/config.js"
import { connect } from "mongoose";
import multer from "multer";
import path from "path";
import { Server } from 'socket.io';
import { fileURLToPath } from "url";
import { MsgModel } from './DAO/mongo/models/msg.model.js';


const MONGO_USER = config.MONGO_USER;
const MONGO_PASS = config.MONGO_PASS;
const DB_NAME = config.DB_NAME;


// --------------- MULTER -----------------------
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

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// ------------------mongo-------------------------

export async function connectMongo() {
    try {
        await connect(
            `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@comerce.nbjkdia.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

        );
        console.log("plug to mongo!");
    } catch (e) {
        console.log(e);
        throw "can not connect to the db";
    }
}

//----------------SOCKET------------------------------


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

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);
