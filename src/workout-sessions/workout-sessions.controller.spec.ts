import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutSessionsController } from './workout-sessions.controller';
import { WorkoutSessionsService } from './workout-sessions.service';
import { SessionStatus } from './enums/session-status.enum';

describe('WorkoutSessionsController', () => {
  let controller: WorkoutSessionsController;
  let service: any;

  const mockSessionDto = {
    id: 'sessionId',
    name: 'Test Session',
    status: SessionStatus.OPEN,
    startDate: new Date(),
    exercises: [],
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    close: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutSessionsController],
      providers: [
        {
          provide: WorkoutSessionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<WorkoutSessionsController>(
      WorkoutSessionsController,
    );
    service = module.get<WorkoutSessionsService>(WorkoutSessionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      service.create.mockResolvedValue(mockSessionDto);
      const result = await controller.create({ name: 'Test' } as any, 'userId');
      expect(result).toEqual(mockSessionDto);
      expect(service.create).toHaveBeenCalledWith({ name: 'Test' }, 'userId');
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const mockResult = { data: [mockSessionDto], meta: {} };
      service.findAll.mockResolvedValue(mockResult);
      const result = await controller.findAll('userId', {});
      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith('userId', {});
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      service.findOne.mockResolvedValue(mockSessionDto);
      const result = await controller.findOne('sessionId', 'userId');
      expect(result).toEqual(mockSessionDto);
      expect(service.findOne).toHaveBeenCalledWith('sessionId', 'userId');
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      service.update.mockResolvedValue(mockSessionDto);
      const result = await controller.update(
        'sessionId',
        { name: 'New' } as any,
        'userId',
      );
      expect(result).toEqual(mockSessionDto);
      expect(service.update).toHaveBeenCalledWith(
        'sessionId',
        { name: 'New' },
        'userId',
      );
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      service.remove.mockResolvedValue(mockSessionDto);
      const result = await controller.remove('sessionId', 'userId');
      expect(result).toEqual(mockSessionDto);
      expect(service.remove).toHaveBeenCalledWith('sessionId', 'userId');
    });
  });

  describe('close', () => {
    it('should call service.close', async () => {
      service.close.mockResolvedValue({
        ...mockSessionDto,
        status: SessionStatus.CLOSED,
      });
      const result = await controller.close('sessionId', 'userId');
      expect(result.status).toBe(SessionStatus.CLOSED);
      expect(service.close).toHaveBeenCalledWith('sessionId', 'userId');
    });
  });
});
