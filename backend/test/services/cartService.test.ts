import { describe, it, expect, vi, beforeEach } from "vitest";
import cartModel from "../../src/models/cartModel";
import * as cartService from "../../src/services/cartServices";

vi.mock("../../src/models/cartModel.ts", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    
  },
}));

describe("getActiveCartForUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return active cart when found without populate", async () => {
    const mockCart = {
      _id: "cart123",
      userId: "user123",
      totalAmount: 123,
      status: "active",
      items: [],
    };
    vi.mocked(cartModel.findOne).mockResolvedValue(mockCart as any);
    const createCartSpy = vi
      .spyOn(cartService, "createCartForUser")
      .mockResolvedValue({} as any);
    const result = await cartService.getActiveCartForUser({
      userId: "user123",
      populateProduct: false,
    });

    expect(cartModel.findOne).toHaveBeenCalledWith({
      userId: "user123",
      status: "active",
    });
    expect(createCartSpy).not.toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });



  
  it("should return active cart when found with populate", async () => {
    const mockCart = {
      _id: "cart123",
      userId: "user123",
      totalAmount: 123,
      status: "active",
      items: [
        {
          product: {
            _id: "product123",
            title: "product1",
            image: "image1",
            price: 12000,
            stock: 1,
          },
          unitPrice: 1452,
          quantity: 1,
        },
      ],
    };
    const populateMock = vi.fn().mockResolvedValue(mockCart);
    vi.mocked(cartModel.findOne).mockReturnValue({
      populate: populateMock,
    } as any);
    const createCartSpy = vi
      .spyOn(cartService, "createCartForUser")
      .mockResolvedValue({} as any);
    const result = await cartService.getActiveCartForUser({
      userId: "user123",
      populateProduct: true,
    });

    expect(cartModel.findOne).toHaveBeenCalledWith({
      userId: "user123",
      status: "active",
    });
    expect(createCartSpy).not.toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });

  it("should create a new cart whan no active cart exist", async()=> {
    vi.mocked(cartModel.findOne).mockResolvedValue(null as any);
        const createdCart = {
      _id: "newCart123",
      userId: "user123",
      totalAmount: 123,
      status: "active",
      items: [],
      save: vi.fn().mockResolvedValue(true),
    };

     vi.mocked(cartModel.create).mockResolvedValue(createdCart as any);
 const result = await cartService.getActiveCartForUser({
      userId: "user123",
      populateProduct: false,
    });
    expect(cartModel.findOne).toHaveBeenCalledWith({
      userId: "user123",
      status: "active",
    });
    expect(cartModel.create).toHaveBeenCalledWith({userId: "user123", totalAmount: 0});
     expect(result).toEqual(createdCart);

  });
});
