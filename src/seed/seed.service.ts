import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MuscleGroupsService } from '../muscle-groups/muscle-groups.service';
import { ExercisesService } from '../exercises/exercises.service';
import { WorkoutsService } from '../workouts/workouts.service';
import { SEED_USERS } from './data/users.data';
import { SEED_MUSCLE_GROUPS } from './data/muscle-groups.data';
import { SEED_EXERCISES } from './data/exercises.data';
import { SEED_WORKOUTS } from './data/workouts.data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly muscleGroupsService: MuscleGroupsService,
    private readonly exercisesService: ExercisesService,
    private readonly workoutsService: WorkoutsService,
  ) {}

  async runSeed() {
    this.logger.log('Starting seed process...');
    await this.seedUsers();
    await this.seedMuscleGroups();
    await this.seedExercises();
    await this.seedWorkouts();
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

  async seedExercises() {
    this.logger.log('Seeding exercises...');
    let createdCount = 0;
    const skippedCount = 0;

    for (const exerciseData of SEED_EXERCISES) {
      const existing = await this.exercisesService.createDefault(exerciseData);
      if (existing) {
        // Since createDefault handles existence check, we just count
        // This is a bit simplified, but works for seeding
        createdCount++;
      }
    }

    this.logger.log(`Exercises: Seeding process finished.`);
  }

  async seedWorkouts() {
    this.logger.log('Seeding workouts...');
    const { data: users } = await this.usersService.findAll({
      page: 1,
      limit: 10,
    });
    if (users.length === 0) {
      this.logger.warn('No users found to assign workouts.');
      return;
    }

    const targetUser = users[0];
    const { data: existingWorkouts } = await this.workoutsService.findAll(
      (targetUser as any)._id.toString(),
      { page: 1, limit: 10 },
    );

    if (existingWorkouts.length > 0) {
      this.logger.log('Workouts already seeded for the first user.');
      return;
    }

    const { data: exercises } = await this.exercisesService.findAll(
      (targetUser as any)._id.toString(),
      { page: 1, limit: 100 },
    );

    for (const workoutData of SEED_WORKOUTS) {
      const mappedExercises = workoutData.exercises
        .map((ex) => {
          const exercise = exercises.find((e) => e.name === ex.exerciseName);
          if (!exercise) return null;
          return {
            exerciseId: (exercise as any)._id.toString(),
            sets: ex.sets,
          };
        })
        .filter((ex) => ex !== null);

      if (mappedExercises.length > 0) {
        await this.workoutsService.create(
          {
            name: workoutData.name,
            notes: workoutData.notes,
            exercises: mappedExercises as any,
          },
          (targetUser as any)._id.toString(),
        );
      }
    }

    this.logger.log('Workouts: Seeding process finished.');
  }
}
