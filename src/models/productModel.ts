import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  image: string;
  price: number;
  stock: number;
}

const productShcema = new Schema<IProduct>({
  title: { type: String, Required: true },
  image: { type: String, Required: true },
  price: { type: Number, Required: true },
  stock: { type: Number, Required: true, default: 0 },
});

const productModel = mongoose.model<IProduct>("Product", productShcema);
export default productModel;
