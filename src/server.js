import express from 'express'
import {apiRouter} from "./routes/api.routes.js";
import { __dirname } from './utils.js';
import path from "path";
import handlebars from 'express-handlebars';
import {viewRouter} from "./routes/view.Routes.js";
import { Server } from "socket.io";
import ProductManager from './managers/productManager.js';


const myManager = new ProductManager('./src/data/products.json');

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
    console.log("example app listen port " + "http://localhost:"+port+"/api/products");
});

const socketServer = new Server (httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine ('handlebars', handlebars.engine());
app.set('view engine','handlebars');
app.set('views', __dirname + '/views');

//midleware para usar io en post
/*app.use((req, res, next) => {
    req.io = socketServer;
    next();
});*/

app.use("/", viewRouter);
app.use("/api", apiRouter);

socketServer.on("connection",(socket) => {
    console.log("cliente conectado " + socket.id);
    
    socket.on('createProduct', async (pdata) =>{
        try {
            const product = await myManager.addProduct(pdata);
            socket.emit("createProductOk", pdata); 

        } catch (error) {
            console.log(error.message);
            socket.emit("createProductFail",error.message); 
        }
    });

    socket.on('deleteProduct', async (id) =>{
        try {
            const product = await myManager.deleteProduct(id);
            socket.emit("createProductOk", pdata); 

        } catch (error) {
            console.log(error.message);
            socket.emit("createProductFail",error.message); 
        }
    });

    

});