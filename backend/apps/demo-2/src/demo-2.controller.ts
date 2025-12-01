import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Demo2Service } from './demo-2.service';
import { DemoMessageDto, DemoResponseDto } from '@app/shared-lib';

@Controller()
export class Demo2Controller {
  constructor(private readonly demo2Service: Demo2Service) {}

  @MessagePattern('get_demo_data')
  handleGetDemoData(data: DemoMessageDto): DemoResponseDto {
    return this.demo2Service.processData(data);
  }
}