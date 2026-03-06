import express from "express";
import { getMyOrders, login, register } from "../services/userServices";
import { registerUser, loginUser, userOreders } from "../controllers/userController"
import validateUser from "../middlewares/validateUser";
import { ExtendRequest } from "../types/extendedRequest";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/my-orders", validateUser , userOreders);

export default router;
