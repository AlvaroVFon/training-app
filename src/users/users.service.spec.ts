import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CryptoService } from '../crypto/crypto.service';
import { PaginationService } from '../common/pagination.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  let cryptoService: CryptoService;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    age: 25,
  };

  const mockUsersRepository = {
    createUser: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockCryptoService = {
    hashString: jest.fn(),
  };

  const mockPaginationService = {
    getPaginationParams: jest.fn().mockReturnValue({ page: 1, limit: 10 }),
    calculateMeta: jest.fn().mockReturnValue({
      total: 1,
      page: 1,
      lastPage: 1,
      limit: 10,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    cryptoService = module.get<CryptoService>(CryptoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create a user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
      };
      mockCryptoService.hashString.mockReturnValue('hashedPassword');
      mockUsersRepository.createUser.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(cryptoService.hashString).toHaveBeenCalledWith('password123');
      expect(repository.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a paginated response of users', async () => {
      const users = [mockUser];
      const pagination = { page: 1, limit: 10 };
      mockUsersRepository.findAll.mockResolvedValue({
        data: users,
        total: 1,
      });

      const result = await service.findAll(pagination);

      expect(repository.findAll).toHaveBeenCalledWith(pagination);
      expect(result.data).toEqual(users);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockUsersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
        false,
      );
      expect(result).toEqual(mockUser);
    });

    it('should return a user with password if includePassword is true', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com', true);

      expect(repository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
        true,
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return the user if found', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateDto };
      mockUsersRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateDto);

      expect(repository.updateUser).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual(updatedUser);
    });

    it('should hash password when updating password', async () => {
      const updateDto = { password: 'newPassword123' };
      const hashedPass = 'newHashedPassword';
      mockCryptoService.hashString.mockReturnValue(hashedPass);
      mockUsersRepository.updateUser.mockResolvedValue({
        ...mockUser,
        password: hashedPass,
      });

      await service.update('1', updateDto);

      expect(cryptoService.hashString).toHaveBeenCalledWith('newPassword123');
      expect(repository.updateUser).toHaveBeenCalledWith('1', {
        password: 'newHashedPassword',
      });
    });

    it('should throw NotFoundException if user to update not found', async () => {
      mockUsersRepository.updateUser.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete and return the user if found', async () => {
      mockUsersRepository.deleteUser.mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(repository.deleteUser).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user to delete not found', async () => {
      mockUsersRepository.deleteUser.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
