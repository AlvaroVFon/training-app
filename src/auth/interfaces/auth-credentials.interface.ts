import { ProfileDto } from '../dto/profile.dto';
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
  user: ProfileDto;
  access_token: string;
}
