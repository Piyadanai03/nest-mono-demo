import { Test, TestingModule } from '@nestjs/testing';
import { Demo2Controller } from './demo-2.controller';
import { Demo2Service } from './demo-2.service';
import { DemoMessageDto, DemoResponseDto } from '@app/shared-lib';

describe('Demo2Controller', () => {
  let controller: Demo2Controller;
  let service: Demo2Service;

  // สร้าง Mock Object ของ Service
  const mockDemo2Service = {
    processData: jest.fn().mockImplementation((dto: DemoMessageDto) => {
      return {
        status: 'SUCCESS',
        data: `Processed message: "${dto.message}"`,
        timestamp: Date.now(),
      } as DemoResponseDto;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Demo2Controller],
      providers: [
        // แทนที่ Service ตัวจริง ด้วย Mock
        {
          provide: Demo2Service,
          useValue: mockDemo2Service,
        },
      ],
    }).compile();

    controller = module.get<Demo2Controller>(Demo2Controller);
    service = module.get<Demo2Service>(Demo2Service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle get_demo_data message pattern', () => {
    // Arrange: เตรียมข้อมูล Input
    const inputDto: DemoMessageDto = {
      id: 99,
      message: 'Test Message',
    };

    // Act: เรียกใช้งาน Controller Function
    const result = controller.handleGetDemoData(inputDto);

    // Assert: ตรวจสอบผลลัพธ์
    expect(result.status).toBe('SUCCESS');
    expect(result.data).toContain('Test Message');
    
    // ตรวจสอบว่า Service ถูกเรียกพร้อม argument ที่ถูกต้อง
    expect(service.processData).toHaveBeenCalledWith(inputDto);
  });
});