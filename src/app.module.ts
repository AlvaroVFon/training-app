import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CryptoModule } from './crypto/crypto.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { MuscleGroupsModule } from './muscle-groups/muscle-groups.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: `mongodb://${config.get<string>('dbHost')}:${config.get<number>('dbPort')}/${config.get<string>('dbDatabase')}?authSource=admin`,
        user: config.get<string>('dbUsername'),
        pass: config.get<string>('dbPassword'),
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    CryptoModule,
    TokensModule,
    AuthModule,
    SeedModule,
    MuscleGroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
