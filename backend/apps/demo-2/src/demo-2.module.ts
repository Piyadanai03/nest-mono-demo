import { Module } from '@nestjs/common';
import { Demo2Controller } from './demo-2.controller';
import { Demo2Service } from './demo-2.service';

@Module({
  imports: [],
  controllers: [Demo2Controller],
  providers: [Demo2Service],
})
export class Demo2Module {}