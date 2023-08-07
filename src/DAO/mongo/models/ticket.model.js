import { Schema, model } from 'mongoose';
import { type } from 'os';

const productSchema = new Schema({
    _id: false,
    product: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const schema = new Schema({
    code: { type: String, required: true, max: 1000},
    purchase_datetime: { type: Date, required: true,},
    amount: { type: Number, required: true, max: 1000000},
    purchaser: { type: String, required: true, max: 1000 },
    idProducts: [productSchema]
});

const TicketModel = model('tickets', schema);
export default TicketModel
