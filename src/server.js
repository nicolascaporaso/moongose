//@ts-check
import flash from "connect-flash";
import MongoStore from 'connect-mongo';
import crypto from 'crypto';
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import path from "path";
import { iniPassport } from './config/passport.config.js';
import { apiRouter } from "./routes/api.routes.js";
import {loggerRouter} from "./routes/logger.routes.js";
import { authRouter } from './routes/auth.router.js';
import { ChatRouter } from './routes/chat.router.js';
import { viewRouter } from "./routes/view.Routes.js";
import { __dirname, } from '../src/rootPath.js';
import errorHandler from "../src/middlewares/error.js"
import logger from "./config/logger.js";
import { config } from "./config/config.js";
import connectMongo from "./utils/mongo.js"
import connectSocket from "./utils/socket.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";


const app = express();
const port = 8081;
const secreto = crypto.randomBytes(64).toString('hex');

const MONGO_USER = config.MONGO_USER
const MONGO_PASS = config.MONGO_PASS;
const DB_NAME = config.DB_NAME;

const httpServer = app.listen(port, () => {
    logger.info("Server listen port " + "http://localhost:" + port + "/")
});

// Conexión a mongo 
connectMongo();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

//Engine handlerbars 
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Configuración de la sesión.
app.use(
    session({
        store: MongoStore.create({ mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@comerce.nbjkdia.mongodb.net/${DB_NAME}?retryWrites=true&w=majority` }),
        secret: secreto,
        resave: false,
        saveUninitialized: false,
        ttl: 800000,
        name: 'coderCookie',
    })
);

//Passport
iniPassport();
app.use(passport.initialize()); // Inicializa passport
app.use(passport.session()); // Enlaza passport con la sesion
app.use(flash());

//swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion App web para compras",
            description: "Este proyecto Permite generar una app de compras facil y rapida.",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));




// Routes
app.use("/", viewRouter);
app.use("/api", apiRouter);
app.use("/chat", ChatRouter);
app.use('/auth', authRouter);
app.use('/log', loggerRouter);

// Websockets
connectSocket(httpServer);

app.use(errorHandler);
logger.info("servidor iniciado en modo:" + " " + process.env.NODE_ENV)

