import { BadRequestException, Injectable } from '@nestjs/common'; // Import necessary modules from NestJS
import {
  CART_EMPTY,
  DISCOUNT_INVALID,
  ITEM_ADDEDD,
  ITEM_COST,
  ORDER_PLACED,
} from '../constants'; // Import constants for messages and error handling
import { ChekoutDto, OrderDto } from 'src/dto'; // Import Data Transfer Objects (DTOs) for type safety
import { ICartItem } from 'src/interfaces'; // Import the interface for cart items
import { Cardsdata, store } from 'src/store'; // Import product data and store for global state management

// Mark the class as a NestJS service, making it injectable
@Injectable()
export class CartService {
  // Local variable to store product prices
  private prices: {} = {};

  // Constructor to initialize product prices from Cardsdata
  constructor() {
    Cardsdata.forEach((product) => {
      this.prices[product.id] = product.price; // Map product IDs to their prices
    });
  }

  // Method to add items to the cart
  addToCart(body: OrderDto) {
    const { userId, items } = body; // Destructure userId and items from the request body

    // Initialize the cart for the user if it doesn't exist
    if (!store.cartData[userId]) {
      store.cartData[userId] = []; // Create an empty cart for the user
    }

    // Add each item to the user's cart
    items.forEach(({ productId, quantity }) => {
      store.cartData[userId].push({ productId, quantity }); // Add the product and its quantity to the cart
    });

    // Return a success message and the updated cart
    return { message: ITEM_ADDEDD, cart: store.cartData[userId] };
  }

  // Method to process checkout
  checkout(body: ChekoutDto) {
    const { userId, discountCode } = body; // Destructure userId and discountCode from the request body

    // Check if the user's cart is empty
    if (!store.cartData[userId] || store.cartData[userId].length === 0) {
      throw new BadRequestException(CART_EMPTY); // Throw an error if the cart is empty
    }

    // Calculate the total amount of the items in the cart
    let totalAmount = this.calculateTotal(store.cartData[userId]);
    let discountApplied = 0; // Initialize discount amount

    // Check if a discount code was provided
    if (discountCode) {
      // Validate the discount code
      if (
        store.discountCodes[discountCode] &&
        !store.discountCodes[discountCode].isUsed
      ) {
        // Apply the discount
        discountApplied =
          (totalAmount * store.discountCodes[discountCode].discount) / 100;
        store.discountCodes[discountCode].isUsed = true; // Mark the discount code as used
      } else {
        throw new BadRequestException(DISCOUNT_INVALID); // Throw an error if the discount code is invalid
      }
    }

    // Calculate the final amount after applying the discount
    const finalAmount = totalAmount - discountApplied;

    // Process the order
    store.orderCount += 1; // Increment the order count
    store.ordersData.push({
      orderId: store.orderCount,
      userId,
      items: store.cartData[userId],
      totalAmount,
      discountApplied,
    });

    // Clear the user's cart after checkout
    store.cartData[userId] = [];

    // Return a success message and order details
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
        total + this.prices[item.productId] * item.quantity, // Sum up the total cost of items
      0,
    );
  };

  // Method to get all available items (products)
  getItems = () => {
    return Cardsdata; // Return the list of available products
  };
}
