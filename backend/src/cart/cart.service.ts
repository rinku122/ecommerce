import { BadRequestException, Injectable } from '@nestjs/common'; // Import necessary modules from NestJS
import {
  CART_EMPTY,
  DISCOUNT_INVALID,
  ITEM_ADDEDD,
  ORDER_PLACED,
} from '../constants';
import { ChekoutDto, OrderDto } from 'src/dto';
import { ICartItem } from 'src/interfaces';
import { Cardsdata, store } from 'src/store';

@Injectable()
export class CartService {
  private prices: {} = {};

  // Constructor to initialize product prices from Cardsdata
  constructor() {
    Cardsdata.forEach((product) => {
      this.prices[product.id] = product.price;
    });
  }

  // Method to add items to the cart
  addToCart(body: OrderDto) {
    const { userId, items } = body;

    if (!store.cartData[userId]) {
      store.cartData[userId] = [];
    }

    items.forEach(({ productId, quantity }) => {
      store.cartData[userId].push({ productId, quantity });
    });

    return { message: ITEM_ADDEDD, cart: store.cartData[userId] };
  }

  // Method to process checkout
  checkout(body: ChekoutDto) {
    const { userId, discountCode } = body;

    if (!store.cartData[userId] || store.cartData[userId].length === 0) {
      throw new BadRequestException(CART_EMPTY);
    }

    let totalAmount = this.calculateTotal(store.cartData[userId]);
    let discountApplied = 0; // Initialize discount amount

    if (discountCode) {
      if (
        store.discountCodes[discountCode] &&
        !store.discountCodes[discountCode].isUsed
      ) {
        discountApplied =
          (totalAmount * store.discountCodes[discountCode].discount) / 100;
        store.discountCodes[discountCode].isUsed = true; // Mark the discount code as used
      } else {
        throw new BadRequestException(DISCOUNT_INVALID); // Throw an error if the discount code is invalid
      }
    }

    const finalAmount = totalAmount - discountApplied;

    store.orderCount += 1;
    store.ordersData.push({
      orderId: store.orderCount,
      userId,
      items: store.cartData[userId],
      totalAmount,
      discountApplied,
    });

    store.cartData[userId] = [];

    return {
      message: ORDER_PLACED,
      orderId: store.orderCount,
      totalAmount,
      discountApplied,
      finalAmount,
    };
  }

  // Method to calculate the total amount of items in the cart
  calculateTotal = (cart: ICartItem[]): number => {
    return cart.reduce(
      (total: number, item: ICartItem) =>
        total + this.prices[item.productId] * item.quantity,
      0,
    );
  };

  // Method to get all available items (products)
  getItems = () => {
    return Cardsdata;
  };
}
