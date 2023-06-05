//@ts-check
import express from 'express'
import {apiRouter} from "./routes/api.routes.js";
import { __dirname, connectMongo, connectSocket } from './utils.js';
import path from "path";
import handlebars from 'express-handlebars';
import {viewRouter} from "./routes/view.Routes.js";
import { ChatRouter } from './routes/chat.router.js';

const app = express();
const port = 8081;

const httpServer = app.listen(port, () => {
    console.log("example app listen port " + "http://localhost:"+port+"/api/products");
});

connectSocket(httpServer);
connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine ('handlebars', handlebars.engine());
app.set('view engine','handlebars');
app.set('views', __dirname + '/views');

app.use("/", viewRouter);
app.use("/api", apiRouter);
app.use("/chat", ChatRouter);
