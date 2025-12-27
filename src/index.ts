import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import {seedInitialProducts} from './services/productServices'
import cartRoutes from './routes/cartRoutes';
const app = express();
const port = 3001;
app.use(express.json());
dotenv.config();
//connect db
mongoose
  .connect(process.env.DB_URL || '');
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log("failed to connect", err));

seedInitialProducts();


app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);

app.listen(port, ()=> {
    console.log(`server is running at: http://localhost:${port}`);
    
});

