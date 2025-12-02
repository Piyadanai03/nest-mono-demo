import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //  ดึง Role ที่เรากำหนดไว้ที่หัว Function (เช่นต้องเป็น 'ADMIN')
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // ถ้าไม่ได้แปะป้ายห้ามไว้ ก็ให้ผ่านได้เลย
    }

    // ดึง User จาก Request (ได้มาจาก JWT Guard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 3. เช็คว่า Role ของ User ตรงกับที่ต้องการไหม
    if (requiredRoles.includes(user.role)) {
      return true;
    }
    throw new ForbiddenException('คุณไม่มีสิทธิ์ใช้งานส่วนนี้ (Admin Only)');
  }
}