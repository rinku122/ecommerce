import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { ChekoutDto, OrderDto } from 'src/dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  addToCart(@Body() body: OrderDto): any {
    return this.cartService.addToCart(body);
  }

  @Post('checkout')
  checkout(@Body() body: ChekoutDto): any {
    return this.cartService.checkout(body);
  }
}
