import { Body, Controller, Get, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { ChekoutDto, OrderDto } from 'src/dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getItems() {
    return this.cartService.getItems();
  }

  @Post()
  addToCart(@Body() body: OrderDto) {
    return this.cartService.addToCart(body);
  }

  @Post('checkout')
  checkout(@Body() body: ChekoutDto) {
    return this.cartService.checkout(body);
  }
}
