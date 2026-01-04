import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CryptoService } from '../crypto/crypto.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationService } from '../common/pagination.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
    private readonly paginationService: PaginationService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = this.cryptoService.hashString(
      createUserDto.password,
    );

    return this.usersRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<User>> {
    const pagination = this.paginationService.getPaginationParams(query);
    const { data, total } = await this.usersRepository.findAll(pagination);

    return {
      data,
      meta: this.paginationService.calculateMeta(
        total,
        pagination.page,
        pagination.limit,
      ),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    return user;
  }
  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    return this.usersRepository.findByEmail(email, includePassword);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.updateUser(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.usersRepository.deleteUser(id);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    return user;
  }
}
