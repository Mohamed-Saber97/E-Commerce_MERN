import express from "express";
import { registerUser, loginUser, userOreders } from "../controllers/userController"
import validateUser from "../middlewares/validateUser";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/my-orders", validateUser , userOreders);

export default router;
