import { User } from '../../users/entities/user.entity';
import { Role } from '../enums/role.enum';

export interface LocalCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string; // userId
  roles: Role[];
  type?: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}
