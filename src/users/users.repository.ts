import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<{ data: User[]; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean().exec() as unknown as User;
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    const query = this.userModel.findOne({ email }).lean();
    if (includePassword) {
      query.select('+password');
    }
    return query.exec() as unknown as User;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
