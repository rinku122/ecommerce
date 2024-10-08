import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DISCOUNT,
  DISCOUNT_APPLIED,
  DISCOUNT_REJECTED,
  ORDER_FETCHED_SUCCESS,
  ORDER_NUMBER,
} from '../constants';
import { store } from 'src/store';

// Mark the class as a NestJS service, making it injectable
@Injectable()
export class AdminService {
  // Method to list all purchases
  listPurchases() {
    const totalPurchaseAmount = store.ordersData.reduce(
      (total, order) => total + order.totalAmount,
      0,
    );
    const totalDiscount = store.ordersData.reduce(
      (total, order) => total + order.discountApplied,
      0,
    );

    return {
      message: ORDER_FETCHED_SUCCESS,
      totalPurchaseAmount,
      totalDiscount,
      purchases: store.ordersData,
      discountCodes: store.discountCodes,
    };
  }

  // Method to generate a discount code based on the order number
  generateDiscountCode(body: { orderNumber: number }) {
    const { orderNumber } = body;

    if (orderNumber % ORDER_NUMBER === 0) {
      const code = `DISCOUNT${orderNumber}`;
      store.discountCodes[code] = { isUsed: false, discount: DISCOUNT };
      return { message: DISCOUNT_APPLIED, code };
    }
    throw new BadRequestException(DISCOUNT_REJECTED);
  }
}
