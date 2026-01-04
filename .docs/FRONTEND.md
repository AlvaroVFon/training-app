# Frontend Integration Guide

## API Contracts

All API contracts are documented using Swagger. You can access the interactive UI at:
`http://localhost:3000/api`

From there, you can:

- View all available endpoints.
- See request/response schemas (DTOs).
- Test endpoints directly from the browser.

## Authentication & Authorization

1. **Login/Register**: Send a POST request to `/auth/login` or `/auth/register`.
2. **Token**: On success, you will receive an `access_token`.
3. **Authorization**: Include this token in the `Authorization` header for protected requests:
   `Authorization: Bearer <your_token>`
4. **Roles**: The API uses Role-Based Access Control (RBAC). Some endpoints are restricted to `admin` users.

## Pagination

All list endpoints (`GET` requests returning arrays) follow a standard pagination pattern:

- **Query Parameters**:
  - `page`: The page number (default: `1`).
  - `limit`: Items per page (default: `10`, max: `100`).
- **Response Structure**:
  ```json
  {
    "data": [...],
    "meta": {
      "total": 100,
      "page": 1,
      "lastPage": 10,
      "limit": 10
    }
  }
  ```

## Key Endpoints

### Auth

- `POST /auth/register`: Create a new account and get a JWT immediately.
- `POST /auth/login`: Authenticate and get a JWT.

### Users

- `GET /users`: List all users (Requires `admin` role).
- `POST /users`: Create a new user (Public).
- `GET /users/:id`: Get user details (Requires Auth).
- `PATCH /users/:id`: Update user details (Requires Auth).
- `DELETE /users/:id`: Remove a user (Requires `admin` role).

### Muscle Groups

- `GET /muscle-groups`: List all muscle groups (Public/Auth).
- `POST /muscle-groups`: Create a new muscle group (Requires `admin` role).
- `GET /muscle-groups/:id`: Get muscle group details (Public/Auth).
- `PATCH /muscle-groups/:id`: Update a muscle group (Requires `admin` role).
- `DELETE /muscle-groups/:id`: Remove a muscle group (Requires `admin` role).

### Exercises

- `GET /exercises`: List all accessible exercises (Default + User's own).
- `POST /exercises`: Create a new private exercise.
- `GET /exercises/:id`: Get exercise details (Must be default or owned by user).
- `PATCH /exercises/:id`: Update an exercise (Users can update their own).
- `DELETE /exercises/:id`: Remove an exercise (Users can delete their own).

### Workouts

- `GET /workouts`: Retrieve workout history for the current user.
- `POST /workouts`: Register a new training session.
- `GET /workouts/:id`: Get details of a specific workout.
- `PATCH /workouts/:id`: Update a workout session.
- `DELETE /workouts/:id`: Remove a workout from history.

### AI Analysis (Coming Soon)

- `GET /workouts/:id/analysis`: Get AI-powered analysis for a specific session.

## Error Handling

The API returns standard HTTP status codes:

- `200/201`: Success
- `400`: Validation Error (check response body for details)
- `401`: Unauthorized (missing or invalid token)
- `404`: Resource Not Found
- `500`: Internal Server Error
