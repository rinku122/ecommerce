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
    // Calculate the total amount of all purchases using reduce
    const totalPurchaseAmount = store.ordersData.reduce(
      (total, order) => total + order.totalAmount,
      0,
    );
    // Calculate the total amount of discounts applied using reduce
    const totalDiscount = store.ordersData.reduce(
      (total, order) => total + order.discountApplied,
      0,
    );

    // Return an object containing success message, totals, purchases, and discount codes
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

    // Check if the order number is divisible by the predefined ORDER_NUMBER constant
    if (orderNumber % ORDER_NUMBER === 0) {
      // Create a discount code based on the order number
      const code = `DISCOUNT${orderNumber}`;
      // Store the discount code with its usage status and discount value
      store.discountCodes[code] = { isUsed: false, discount: DISCOUNT };
      // Return a success message and the generated code
      return { message: DISCOUNT_APPLIED, code };
    }
    // If the order number is not valid, throw a BadRequestException with an error message
    throw new BadRequestException(DISCOUNT_REJECTED);
  }
}
