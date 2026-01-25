import express from "express";
import { login, register } from "../services/userServices";
import { IsAny } from "mongoose";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).json(result.data);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, statusCode } = await login({ email, password });
    res.status(statusCode).json(data);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

export default router;
