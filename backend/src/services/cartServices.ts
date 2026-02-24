import cartModel, { ICart, ICartItem } from "../models/cartModel";
import { IOrder, IOrderItem, orderModel } from "../models/orderModel";
import productModel from "../models/productModel";

interface CreateCartForUser {
  userId: string;
}

export const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

interface GetActiceCartForUser {
  userId: string;
  populateProduct?: boolean;
}

export const getActiceCartForUser = async ({
  userId,
  populateProduct,
}: GetActiceCartForUser) => {
  let cart;
  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate("items.product");
  } else {
    cart = await cartModel.findOne({ userId, status: "active" });
  }

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
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
  const cart = await getActiceCartForUser({ userId });

  //check that the item in the cart ??
  const existProductInCart = await cart.items.find(
    (p) => p.product.toString() === productId,
  );
  if (existProductInCart) {
    return { data: "item already exsit in cart", statusCode: 400 };
  }
  //fetch the product
  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "product not found ", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "low stock ", statusCode: 400 };
  }
  cart.items.push({ product: productId, unitPrice: product.price, quantity });
  cart.totalAmount += product.price * quantity;

 await cart.save();
  return {
    data: await getActiceCartForUser({ userId, populateProduct: true }),
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
  const cart = await getActiceCartForUser({ userId });
  const existProductInCart = await cart.items.find(
    (p) => p.product.toString() === productId,
  );
  if (!existProductInCart) {
    return { data: "item not  exsit in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "product not found ", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "low stock ", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId,
  );

  let total = calculateCartTotalItems({ cartItems: otherCartItems });

  existProductInCart.quantity = quantity;
  total += existProductInCart.quantity * existProductInCart.unitPrice;

  cart.totalAmount = total;
 await cart.save();
  return {  data: await getActiceCartForUser({ userId, populateProduct: true }), statusCode: 200 };
};

interface DeleteItemInCart {
  productId: any;
  userId: string;
}
export const deleteItemInCart = async ({
  productId,
  userId,
}: DeleteItemInCart) => {
  const cart = await getActiceCartForUser({ userId });
  const existProductInCart = await cart.items.find(
    (p) => p.product.toString() === productId,
  );
  if (!existProductInCart) {
    return { data: "item not  exsit in cart", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId,
  );

  let total = calculateCartTotalItems({ cartItems: otherCartItems });

  cart.items = otherCartItems;
  cart.totalAmount = total;
await cart.save();
  return { data: await getActiceCartForUser({ userId, populateProduct: true }), statusCode: 200 };
};

interface ClearCart {
  userId: string;
}
export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiceCartForUser({ userId });

  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
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

export const checkout = async ({ userId, address }: Checkout) => {
  if (!address) {
    return { data: "address not found ", statusCode: 400 };
  }
  const cart = await getActiceCartForUser({ userId });
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
