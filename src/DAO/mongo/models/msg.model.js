import { Schema, model } from 'mongoose';

const schema = new Schema({
    user: { type: String, required: true, max: 1000 },
    message: { type: String, required: true, max: 1000 },
});

export const MsgModel = model('msgs', schema);
