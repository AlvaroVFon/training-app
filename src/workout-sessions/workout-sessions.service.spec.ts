import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WorkoutSessionsService } from './workout-sessions.service';
import { WorkoutSessionsRepository } from './workout-sessions.repository';
import { PaginationService } from '../common/pagination.service';
import { SessionStatus } from './enums/session-status.enum';

describe('WorkoutSessionsService', () => {
  let service: WorkoutSessionsService;
  let repository: any;

  const mockSession = {
    _id: 'sessionId',
    name: 'Test Session',
    user: 'userId',
    status: SessionStatus.OPEN,
    startDate: new Date(),
    exercises: [],
  };

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPaginationService = {
    getPaginationParams: jest.fn().mockReturnValue({ page: 1, limit: 10 }),
    calculateMeta: jest.fn().mockReturnValue({ total: 1, page: 1, limit: 10 }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutSessionsService,
        {
          provide: WorkoutSessionsRepository,
          useValue: mockRepository,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<WorkoutSessionsService>(WorkoutSessionsService);
    repository = module.get<WorkoutSessionsRepository>(
      WorkoutSessionsRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a session and return DTO', async () => {
      repository.create.mockResolvedValue(mockSession);
      const result = await service.create({ name: 'Test' } as any, 'userId');
      expect(result.id).toBe('sessionId');
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated response', async () => {
      repository.findAll.mockResolvedValue({ data: [mockSession], total: 1 });
      const result = await service.findAll('userId', {});
      expect(result.data).toHaveLength(1);
      expect(result.meta).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a session if found', async () => {
      repository.findOne.mockResolvedValue(mockSession);
      const result = await service.findOne('sessionId', 'userId');
      expect(result.id).toBe('sessionId');
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id', 'user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return DTO', async () => {
      repository.findOne.mockResolvedValue(mockSession);
      repository.update.mockResolvedValue({ ...mockSession, name: 'Updated' });
      const result = await service.update(
        'sessionId',
        { name: 'Updated' } as any,
        'userId',
      );
      expect(result.name).toBe('Updated');
    });

    it('should throw NotFoundException if session does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update('id', {} as any, 'user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('close', () => {
    it('should close a session', async () => {
      repository.update.mockResolvedValue({
        ...mockSession,
        status: SessionStatus.CLOSED,
        endDate: new Date(),
      });
      const result = await service.close('sessionId', 'userId');
      expect(result.status).toBe(SessionStatus.CLOSED);
      expect(repository.update).toHaveBeenCalledWith(
        'sessionId',
        expect.objectContaining({ status: SessionStatus.CLOSED }),
        'userId',
      );
    });

    it('should throw NotFoundException if session not found during close', async () => {
      repository.update.mockResolvedValue(null);
      await expect(service.close('id', 'user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return DTO', async () => {
      repository.remove.mockResolvedValue(mockSession);
      const result = await service.remove('sessionId', 'userId');
      expect(result.id).toBe('sessionId');
    });

    it('should throw NotFoundException if session not found during remove', async () => {
      repository.remove.mockResolvedValue(null);
      await expect(service.remove('id', 'user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
