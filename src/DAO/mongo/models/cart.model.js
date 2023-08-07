import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    idProducts: [{
        _id: false,
        idProduct: {
            type: Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: {
            type: Number,
            //default: 1
        }
    }, { versionKey: false }]
});

const CartModel = model("cart", cartSchema);
export default CartModel;