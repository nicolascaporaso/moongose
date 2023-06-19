//@ts-check
import MongoStore from 'connect-mongo';
import express from 'express'
import session from 'express-session';
import { apiRouter } from "./routes/api.routes.js";
import { __dirname, connectMongo, connectSocket } from './utils.js';
import path from "path";
import handlebars from 'express-handlebars';
import { viewRouter } from "./routes/view.Routes.js";
import { ChatRouter } from './routes/chat.router.js';
import { authRouter } from './routes/auth.router.js';

const app = express();
const port = 8081;

const httpServer = app.listen(port, () => {
    console.log("example app listen port " + "http://localhost:" + port + "/api/products");
});

connectSocket(httpServer);
connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        store: MongoStore.create({ mongoUrl: "mongodb+srv://nicolascaporaso:control4970@comerce.nbjkdia.mongodb.net/ecomerce?retryWrites=true&w=majority", ttl: 7200 }),
        secret: 'un-re-secreto',
        resave: true,
        saveUninitialized: true,
    })
);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use("/", viewRouter);
app.use("/api", apiRouter);
app.use("/chat", ChatRouter);
app.use('/auth', authRouter);
