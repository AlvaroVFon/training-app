import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let model: Model<User>;

  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    age: 25,
  };

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    findById: jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    }),
    findOne: jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn(),
      }),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      mockUserModel.create.mockResolvedValue(mockUser);
      const result = await repository.createUser(mockUser as any);
      expect(result).toEqual(mockUser);
      expect(mockUserModel.create).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.create.mockRejectedValue({ code: 11000 });
      await expect(repository.createUser(mockUser as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw original error if it is not a duplicate key error', async () => {
      const error = new Error('Some other error');
      mockUserModel.create.mockRejectedValue(error);
      await expect(repository.createUser(mockUser as any)).rejects.toThrow(
        error,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      const total = 1;
      mockUserModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(users),
          }),
        }),
      } as any);
      mockUserModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      } as any);

      const result = await repository.findAll({ page: 1, limit: 10 });
      expect(result).toEqual({ data: users, total });
      expect(mockUserModel.find).toHaveBeenCalledWith({});
    });

    it('should return filtered users when search is provided', async () => {
      const users = [mockUser];
      const total = 1;
      const search = 'test';
      mockUserModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(users),
          }),
        }),
      } as any);
      mockUserModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      } as any);

      const result = await repository.findAll({ page: 1, limit: 10, search });
      expect(result).toEqual({ data: users, total });
      expect(mockUserModel.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      });
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      } as any);

      const result = await repository.findById('someId');
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('someId');
    });

    it('should return null if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      } as any);

      const result = await repository.findById('someId');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const mockQuery = {
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      };
      mockUserModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should include password if includePassword is true', async () => {
      const mockQuery = {
        lean: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      };
      mockUserModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findByEmail('test@example.com', true);
      expect(result).toEqual(mockUser);
      expect(mockQuery.select).toHaveBeenCalledWith('+password');
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateDto };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const result = await repository.updateUser('someId', updateDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'someId',
        updateDto,
        { new: true },
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete and return the user', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await repository.deleteUser('someId');
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('someId');
    });
  });
});
