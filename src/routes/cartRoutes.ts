import express, { Request, Response } from 'express';
import { getActiceCartForUser } from '../services/cartServices';
import vaildateUser from '../middlewares/validateUser';

const router = express.Router();
interface ExtendRequest extends Request {
  user?: any;
}
router.get("/", vaildateUser, async(req:ExtendRequest , res:Response)=> {
    const userId = req.user._id;
    const cart = await getActiceCartForUser({userId});
    res.status(200).send(cart);
})

export default router;