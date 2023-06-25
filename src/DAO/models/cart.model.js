import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    idProducts: [{
        _id: false,
        idProduct: {
            type: Schema.Types.ObjectId,
            ref: 'Productos'
        },
        quantity: {
            type: Number,
            //default: 1
        }
    }, { versionKey: false }]
});

export const CartModel = model("cart", cartSchema);

