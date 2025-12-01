import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DemoMessageDto, DemoResponseDto } from '@app/shared-lib';
import { Observable } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('DEMO_2_SERVICE') private clientDemo2: ClientProxy,
  ) {}

  sendRequestToDemo2(): Observable<DemoResponseDto> {
    const payload: DemoMessageDto = {
      id: 101,
      message: 'Hello from API Gateway',
    };
    
    // ส่งข้อมูลไปยัง Pattern 'get_demo_data'
    return this.clientDemo2.send<DemoResponseDto, DemoMessageDto>(
      'get_demo_data',
      payload,
    );
  }
}