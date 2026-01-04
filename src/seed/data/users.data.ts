import { Role } from '../../auth/enums/role.enum';

export const SEED_USERS = [
  {
    email: 'admin@training.com',
    password: 'AdminPassword123!',
    name: 'System Admin',
    age: 35,
    roles: [Role.ADMIN],
  },
  {
    email: 'user@training.com',
    password: 'UserPassword123!',
    name: 'Regular User',
    age: 28,
    roles: [Role.USER],
  },
  {
    email: 'athlete@training.com',
    password: 'AthletePassword123!',
    name: 'Pro Athlete',
    age: 24,
    roles: [Role.USER],
  },
];
