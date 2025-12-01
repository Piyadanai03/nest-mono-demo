import { Module } from '@nestjs/common';
import { SharedLibService } from './shared-lib.service';

@Module({
  providers: [SharedLibService],
  exports: [SharedLibService],
})
export class SharedLibModule {}
