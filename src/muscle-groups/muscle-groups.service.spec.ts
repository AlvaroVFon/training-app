import { Test, TestingModule } from '@nestjs/testing';
import { MuscleGroupsService } from './muscle-groups.service';
import { MuscleGroupsRepository } from './muscle-groups.repository';
import { MuscleGroup as MuscleGroupEnum } from './enums/muscle-group.enum';
import { PaginationService } from '../common/pagination.service';
import { NotFoundException } from '@nestjs/common';

describe('MuscleGroupsService', () => {
  let service: MuscleGroupsService;
  let repository: MuscleGroupsRepository;

  const mockMuscleGroup = {
    id: '1',
    name: MuscleGroupEnum.CHEST,
    description: 'Chest muscles',
  };

  const mockMuscleGroupsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
        MuscleGroupsService,
        {
          provide: MuscleGroupsRepository,
          useValue: mockMuscleGroupsRepository,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<MuscleGroupsService>(MuscleGroupsService);
    repository = module.get<MuscleGroupsRepository>(MuscleGroupsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a muscle group', async () => {
      const dto = { name: MuscleGroupEnum.CHEST, description: 'Chest muscles' };
      mockMuscleGroupsRepository.create.mockResolvedValue(mockMuscleGroup);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockMuscleGroup);
    });
  });

  describe('findAll', () => {
    it('should return a paginated response of muscle groups', async () => {
      const pagination = { page: 1, limit: 10 };
      mockMuscleGroupsRepository.findAll.mockResolvedValue({
        data: [mockMuscleGroup],
        total: 1,
      });

      const result = await service.findAll(pagination);

      expect(repository.findAll).toHaveBeenCalledWith(pagination);
      expect(result.data).toEqual([mockMuscleGroup]);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a muscle group if found', async () => {
      mockMuscleGroupsRepository.findById.mockResolvedValue(mockMuscleGroup);

      const result = await service.findOne('1');

      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockMuscleGroup);
    });

    it('should throw NotFoundException if not found', async () => {
      mockMuscleGroupsRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a muscle group', async () => {
      const dto = { description: 'Updated description' };
      mockMuscleGroupsRepository.update.mockResolvedValue({
        ...mockMuscleGroup,
        ...dto,
      });

      const result = await service.update('1', dto);

      expect(repository.update).toHaveBeenCalledWith('1', dto);
      expect(result.description).toEqual('Updated description');
    });

    it('should throw NotFoundException if not found', async () => {
      mockMuscleGroupsRepository.update.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a muscle group', async () => {
      mockMuscleGroupsRepository.delete.mockResolvedValue(mockMuscleGroup);

      const result = await service.remove('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockMuscleGroup);
    });

    it('should throw NotFoundException if not found', async () => {
      mockMuscleGroupsRepository.delete.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
