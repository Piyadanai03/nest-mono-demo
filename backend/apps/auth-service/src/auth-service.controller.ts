import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth-service.service';
import { CreateUserDto, LoginUserDto, UpdateProfileDto } from '@app/shared-lib';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  // รอรับคำสั่งหัวข้อ 'auth.register'
  @MessagePattern('auth.register')
  async handleRegister(@Payload() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @MessagePattern('auth.login')
  async handleLogin(@Payload() data: LoginUserDto) {
    return this.authService.login(data);
  }

  @MessagePattern('auth.updateProfile')
  async handleUpdateProfile(@Payload() data: UpdateProfileDto) {
    return this.authService.updateProfile(data);
  }
}