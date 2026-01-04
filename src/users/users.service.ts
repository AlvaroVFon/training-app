import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CryptoService } from '../crypto/crypto.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
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

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    return user;
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
