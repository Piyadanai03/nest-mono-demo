import { Test, TestingModule } from '@nestjs/testing';
import { SharedLibService } from './shared-lib.service';

describe('SharedLibService', () => {
  let service: SharedLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedLibService],
    }).compile();

    service = module.get<SharedLibService>(SharedLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
