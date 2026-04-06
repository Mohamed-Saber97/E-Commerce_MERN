import mongoose from "mongoose";
import cartModel, { ICart, ICartItem } from "../models/cartModel";
import { IOrder, IOrderItem, orderModel } from "../models/orderModel";
import productModel from "../models/productModel";
import { AppError } from "../utils/AppError";

interface CreateCartForUser {
  userId: string;
}

export const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
  populateProduct?: boolean;
}

export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  const query = cartModel.findOne({ userId, status: "active" });
  const cart = populateProduct
    ? await query.populate("items.product")
    : await query;
  if (cart) {
    return cart;
  }

  return createCartForUser({ userId });
};

interface AddItemToCart {
  productId: any;
  quantity: number;
  userId: string;
}
export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  //check that the item in the cart ??
  const existProductInCart = await cart.items.find(
    (p) => p.product.toString() === productId,
  );
  if (existProductInCart) {
    //return { data: "item already exsit in cart", statusCode: 400 };
    throw new AppError("Item Already Exsit in Cart", 400);
  }
  //fetch the product
  const product = await productModel.findById(productId);
  if (!product) {
    //return { data: "product not found ", statusCode: 400 };
    throw new AppError("Product Not Found", 400);
  }

  if (product.stock < quantity) {
    //return { data: "low stock ", statusCode: 400 };
    throw new AppError("Low Stock", 400);
  }
  cart.items.push({ product: productId, unitPrice: product.price, quantity });
  cart.totalAmount += product.price * quantity;

  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 201,
  };
};

interface UpdateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });
  const existProductInCart = await cart.items.find(
    (p) => p.product.toString() === productId,
  );
  if (!existProductInCart) {
    //return { data: "item not  exsit in cart", statusCode: 400 };
    throw new AppError("Item Not Exsit In Cart", 400);
  }

  const product = await productModel.findById(productId);
  if (!product) {
    //return { data: "product not found ", statusCode: 400 };
    throw new AppError("Product Not Found", 400);
  }

  if (product.stock < quantity) {
    //return { data: "low stock ", statusCode: 400 };
    throw new AppError("Low Stock", 400);
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId,
  );

  let total = calculateCartTotalItems({ cartItems: otherCartItems });

  existProductInCart.quantity = quantity;
  total += existProductInCart.quantity * existProductInCart.unitPrice;

  cart.totalAmount = total;
  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

interface DeleteItemInCart {
  productId: any;
  userId: string;
}
export const deleteItemInCart = async ({
  productId,
  userId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });
  const existProductInCart = await cart.items.find(
    (p) => p.product.toString() === productId,
  );
  if (!existProductInCart) {
    //return { data: "item not  exsit in cart", statusCode: 400 };
    throw new AppError("Item Not Exsit In Cart", 400);
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId,
  );

  let total = calculateCartTotalItems({ cartItems: otherCartItems });

  cart.items = otherCartItems;
  cart.totalAmount = total;
  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

interface ClearCart {
  userId: string;
}
export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

const calculateCartTotalItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
  let total = cartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);

  return total;
};

interface Checkout {
  userId: string;
  address: string;
}
/*
export const checkoutwithoutTransaction = async ({
  userId,
  address,
}: Checkout) => {
  if (!address) {
    return { data: "address not found ", statusCode: 400 };
  }
  if (!address?.trim()) {
    throw new AppError("Address is required", 400);
  }

  const cart = await getActiveCartForUser({ userId });
  // loop cartitems and create from it orderitems

  const orderItems: IOrderItem[] = [];
  for (const item of cart.items) {
    const product = await productModel.findById(item.product);
    if (!product) {
      return { data: "product not found ", statusCode: 400 };
    }
    const orderItem: IOrderItem = {
      productTitle: product?.title,
      productImage: product?.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    };
    orderItems.push(orderItem);
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await orderModel.create({
    orderItems,
    total: cart.totalAmount,
    address,
    userId,
  });

  await order.save();
  //update cart status to complete
  cart.status = "completed";
  await cart.save();

  return { data: order, statusCode: 201 };
};
*/
export const checkout = async ({ userId, address }: Checkout) => {
  if (!address) {
    return { data: "address not found ", statusCode: 400 };
  }
  if (!address?.trim()) {
    throw new AppError("Address is required", 400);
  }

  //start session
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const cart = await cartModel
        .findOne({
          userId,
          status: "active",
        })
        .session(session);

      if (!cart) {
        throw new AppError("Actice Cart Not Found", 404);
      }
      if (!cart!.items.length) {
        throw new AppError("Cart is empty", 400);
      }
      const orderItems: IOrderItem[] = [];
      for (const item of cart!.items) {
        const updatedProduct = await productModel.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            new: true,
            session,
          },
        );
        if (!updatedProduct) {
          throw new AppError("one or more product are out of stock", 409);
        }
        orderItems.push({
          productTitle: updatedProduct.title,
          productImage: updatedProduct.image,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        });
      }

      const createOreders = await orderModel.create(
        [
          {
            orderItems,
            total: cart!.totalAmount,
            address,
            userId,
          },
        ],
        { session },
      );

      cart!.status = "completed";
      await cart!.save({session});
      return {date: createOreders[0], statusCode: 201};
    });
  } catch (error: any) {
      if (error.message === "active cart not found" || error.message === "cart is empty") {
      return {
        data: error.message,
        statusCode: error.message === "active cart not found" ? 404 : 400,
      };
    }

    if (error.message === "insufficient stock") {
      return {
        data: "one or more products are out of stock",
        statusCode: 409,
      };
    }

    return {
      data: error.message || "checkout failed",
      statusCode: 500,
    };
  } finally {
    await session.endSession();
  }
};

/*

1. Load cart
2. Validate products exist
3. Check stock
4. Decrease stock
5. Create order
6. Clear cart
*/
