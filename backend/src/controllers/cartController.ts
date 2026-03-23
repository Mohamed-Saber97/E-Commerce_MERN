import express, { Request, Response } from "express";

import { ExtendRequest } from "../types/extendedRequest";
import {
  getActiveCartForUser,
  addItemToCart,
  updateItemInCart,
  deleteItemInCart,
  clearCart,
  checkout,
} from "../services/cartServices";
import { sendResponse } from "../utils/responseHandler";

export const getAllCarts = async (req: ExtendRequest, res: Response) => {
  try {
    const userId = req?.user?._id;
    const cart = await getActiveCartForUser({ userId, populateProduct: true });
    //res.status(200).send(cart);
    sendResponse({
      res,
      statusCode: 200,
      message: "here active carts for user",
      data: cart,
    });
  } catch (error: any) {
    //res.status(500).send(error?.message);
    sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: error?.message,
    });
  }
};

export const clearCartController = async (
  req: ExtendRequest,
  res: Response,
) => {
  try {
    const userId = req?.user?._id;
    const response = await clearCart({ userId });
    //res.status(response.statusCode).send(response.data);
    sendResponse({
      res,
      statusCode: 200,
      message: "clear cart successfully",
      data: response,
    });
  } catch (error: any) {
    //res.status(500).send(error?.message);
    sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: error?.message,
    });
  }
};

export const addItemToCartController = async (
  req: ExtendRequest,
  res: Response,
) => {
  try {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await addItemToCart({ userId, productId, quantity });
    //res.status(response.statusCode).send(response.data);
    sendResponse({
      res,
      statusCode: 201,
      message: "add item to cart successfully",
      data: response,
    });
  } catch (error: any) {
    sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: error?.message,
    });
  }
};

export const updateItemInCartController = async (
  req: ExtendRequest,
  res: Response,
) => {
  try {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await updateItemInCart({ userId, productId, quantity });
    //res.status(response.statusCode).send(response.data);
    sendResponse({
      res,
      statusCode: 201,
      message: "update item in cart successfully",
      data: response,
    });
  } catch (error: any) {
    sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: error?.message,
    });
  }
};

export const deleteItemFromCartController = async (
  req: ExtendRequest,
  res: Response,
) => {
  try {
    const userId = req?.user?._id;
    const { productId } = req.params;
    const response = await deleteItemInCart({ userId, productId });
    //res.status(response.statusCode).send(response.data);
    sendResponse({
      res,
      statusCode: 201,
      message: "delete item from cart successfully",
      data: response,
    });
  } catch (error: any) {
    sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: error?.message,
    });
  }
};

export const checkoutController = async (req: ExtendRequest, res: Response) => {
  try {
    const userId = req?.user?._id;
    const { address } = req.body;
    const response = await checkout({ userId, address });
    //res.status(response.statusCode).send(response.data);
    sendResponse({
      res,
      statusCode: 201,
      message: "checkout successfully",
      data: response,
    });
  } catch (error: any) {
    sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: error?.message,
    });
  }
};
