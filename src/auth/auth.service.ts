import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CryptoService } from '../crypto/crypto.service';
import { TokenPayload, TokensService } from '../tokens/tokens.service';
import {
  LocalCredentials,
  LoginResponse,
} from './interfaces/auth-credentials.interface';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly tokensService: TokensService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<LoginResponse> {
    const user = await this.usersService.create(createUserDto);
    return this.login(user as any);
  }

  async validateUser(credentials: LocalCredentials): Promise<User | null> {
    const user = await this.usersService.findByEmail(credentials.email, true);

    if (
      user &&
      this.cryptoService.compareHash(credentials.password, user.password)
    ) {
      return user;
    }

    return null;
  }

  login(user: User & { _id: any }): LoginResponse {
    const payload: TokenPayload = {
      sub: user._id.toString(),
      type: 'access',
    };

    return {
      user,
      access_token: this.tokensService.generateToken(payload),
    };
  }
}
