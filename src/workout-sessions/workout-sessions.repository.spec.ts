import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { WorkoutSessionsRepository } from './workout-sessions.repository';
import { WorkoutSession } from './entities/workout-session.entity';
import { SessionStatus } from './enums/session-status.enum';

describe('WorkoutSessionsRepository', () => {
  let repository: WorkoutSessionsRepository;
  let model: any;

  const mockWorkoutSession = {
    _id: new Types.ObjectId(),
    name: 'Test Session',
    user: new Types.ObjectId(),
    status: SessionStatus.OPEN,
    startDate: new Date(),
    exercises: [],
    save: jest.fn(),
  };

  const mockWorkoutSessionModel = jest
    .fn()
    .mockImplementation(() => mockWorkoutSession);
  (mockWorkoutSessionModel as any).find = jest.fn();
  (mockWorkoutSessionModel as any).findOne = jest.fn();
  (mockWorkoutSessionModel as any).findOneAndUpdate = jest.fn();
  (mockWorkoutSessionModel as any).findOneAndDelete = jest.fn();
  (mockWorkoutSessionModel as any).countDocuments = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutSessionsRepository,
        {
          provide: getModelToken(WorkoutSession.name),
          useValue: mockWorkoutSessionModel,
        },
      ],
    }).compile();

    repository = module.get<WorkoutSessionsRepository>(
      WorkoutSessionsRepository,
    );
    model = module.get(getModelToken(WorkoutSession.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const userId = new Types.ObjectId().toHexString();
      const createDto = {
        name: 'New Session',
        exercises: [],
      };
      mockWorkoutSession.save.mockResolvedValue(mockWorkoutSession);

      const result = await repository.create(createDto, userId);

      expect(result).toEqual(mockWorkoutSession);
      expect(mockWorkoutSession.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated sessions', async () => {
      const userId = new Types.ObjectId().toHexString();
      const sessions = [mockWorkoutSession];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sessions),
      };

      model.find.mockReturnValue(mockQuery);
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await repository.findAll(userId, { page: 1, limit: 10 });

      expect(result.data).toEqual(sessions);
      expect(result.total).toBe(1);
      expect(model.find).toHaveBeenCalledWith({
        user: new Types.ObjectId(userId),
      });
    });

    it('should return filtered sessions when search is provided', async () => {
      const userId = new Types.ObjectId().toHexString();
      const sessions = [mockWorkoutSession];
      const search = 'test';
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sessions),
      };

      model.find.mockReturnValue(mockQuery);
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      await repository.findAll(userId, { page: 1, limit: 10, search });

      expect(model.find).toHaveBeenCalledWith({
        user: new Types.ObjectId(userId),
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single session', async () => {
      const userId = new Types.ObjectId().toHexString();
      const sessionId = new Types.ObjectId().toHexString();
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockWorkoutSession),
      };

      model.findOne.mockReturnValue(mockQuery);

      const result = await repository.findOne(sessionId, userId);

      expect(result).toEqual(mockWorkoutSession);
      expect(model.findOne).toHaveBeenCalledWith({
        _id: new Types.ObjectId(sessionId),
        user: new Types.ObjectId(userId),
      });
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const userId = new Types.ObjectId().toHexString();
      const sessionId = new Types.ObjectId().toHexString();
      const updateDto = { name: 'Updated Name' };
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockWorkoutSession),
      };

      model.findOneAndUpdate.mockReturnValue(mockQuery);

      const result = await repository.update(sessionId, updateDto, userId);

      expect(result).toEqual(mockWorkoutSession);
      expect(model.findOneAndUpdate).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a session', async () => {
      const userId = new Types.ObjectId().toHexString();
      const sessionId = new Types.ObjectId().toHexString();
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockWorkoutSession),
      };

      model.findOneAndDelete.mockReturnValue(mockQuery);

      const result = await repository.remove(sessionId, userId);

      expect(result).toEqual(mockWorkoutSession);
      expect(model.findOneAndDelete).toHaveBeenCalledWith({
        _id: new Types.ObjectId(sessionId),
        user: new Types.ObjectId(userId),
      });
    });
  });
});
