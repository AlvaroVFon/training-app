import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SEED_USERS } from './data/users.data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly usersService: UsersService) {}

  async runSeed() {
    this.logger.log('Starting seed process...');
    await this.seedUsers();
    this.logger.log('Seed process completed successfully.');
  }

  async seedUsers() {
    this.logger.log('Seeding users...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of SEED_USERS) {
      const existingUser = await this.usersService.findByEmail(userData.email);
      if (!existingUser) {
        await this.usersService.create(userData);
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    this.logger.log(
      `Users: ${createdCount} created, ${skippedCount} skipped (already exist).`,
    );
  }
}
