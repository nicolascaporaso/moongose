import express from "express";
import logger from "../config/logger.js";

export const loggerRouter = express.Router();

loggerRouter.get("/loggerTest", (req, res) => {
    logger.debug("prueba de Debug message");
    logger.http("prueba de HTTP message");
    logger.info("prueba de Info message");
    logger.warn("prueba de Warning message");
    logger.error("prueba de Error message");
    logger.fatal("prueba de Fatal message");
    res.send("Logs generated.");
});