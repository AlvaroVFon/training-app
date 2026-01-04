import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MuscleGroupsService } from '../muscle-groups/muscle-groups.service';
import { SEED_USERS } from './data/users.data';
import { SEED_MUSCLE_GROUPS } from './data/muscle-groups.data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly muscleGroupsService: MuscleGroupsService,
  ) {}

  async runSeed() {
    this.logger.log('Starting seed process...');
    await this.seedUsers();
    await this.seedMuscleGroups();
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

  async seedMuscleGroups() {
    this.logger.log('Seeding muscle groups...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const mgData of SEED_MUSCLE_GROUPS) {
      const existingMg = await this.muscleGroupsService.findByName(mgData.name);
      if (!existingMg) {
        await this.muscleGroupsService.create(mgData);
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    this.logger.log(
      `Muscle Groups: ${createdCount} created, ${skippedCount} skipped (already exist).`,
    );
  }
}
