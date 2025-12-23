import express, { Request, Response } from 'express';
import { getActiceCartForUser, addItemToCart } from '../services/cartServices';
import vaildateUser from '../middlewares/validateUser';
import { ExtendRequest } from "../types/extendedRequest";

const router = express.Router();

router.get("/", vaildateUser, async(req:ExtendRequest , res:Response)=> {
    const userId = req?.user?._id;
    const cart = await getActiceCartForUser({userId});
    res.status(200).send(cart);
});



router.post('/items', vaildateUser, async(req:ExtendRequest, res)=> {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);
})

export default router;