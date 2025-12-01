import { Injectable } from '@nestjs/common';
import { DemoMessageDto, DemoResponseDto } from '@app/shared-lib';

@Injectable()
export class Demo2Service {
  processData(data: DemoMessageDto): DemoResponseDto {
    console.log(`[Demo-2] Processing ID: ${data.id}`);
    return {
      status: 'SUCCESS',
      data: `Processed message: "${data.message}"`,
      timestamp: Date.now(),
    };
  }
}