import { Controller, Post, Body, Patch } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdateProfileDto } from '@app/shared-lib';
import { AuthService } from './auth-service.service';


@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Patch('profile')
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(updateProfileDto);
  }
}