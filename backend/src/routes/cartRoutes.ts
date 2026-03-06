import express from "express";

import validateUser from "../middlewares/validateUser";
import {
  getAllCarts,
  clearCartController,
  addItemToCartController,
  updateItemInCartController,
  deleteItemFromCartController,
  checkoutController,
} from "../controllers/cartController";
const router = express.Router();
router.get("/", validateUser, getAllCarts);
//clear route
router.delete("/", validateUser, clearCartController);
//addItem to cart
router.post("/items", validateUser, addItemToCartController);
router.put("/items", validateUser, updateItemInCartController);
router.delete("/items/:productId", validateUser, deleteItemFromCartController);
// checkout to convert to order
router.post("/checkout", validateUser, checkoutController);
export default router;
