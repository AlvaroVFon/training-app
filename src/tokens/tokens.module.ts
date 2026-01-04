import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
