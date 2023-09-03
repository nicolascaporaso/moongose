//@ts-check
import { Schema, model } from 'mongoose';

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        max: 100,
    },
    lastName: {
        type: String,
        required: true,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        max: 100,
    },

    age: {
        type: Number, 
        required: false 
    },

    cartId: { 
        type: String, 
        required: false },

    role: {
        type: String,
        required: true,
        default: "user"
    },
},
    { versionKey: false }
);


export const UserModel = model('users', schema);
