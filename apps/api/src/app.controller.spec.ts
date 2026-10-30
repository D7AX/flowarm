import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { PrismaService } from './prisma/prisma.service.js';

describe('AppController', () => {
  let appController: AppController;

  const mockPrismaService = {
    $queryRaw: vi.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('health', () => {
    it('should return the API health status', () => {
      const result = appController.getHealth();

      expect(result.status).toBe('ok');
      expect(result.service).toBe('flowarm-api');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('database health', () => {
    it('should return database connected status', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await appController.getDatabaseHealth();

      expect(mockPrismaService.$queryRaw).toHaveBeenCalled();
      expect(result.status).toBe('ok');
      expect(result.database).toBe('connected');
    });
  });
});