import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { DemoResponseDto } from '@app/shared-lib';
import { Observable } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get('data-from-demo2')
  getDataFromDemo2(): Observable<DemoResponseDto> {
    return this.apiGatewayService.sendRequestToDemo2();
  }
}