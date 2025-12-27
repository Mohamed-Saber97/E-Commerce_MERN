import express, { Request, Response } from "express";
import {
  getActiceCartForUser,
  addItemToCart,
  updateItemInCart,
  deleteItemInCart,
  clearCart,
  checkout,
} from "../services/cartServices";
import validateUser from "../middlewares/validateUser";
import { ExtendRequest } from "../types/extendedRequest";

const router = express.Router();

router.get("/", validateUser, async (req: ExtendRequest, res: Response) => {
  try {
    const userId = req?.user?._id;
    const cart = await getActiceCartForUser({ userId });
    res.status(200).send(cart);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

//clear route
router.delete("/", validateUser, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const response = await clearCart({ userId });
    res.status(response.statusCode).send(response.data);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

router.post("/items", validateUser, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

router.put("/items", validateUser, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await updateItemInCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

router.delete(
  "/items/:productId",
  validateUser,
  async (req: ExtendRequest, res) => {
    try {
      const userId = req?.user?._id;
      const { productId } = req.params;
      const response = await deleteItemInCart({ userId, productId });
      res.status(response.statusCode).send(response.data);
    } catch (error: any) {
      res.status(500).send(error?.message);
    }
  }
);

// checkout to convert to order

router.post("/checkout", validateUser, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const { address } = req.body;
    const response = await checkout({ userId, address });
    res.status(response.statusCode).send(response.data);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

export default router;
