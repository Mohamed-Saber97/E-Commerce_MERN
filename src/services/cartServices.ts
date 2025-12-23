import cartModel from "../models/cartModel";
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
}

export const getActiceCartForUser = async ({
  userId,
}: GetActiceCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });
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
    (p) => p.product.toString() === productId
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

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 201 };
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
    (p) => p.product.toString() === productId
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
    (p) => p.product.toString() !== productId
  );
  
  let total = otherCartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);
  
  existProductInCart.quantity = quantity;
  total += existProductInCart.quantity * existProductInCart.unitPrice;

  cart.totalAmount = total;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};
