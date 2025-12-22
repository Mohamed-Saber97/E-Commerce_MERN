import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import {seedInitialProducts} from './services/productServices'
const app = express();
const port = 3001;
app.use(express.json());
//connect db
mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log("failed to connect", err));

seedInitialProducts();


app.use('/user', userRoutes);
app.use('/product', productRoutes);

app.listen(port, ()=> {
    console.log(`server is running at: http://localhost:${port}`);
    
});

