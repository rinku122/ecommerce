import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('purchases')
  listPurchases() {
    return this.adminService.listPurchases();
  }

  @Post('discount')
  generateDiscountCode(@Body() body: { orderNumber: number }) {
    return this.adminService.generateDiscountCode(body);
  }
}
