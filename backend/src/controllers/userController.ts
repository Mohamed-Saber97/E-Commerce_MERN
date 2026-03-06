import { Request, Response } from "express";
import { ExtendRequest } from "../types/extendedRequest";
import { getMyOrders, login, register } from "../services/userServices";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).json(result.data);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
};

export const loginUser = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { data, statusCode } = await login({ email, password });
        res.status(statusCode).json(data);
      } catch (error: any) {
        res.status(500).send(error?.message);
      }
};


export const userOreders = async(req: ExtendRequest, res: Response) => {
    try {
           const userId = req?.user?._id;
           const {statusCode, data} = await getMyOrders({ userId });
           res.status(statusCode).send(data);
         } catch (error: any) {
           res.status(500).send(error?.message);
         }
};


