import { Schema, model } from 'mongoose';

const schema = new Schema({
    code: { type: String, required: true, max: 1000},
    purchase_datetime: { type: Date, required: true,},
    amount: { type: Number, required: true, max: 1000000},
    purchaser: { type: String, required: true, max: 1000 },
    idProducts: [{_id: false, idProduct: {type: Schema.Types.ObjectId, ref: 'Products'},quantity: { type: Number,}}]
});

const TicketModel = model('tickets', schema);
export default TicketModel
