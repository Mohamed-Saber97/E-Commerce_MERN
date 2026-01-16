import productModel from "../models/productModel";

export const getAllProduct = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const initialData = [
      {
        title: "Dell Labtop",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_bBU_qo5RQ8jc5thliO9gxi-VBf_OW-KUCQ&s",
        price: 15200,
        stock: 12,
      },
      {
        title: "HP Labtop",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_bBU_qo5RQ8jc5thliO9gxi-VBf_OW-KUCQ&s",
        price: 14000,
        stock: 14,
      },
         {
        title: "ASUS Labtop",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_bBU_qo5RQ8jc5thliO9gxi-VBf_OW-KUCQ&s",
        price: 25000,
        stock: 19,
      },
    ];

    const products = await getAllProduct();
    if (products.length === 0) {
      await productModel.insertMany(initialData);
    }
  } catch (err) {
    console.error("can not see database", err);
  }
};
