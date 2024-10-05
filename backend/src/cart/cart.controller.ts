import { Body, Controller, Get, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { ChekoutDto, OrderDto } from 'src/dto';

// Define a controller for handling requests to the 'cart' route
@Controller('cart')
export class CartController {
  // Inject the CartService into the controller
  constructor(private readonly cartService: CartService) {}

  // Define a route for GET requests to '/cart'
  @Get()
  getItems() {
    // Call the service method to retrieve cart items and return the result
    return this.cartService.getItems();
  }

  // Define a route for POST requests to '/cart'
  @Post()
  addToCart(@Body() body: OrderDto) {
    // Call the service method to add an item to the cart using the provided OrderDto
    return this.cartService.addToCart(body);
  }

  // Define a route for POST requests to '/cart/checkout'
  @Post('checkout')
  checkout(@Body() body: ChekoutDto) {
    // Call the service method to process the checkout using the provided ChekoutDto
    return this.cartService.checkout(body);
  }
}
