import { connect } from "mongoose";
import { config } from "../config/config.js"
import logger from "../config/logger.js";

const MONGO_USER = config.MONGO_USER;
const MONGO_PASS = config.MONGO_PASS;
const DB_NAME = config.DB_NAME;

export default async function connectMongo() {
    try {
        await connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@comerce.nbjkdia.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`);
        logger.info("plug to mongo!");
    } catch (e) {
        console.log(e);
        throw "can not connect to the db";
    }
}