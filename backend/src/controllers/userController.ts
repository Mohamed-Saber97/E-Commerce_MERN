import { Request, Response } from "express";
import { ExtendRequest } from "../types/extendedRequest";
import { getMyOrders, login, register } from "../services/userServices";
import { sendResponse } from "../utils/responseHandler";
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password });
    //res.status(result.statusCode).json(result.data);
    sendResponse({
      res,
      statusCode: 201,
      message: "user created successfully",
      data: result,
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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, statusCode } = await login({ email, password });
    //res.status(statusCode).json(data);
    sendResponse({
      res,
      statusCode: 200,
      message: "user login  successfully",
      data: data,
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

export const userOreders = async (req: ExtendRequest, res: Response) => {
  try {
    const userId = req?.user?._id;
    const { statusCode, data } = await getMyOrders({ userId });
    //res.status(statusCode).send(data);
    sendResponse({
      res,
      statusCode: 200,
      message: "orders of user",
      data: data,
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
