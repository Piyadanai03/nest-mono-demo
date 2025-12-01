import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { of } from 'rxjs'; // ใช้สร้าง Observable ปลอม
import { DemoResponseDto } from '@app/shared-lib';

describe('ApiGatewayController', () => {
  let controller: ApiGatewayController;
  let service: ApiGatewayService;

  // สร้าง Mock Object ของ Service
  const mockApiGatewayService = {
    sendRequestToDemo2: jest.fn().mockImplementation(() => {
      // คืนค่าเป็น Observable ปลอมๆ ตามที่ Controller คาดหวัง
      const result: DemoResponseDto = {
        status: 'SUCCESS',
        data: 'Mocked Data',
        timestamp: 1234567890,
      };
      return of(result);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayController],
      providers: [
        // แทนที่ Service ตัวจริง ด้วย Mock ที่เราสร้างขึ้น
        {
          provide: ApiGatewayService,
          useValue: mockApiGatewayService,
        },
      ],
    }).compile();

    controller = module.get<ApiGatewayController>(ApiGatewayController);
    service = module.get<ApiGatewayService>(ApiGatewayService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.sendRequestToDemo2 and return result', (done) => {
    // Act: เรียกใช้งาน Controller
    controller.getDataFromDemo2().subscribe((result) => {
      
      // Assert: ตรวจสอบผลลัพธ์
      expect(result).toEqual({
        status: 'SUCCESS',
        data: 'Mocked Data',
        timestamp: 1234567890,
      });
      
      // ตรวจสอบว่า Service ถูกเรียกใช้งานจริง
      expect(service.sendRequestToDemo2).toHaveBeenCalled();
      
      done(); // บอก Jest ว่า Test เสร็จสิ้น (เพราะเป็น Async/Observable)
    });
  });
});