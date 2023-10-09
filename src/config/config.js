import dotenv from 'dotenv'

const enviroment = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

if (enviroment.trim()==='test'){
    dotenv.config({path:'./.env.test'});
}

if (enviroment.trim()==='production'){
    dotenv.config({path:'./.env'});
}

export const config={
    DB_NAME: process.env.DB_NAME,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASS: process.env.MONGO_PASS,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
}