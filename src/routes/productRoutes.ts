import express from "express";
import { getAllProduct } from "../services/productServices";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await getAllProduct();
    return res.status(200).send(products);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});
export default router;
