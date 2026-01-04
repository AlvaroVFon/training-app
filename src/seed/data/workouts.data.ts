export const SEED_WORKOUTS = [
  {
    name: 'Full Body Routine A',
    notes: 'Focus on compound movements',
    exercises: [
      {
        exerciseName: 'Squat',
        sets: [
          { reps: 10, weight: 60, restTime: 120, notes: 'Warm up' },
          { reps: 8, weight: 80, restTime: 120 },
          { reps: 8, weight: 80, restTime: 120 },
        ],
      },
      {
        exerciseName: 'Bench Press',
        sets: [
          { reps: 10, weight: 40, restTime: 90 },
          { reps: 8, weight: 60, restTime: 90 },
          { reps: 8, weight: 60, restTime: 90 },
        ],
      },
    ],
  },
  {
    name: 'Calisthenics Basics',
    notes: 'Bodyweight only',
    exercises: [
      {
        exerciseName: 'Push-ups',
        sets: [
          { reps: 15, weight: 0, restTime: 60 },
          { reps: 15, weight: 0, restTime: 60 },
          { reps: 15, weight: 0, restTime: 60 },
        ],
      },
      {
        exerciseName: 'Pull-ups',
        sets: [
          { reps: 8, weight: 0, restTime: 90 },
          { reps: 8, weight: 0, restTime: 90 },
          { reps: 8, weight: 0, restTime: 90 },
        ],
      },
    ],
  },
];
