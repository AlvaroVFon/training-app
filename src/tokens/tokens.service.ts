import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Role } from '../auth/enums/role.enum';

export interface TokenPayload {
  sub: string;
  roles: Role[];
  type?: string;
  [key: string]: any;
}

@Injectable()
export class TokensService {
  private readonly jwtExpiration: string;
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtExpiration = this.configService.get<string>(
      'jwtExpiration',
      '3600s',
    );
    this.jwtSecret = this.configService.get<string>(
      'jwtSecret',
      'defaultSecret',
    );
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration as jwt.SignOptions['expiresIn'],
    });
  }
}
