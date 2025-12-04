import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  UseGuards,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';
import {
  UpdateProfileDto,
  CreateProductDto,
  UpdateProductDto,
  LoginUserDto,
  CreateUserDto,
} from '@app/shared-lib';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { trace } from '@opentelemetry/api';

@Controller()
export class ApiGatewayController {
  private readonly logger = new Logger(ApiGatewayController.name);
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('auth/register')
  register(@Body() body: CreateUserDto) {
    return this.apiGatewayService.register(body);
  }

  @Post('auth/login')
  login(@Body() body: LoginUserDto) {
    return this.apiGatewayService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('auth/profile')
  updateProfile(@Request() req, @Body() body: UpdateProfileDto) {
    const userId = req.user.userId;
    const dataToSend = { ...body, userId };
    return this.apiGatewayService.updateProfile(dataToSend);
  }

  @Get('products')
  findAllProducts() {
    return this.apiGatewayService.findAllProducts();
  }

  @Get('products/:id')
  findOneProduct(@Param('id') id: string) {
    return this.apiGatewayService.findOneProduct(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('products')
  async createProduct(@Request() req, @Body() body: CreateProductDto) {
    const userId = req.user.userId;
    const email = req.user.email;

    const span = trace.getActiveSpan();
    if (span) {
      span.setAttribute('user.id', userId);
      span.setAttribute('user.email', email);
      span.setAttribute('action', 'create_product');
    }

    const traceId = span?.spanContext().traceId;

    this.logger.log({
      msg: 'Admin is creating a product',
      userId: userId,
      productName: body.name,
      traceId: traceId,
    });

    return this.apiGatewayService.createProduct(body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.apiGatewayService.updateProduct({ ...body, id });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.apiGatewayService.deleteProduct(id);
  }
}
