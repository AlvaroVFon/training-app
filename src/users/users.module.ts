import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from '../crypto/crypto.module';
import { User, UserSchema } from './entities/user.entity';
import { CommonModule } from '../common/common.module';
import { UserIsSelfGuard } from '../auth/guards/user-is-self.guard';
import { ValidateObjectIdGuard } from '../auth/guards/validate-object-id.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CryptoModule,
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UserIsSelfGuard,
    ValidateObjectIdGuard,
  ],
  exports: [UsersService],
})
export class UsersModule {}
