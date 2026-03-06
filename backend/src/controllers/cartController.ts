import express, { Request, Response } from "express";
import { ExtendRequest } from "../types/extendedRequest";
import {
  getActiceCartForUser,
  addItemToCart,
  updateItemInCart,
  deleteItemInCart,
  clearCart,
  checkout,
} from "../services/cartServices";

export const getAllCarts = async (req: ExtendRequest, res: Response) => {
  try {
    const userId = req?.user?._id;
    const cart = await getActiceCartForUser({ userId, populateProduct: true });
    res.status(200).send(cart);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
};


export const clearCartController = async(req: ExtendRequest, res: Response) => {
      try {
        const userId = req?.user?._id;
        const response = await clearCart({ userId });
        res.status(response.statusCode).send(response.data);
      } catch (error: any) {
        res.status(500).send(error?.message);
      }
};


export const addItemToCartController = async(req:ExtendRequest, res: Response) => {
    try {
        const userId = req?.user?._id;
        const { productId, quantity } = req.body;
        const response = await addItemToCart({ userId, productId, quantity });
        res.status(response.statusCode).send(response.data);
      } catch (error: any) {
        res.status(500).send(error?.message);
      }
};

export const updateItemInCartController = async (req: ExtendRequest, res: Response ) => {
    try {
        const userId = req?.user?._id;
        const { productId, quantity } = req.body;
        const response = await updateItemInCart({ userId, productId, quantity });
        res.status(response.statusCode).send(response.data);
      } catch (error: any) {
        res.status(500).send(error?.message);
      }
};


export const deleteItemFromCartController = async(req:ExtendRequest, res: Response) => {
       try {
          const userId = req?.user?._id;
          const { productId } = req.params;
          const response = await deleteItemInCart({ userId, productId });
          res.status(response.statusCode).send(response.data);
        } catch (error: any) {
          res.status(500).send(error?.message);
        }
};


export const checkoutController = async(req: ExtendRequest, res: Response) => {
    try {
    const userId = req?.user?._id;
    const { address } = req.body;
    const response = await checkout({ userId, address });
    res.status(response.statusCode).send(response.data);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
}


