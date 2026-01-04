import { User } from '../../users/entities/user.entity';

export interface LocalCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string; // userId
  type?: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}
