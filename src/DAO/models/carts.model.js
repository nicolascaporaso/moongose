import { Schema, model } from "mongoose";

const schema = new Schema({
    Id: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
});

export const cartModel = model("cart", schema);

