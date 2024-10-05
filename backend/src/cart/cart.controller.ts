import { Body, Controller, Get, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { ChekoutDto, OrderDto } from 'src/dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getItems() {
    // Call the service method to retrieve cart items and return the result
    return this.cartService.getItems();
  }

  @Post()
  addToCart(@Body() body: OrderDto) {
    // Call the service method to add an item to the cart using the provided OrderDto
    return this.cartService.addToCart(body);
  }

  @Post('checkout')
  checkout(@Body() body: ChekoutDto) {
    // Call the service method to process the checkout using the provided ChekoutDto
    return this.cartService.checkout(body);
  }
}
