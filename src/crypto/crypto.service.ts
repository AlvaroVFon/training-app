import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  constructor(private configService: ConfigService) {}

  hashString(input: string): string {
    return bcrypt.hashSync(
      input,
      this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10),
    );
  }

  compareHash(input: string, hash: string): boolean {
    return bcrypt.compareSync(input, hash);
  }
}
