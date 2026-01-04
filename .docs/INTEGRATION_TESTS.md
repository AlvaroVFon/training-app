# Integration Tests - User Flows

This document describes the simulated user flows used to verify the integration of different modules (Auth, Users, Muscle Groups, Exercises, and Workouts).

## Prerequisites

- The application must be running (`docker-compose up`).
- The database should be seeded (`pnpm seed`).
- `jq` must be installed for parsing JSON responses in the terminal.

## Flow 1: New User Onboarding & First Workout

**Goal**: Verify that a new user can register, login, browse exercises, and record their first training session.

1. **Register**:

   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"newuser@example.com", "password":"Password123!", "name":"New User", "age": 25}'
   ```

2. **Login**:

   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"newuser@example.com", "password":"Password123!"}' | jq -r .access_token)
   ```

3. **Browse Exercises**:

   ```bash
   curl -s -X GET http://localhost:3000/exercises -H "Authorization: Bearer $TOKEN" | jq .
   ```

4. **Create Workout**:

   ```bash
   # Get an exercise ID (e.g., Push-ups)
   EX_ID=$(curl -s -X GET http://localhost:3000/exercises -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.name=="Push-ups") | ._id')

   curl -X POST http://localhost:3000/workouts \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d "{
       \"name\": \"Morning Routine\",
       \"exercises\": [
         {
           \"exerciseId\": \"$EX_ID\",
           \"sets\": [
             { \"reps\": 20, \"weight\": 0, \"restTime\": 60 }
           ]
         }
       ]
     }"
   ```

5. **View History**:
   ```bash
   curl -s -X GET http://localhost:3000/workouts -H "Authorization: Bearer $TOKEN" | jq .
   ```

## Flow 2: Admin Management

**Goal**: Verify that an admin can manage system-wide resources.

1. **Login as Admin**:

   ```bash
   ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@training.com", "password":"AdminPassword123!"}' | jq -r .access_token)
   ```

2. **Create Muscle Group** (Should fail if already exists):

   ```bash
   curl -X POST http://localhost:3000/muscle-groups \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"forearms", "description":"Lower arm muscles"}'
   ```

3. **Create Default Exercise**:
   ```bash
   curl -X POST http://localhost:3000/exercises \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "Reverse Wrist Curls", "description": "Isolation", "muscleGroup": "forearms"}'
   ```

## Flow 3: Security & Ownership

**Goal**: Verify that users cannot access or modify each other's data.

1. **Setup**: User A has a workout with ID `WORKOUT_ID`.
2. **User B Login**:

   ```bash
   USER_B_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user_flow_2@example.com", "password":"Password123!"}' | jq -r .access_token)
   ```

3. **Unauthorized Access**:

   ```bash
   # Should return 404 Not Found (filtered by repository)
   curl -X GET http://localhost:3000/workouts/$WORKOUT_ID -H "Authorization: Bearer $USER_B_TOKEN"
   ```

4. **Unauthorized Delete**:
   ```bash
   # Should return 404 Not Found
   curl -X DELETE http://localhost:3000/workouts/$WORKOUT_ID -H "Authorization: Bearer $USER_B_TOKEN"
   ```
