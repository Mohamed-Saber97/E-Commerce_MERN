import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import { ExtendRequest } from "../types/extendedRequest";


const validateUser = (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {
  // there is auth header

  const authHeader = req.get("authorization");
  if (!authHeader) {
    res.status(403).send("Authorization Header wan not provided!");
    return;
  }

  //there is token
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(403).send("Token not found");
    return;
  }

  // if you are here then we have a token
  // check is the token === user token in db with my secret key

  jwt.verify(token, process.env.JWT_SECRET || '', async (err, payload) => {
    // if err
    if (err) {
      res.status(403).send("invaild token");
      return;
    }
    //if !payload
    if (!payload) {
      res.status(403).send("invaild token payload");
      return;
    }

    // fetch user from db based on payload
    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };
    const user = await userModel.findOne({ email: userPayload.email });
    if(!user){
      res.status(403).send("user not found ");
      return;
    }
    req.user = user;
    next();
  });
};

export default validateUser;
