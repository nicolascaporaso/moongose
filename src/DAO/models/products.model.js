//@ts-check
import { Schema, model } from "mongoose";

const schema = new Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    code: { type: String, required: true, max: 100, unique: true },
    price: { type: Number, required: true, max: 100000, unique: false },
    stock: { type: Number, required: true, max: 100, unique: false },
    status: { type: String, required: false, max: 100 },
    thumbnails: { type: String, required: true, max: 200, unique: false },
});

export const ProductModel = model("productos", schema);

