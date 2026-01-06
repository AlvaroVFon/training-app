# Integration Tests - User Flows

This document describes the simulated user flows used to verify the integration of different modules (Auth, Users, Muscle Groups, Exercises, and Workouts).

## Prerequisites

- The application must be running (`docker-compose up`).
- The database should be seeded (`pnpm seed`).
- `jq` must be installed for parsing JSON responses in the terminal.

## Pagination & Limits

The API uses a centralized `PaginationService`. By default:

- **Default Limit**: 10 items.
- **Max Limit**: 100 items.
- **Normalization**: If a limit > 100 is requested, it will be capped at 100. If a page < 1 is requested, it will default to 1.

## Flow 1: Training Lifecycle (Template -> Session -> Stats)

**Goal**: Verify the complete flow from creating a blueprint to recording a session and seeing it reflected in statistics.

1. **Register & Login**:

   ```bash
   curl -s -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"athlete@example.com", "password":"Password123!", "name":"Athlete", "age": 22}'

   TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"athlete@example.com", "password":"Password123!"}' | jq -r .access_token)
   ```

2. **Create a Workout Template**:

   ```bash
   # Get an exercise ID (e.g., Squats)
   EX_ID=$(curl -s -X GET "http://localhost:3000/exercises?limit=100" -H "Authorization: Bearer $TOKEN" | jq -r '.data[] | select(.name=="Squats") | ._id')

   TMPL_ID=$(curl -s -X POST http://localhost:3000/workouts \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d "{
       \"name\": \"Leg Day Template\",
       \"exercises\": [{ \"exerciseId\": \"$EX_ID\", \"sets\": [{ \"reps\": 10, \"weight\": 0 }] }]
     }" | jq -r .id)
   ```

3. **Start a Session from Template**:

   ```bash
   SESS_ID=$(curl -s -X POST http://localhost:3000/workout-sessions \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d "{
       \"name\": \"Monday Morning Legs\",
       \"workoutTemplateId\": \"$TMPL_ID\",
       \"exercises\": [
         {
           \"exerciseId\": \"$EX_ID\",
           \"sets\": [
             { \"reps\": 12, \"weight\": 60 },
             { \"reps\": 10, \"weight\": 70 }
           ]
         }
       ]
     }" | jq -r .id)
   ```

4. **Close the Session**:

   ```bash
   curl -s -X POST "http://localhost:3000/workout-sessions/$SESS_ID/close" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

5. **View Statistics** (Only closed sessions are counted):
   ```bash
   curl -s -X GET "http://localhost:3000/statistics/summary" \
     -H "Authorization: Bearer $TOKEN" | jq .
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

## Flow 3: Statistics & Progress Tracking

**Goal**: Verify that a user can view their training statistics and exercise progression.

1. **Get Summary**:

   ```bash
   curl -s -X GET "http://localhost:3000/statistics/summary" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

2. **Get Muscle Distribution with Date Filter**:

   ```bash
   curl -s -X GET "http://localhost:3000/statistics/muscle-distribution?startDate=2024-01-01&endDate=2024-12-31" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

3. **Get Exercise Progress**:

   ```bash
   # Use an exercise ID from previous steps
   curl -s -X GET "http://localhost:3000/statistics/progress/$EX_ID" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

4. **Admin viewing User Stats**:
   ```bash
   USER_ID=$(curl -s -X GET "http://localhost:3000/users" -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r '.data[0]._id')
   curl -s -X GET "http://localhost:3000/statistics/summary/$USER_ID" \
     -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
   ```

## Flow 3: Security & Ownership

**Goal**: Verify that users cannot access or modify each other's data and that IDs are validated.

1. **Invalid ID Format**:

   ```bash
   # Should return 400 Bad Request
   curl -X GET http://localhost:3000/workouts/invalid-id -H "Authorization: Bearer $TOKEN"
   ```

2. **Unauthorized Profile Access**:

   ```bash
   # Should return 403 Forbidden
   curl -X GET http://localhost:3000/users/695a85b51d0a7a38e8192c44 -H "Authorization: Bearer $TOKEN"
   ```

3. **Unauthorized Workout Access**:

   ```bash
   # Should return 404 Not Found (filtered by repository for privacy)
   curl -X GET http://localhost:3000/workouts/$WORKOUT_ID -H "Authorization: Bearer $USER_B_TOKEN"
   ```

4. **Admin Override**:
   ```bash
   # Should return 200 OK (Admins can see everything)
   curl -X GET http://localhost:3000/workouts/$WORKOUT_ID -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

## Flow 4: Advanced Search & Filtering

**Goal**: Verify that exercises can be filtered by muscle group.

1. **Filter by Chest**:

   ```bash
   curl -s -X GET "http://localhost:3000/exercises?muscleGroup=chest" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

2. **Filter by Biceps**:

   ```bash
   curl -s -X GET "http://localhost:3000/exercises?muscleGroup=biceps" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

3. **Unauthorized Delete**:
   ```bash
   # Should return 404 Not Found
   curl -X DELETE http://localhost:3000/workouts/$WORKOUT_ID -H "Authorization: Bearer $USER_B_TOKEN"
   ```
