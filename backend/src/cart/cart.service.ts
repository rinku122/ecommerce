import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CART_EMPTY,
  DISCOUNT_INVALID,
  ITEM_ADDEDD,
  ITEM_COST,
  ORDER_PLACED,
} from '../constants';
import { ChekoutDto, OrderDto } from 'src/dto';
import { ICartItem } from 'src/interfaces';
import { Cardsdata, store } from 'src/store';

@Injectable()
export class CartService {
  private prices: {} = {};

  constructor() {
    Cardsdata.forEach((product) => {
      this.prices[product.id] = product.price;
    });
  }

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

  checkout(body: ChekoutDto) {
    const { userId, discountCode } = body;

    if (!store.cartData[userId] || store.cartData[userId].length === 0) {
      throw new BadRequestException(CART_EMPTY);
    }

    let totalAmount = this.calculateTotal(store.cartData[userId]);
    let discountApplied = 0;

    if (discountCode) {
      if (
        store.discountCodes[discountCode] &&
        !store.discountCodes[discountCode].isUsed
      ) {
        discountApplied =
          (totalAmount * store.discountCodes[discountCode].discount) / 100;
        store.discountCodes[discountCode].isUsed = true;
      } else {
        throw new BadRequestException(DISCOUNT_INVALID);
      }
    }

    const finalAmount = totalAmount - discountApplied;

    // Process order
    store.orderCount += 1;
    store.ordersData.push({
      orderId: store.orderCount,
      userId,
      items: store.cartData[userId],
      totalAmount,
      discountApplied,
    });

    // Clear cart after checkout
    store.cartData[userId] = [];

    return {
      message: ORDER_PLACED,
      orderId: store.orderCount,
      totalAmount,
      discountApplied,
      finalAmount,
    };
  }

  calculateTotal = (cart: ICartItem[]): number => {
    return cart.reduce(
      (total: number, item: ICartItem) =>
        total + this.prices[item.productId] * item.quantity,
      0,
    );
  };

  getItems = () => {
    return Cardsdata;
  };
}
