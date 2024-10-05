import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

// Define a controller for handling requests to the 'admin' route
@Controller('admin')
export class AdminController {
  // Inject the AdminService into the controller
  constructor(private readonly adminService: AdminService) {}

  // Define a route for GET requests to '/admin/purchases'
  @Get('purchases')
  listPurchases() {
    // Call the service method to list purchases and return the result
    return this.adminService.listPurchases();
  }

  // Define a route for POST requests to '/admin/discount'
  @Post('discount')
  generateDiscountCode(@Body() body: { orderNumber: number }) {
    // Call the service method to generate a discount code using the provided order number
    return this.adminService.generateDiscountCode(body);
  }
}
