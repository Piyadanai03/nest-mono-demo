import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto, LoginUserDto, UpdateProfileDto, CreateProductDto, UpdateProductDto } from '@app/shared-lib';

@Injectable()
export class ApiGatewayService {
  private readonly authServiceUrl = 'http://localhost:3002';
  private readonly productServiceUrl = 'http://localhost:3003';

  constructor(private readonly httpService: HttpService) {}

  // Helper Function สำหรับยิง Request และจัดการ Error
  private async makeRequest(method: 'get' | 'post' | 'patch' | 'delete', url: string, data?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService[method](url, data)
      );
      return response.data;
    } catch (error) {
      // ถ้า Service ปลายทางตอบ Error (เช่น 404, 400) ให้ส่งต่อ Status นั้นเลย
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      // ถ้าติดต่อไม่ได้
      throw new HttpException('Service unavailable', HttpStatus.BAD_GATEWAY);
    }
  }



  async register(data: CreateUserDto) {
    return this.makeRequest('post', `${this.authServiceUrl}/auth/register`, data);
  }
  async login(data: LoginUserDto) {
    return this.makeRequest('post', `${this.authServiceUrl}/auth/login`, data);
  }
  async updateProfile(data: UpdateProfileDto) {
    return this.makeRequest('patch', `${this.authServiceUrl}/auth/profile`, data);
  }

  
  // --- Product Service ---
  async createProduct(data: CreateProductDto) {
    return this.makeRequest('post', `${this.productServiceUrl}/products`, data);
  }

  async findAllProducts() {
    return this.makeRequest('get', `${this.productServiceUrl}/products`);
  }

  async findOneProduct(id: string) {
    return this.makeRequest('get', `${this.productServiceUrl}/products/${id}`);
  }

  async updateProduct(data: UpdateProductDto) {
    const { id, ...updateData } = data;
    return this.makeRequest('patch', `${this.productServiceUrl}/products/${id}`, updateData);
  }

  async deleteProduct(id: string) {
    return this.makeRequest('delete', `${this.productServiceUrl}/products/${id}`);
  }
}