import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

// Define a controller for handling requests to the 'admin' route
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Define a route for GET requests to '/admin/purchases'
  @Get('purchases')
  listPurchases() {
    return this.adminService.listPurchases();
  }

  // Define a route for POST requests to '/admin/discount'
  @Post('discount')
  generateDiscountCode(@Body() body: { orderNumber: number }) {
    return this.adminService.generateDiscountCode(body);
  }
}
