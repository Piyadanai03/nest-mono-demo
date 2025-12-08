import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // พยายามหา User ID จาก 2 แหล่ง
    // - req.user (จาก AuthGuard ใน Gateway)
    // - req.headers['x-user-id'] (จาก Microservice ที่รับต่อมา)
    const userId = request.user?.userId || request.headers['x-user-id'];
    
    // ถ้าเจอ ให้ยัดใส่ CLS Context
    if (userId) {
      this.cls.set('userId', userId);
    }

    return next.handle();
  }
}